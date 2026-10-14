import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "../generated/prisma/client.js";
import { ClassroomsService } from "../classrooms/classrooms.service.js";
import { paged, skipTake, type PageQuery } from "../common/pagination.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import type { CreatePostDto, ListPostsQuery, UpdatePostDto } from "./dto/posts.dto.js";

const TRENDING_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const EXCERPT = 280;

const cardInclude = (viewerId: string) =>
  ({
    author: { select: userSummarySelect },
    canvas: { select: { id: true, title: true, thumbnailUrl: true, visibility: true, deletedAt: true } },
    _count: { select: { likes: true, comments: { where: { deletedAt: null } } } },
    likes: { where: { userId: viewerId }, select: { userId: true } },
  }) satisfies Prisma.PostInclude;

type CardRow = Prisma.PostGetPayload<{ include: ReturnType<typeof cardInclude> }>;

function toCard(p: CardRow, full = false) {
  const canvas = p.canvas && !p.canvas.deletedAt ? p.canvas : null;
  return {
    id: p.id,
    title: p.title,
    body: full || p.body.length <= EXCERPT ? p.body : `${p.body.slice(0, EXCERPT).trimEnd()}…`,
    category: p.category,
    tags: p.tags,
    imageUrl: p.imageUrl ?? canvas?.thumbnailUrl ?? null,
    visibility: p.visibility,
    classroomId: p.classroomId,
    author: toUserSummary(p.author),
    canvas: canvas && { id: canvas.id, title: canvas.title, thumbnailUrl: canvas.thumbnailUrl },
    likeCount: p._count.likes,
    commentCount: p._count.comments,
    viewCount: p.viewCount,
    liked: p.likes.length > 0,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly classrooms: ClassroomsService,
    private readonly notifications: NotificationsService,
  ) {}

  async feed(userId: string, query: ListPostsQuery) {
    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      classroomId: null,
      author: {
        deletedAt: null,
        status: { not: "BANNED" },
        ...(query.feed === "following" ? { followers: { some: { followerId: userId } } } : {}),
      },
      // Private posts are visible to their author only.
      OR: [{ visibility: "PUBLIC" }, { authorId: userId }],
      ...(query.authorId ? { authorId: query.authorId } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.tag ? { tags: { has: query.tag } } : {}),
      ...(query.q
        ? { AND: [{ OR: [{ title: { contains: query.q, mode: "insensitive" } }, { body: { contains: query.q, mode: "insensitive" } }] }] }
        : {}),
      ...(query.feed === "trending" ? { createdAt: { gt: new Date(Date.now() - TRENDING_WINDOW_MS) } } : {}),
    };
    const orderBy: Prisma.PostOrderByWithRelationInput[] =
      query.feed === "trending" ? [{ likes: { _count: "desc" } }, { viewCount: "desc" }, { createdAt: "desc" }] : [{ createdAt: "desc" }];
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({ where, include: cardInclude(userId), orderBy, ...skipTake(query) }),
      this.prisma.post.count({ where }),
    ]);
    return paged(rows.map((r) => toCard(r)), total, query);
  }

  async create(userId: string, dto: CreatePostDto, classroomId?: string) {
    if (dto.canvasId) await this.checkCanvas(dto.canvasId, userId);
    const post = await this.prisma.post.create({
      data: { ...dto, tags: dedupe(dto.tags), authorId: userId, classroomId, visibility: classroomId ? "PRIVATE" : dto.visibility },
      include: cardInclude(userId),
    });
    return toCard(post, true);
  }

  /** A post can share a canvas only if the author can see it; sharing doesn't change its visibility. */
  private async checkCanvas(canvasId: string, userId: string) {
    const canvas = await this.prisma.canvas.findFirst({
      where: { id: canvasId, deletedAt: null, OR: [{ visibility: "PUBLIC" }, { workspace: { members: { some: { userId } } } }] },
    });
    if (!canvas) throw new BadRequestException("Canvas not found");
  }

  private async visible(postId: string, userId: string) {
    const post = await this.prisma.post.findFirst({ where: { id: postId, deletedAt: null } });
    if (!post) throw new NotFoundException("Post not found");
    if (post.classroomId) {
      const { isInstructor, isEnrolled } = await this.classrooms.access(post.classroomId, userId);
      if (!isInstructor && !isEnrolled) throw new NotFoundException("Post not found");
    } else if (post.visibility === "PRIVATE" && post.authorId !== userId) {
      throw new NotFoundException("Post not found");
    }
    return post;
  }

  async detail(postId: string, userId: string) {
    const post = await this.visible(postId, userId);
    if (post.authorId !== userId) {
      await this.prisma.post.update({ where: { id: postId }, data: { viewCount: { increment: 1 } } });
    }
    const row = await this.prisma.post.findUniqueOrThrow({ where: { id: postId }, include: cardInclude(userId) });
    return toCard(row, true);
  }

  async update(postId: string, userId: string, dto: UpdatePostDto) {
    const post = await this.visible(postId, userId);
    if (post.authorId !== userId) throw new ForbiddenException("You can only edit your own posts");
    if (dto.canvasId) await this.checkCanvas(dto.canvasId, userId);
    const row = await this.prisma.post.update({
      where: { id: postId },
      data: { ...dto, tags: dto.tags ? dedupe(dto.tags) : undefined },
      include: cardInclude(userId),
    });
    return toCard(row, true);
  }

  async remove(postId: string, userId: string) {
    const post = await this.visible(postId, userId);
    if (post.authorId !== userId) throw new ForbiddenException("You can only delete your own posts");
    await this.prisma.post.update({ where: { id: postId }, data: { deletedAt: new Date() } });
  }

  async like(postId: string, userId: string, like: boolean) {
    const post = await this.visible(postId, userId);
    if (like) {
      const existing = await this.prisma.postLike.findUnique({ where: { postId_userId: { postId, userId } } });
      if (!existing) {
        await this.prisma.postLike.create({ data: { postId, userId } });
        const liker = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: userSummarySelect });
        await this.notifications.notify({
          userId: post.authorId,
          actorId: userId,
          type: "POST_LIKE",
          title: "New like",
          body: `${toUserSummary(liker).name} liked "${post.title}"`,
          data: { postId },
        });
      }
    } else {
      await this.prisma.postLike.deleteMany({ where: { postId, userId } });
    }
    const likeCount = await this.prisma.postLike.count({ where: { postId } });
    return { liked: like, likeCount };
  }

  // ─── Comments ──────────────────────────────────────────────────────────────

  async comments(postId: string, userId: string, query: PageQuery) {
    await this.visible(postId, userId);
    const where = { postId, deletedAt: null };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.postComment.findMany({
        where,
        orderBy: { createdAt: "asc" },
        include: { author: { select: userSummarySelect } },
        ...skipTake(query),
      }),
      this.prisma.postComment.count({ where }),
    ]);
    const items = rows.map((c) => ({
      id: c.id,
      body: c.body,
      author: toUserSummary(c.author),
      isMine: c.authorId === userId,
      createdAt: c.createdAt,
    }));
    return paged(items, total, query);
  }

  async comment(postId: string, userId: string, body: string) {
    const post = await this.visible(postId, userId);
    const comment = await this.prisma.postComment.create({
      data: { postId, authorId: userId, body },
      include: { author: { select: userSummarySelect } },
    });
    const author = toUserSummary(comment.author);
    await this.notifications.notify({
      userId: post.authorId,
      actorId: userId,
      type: "POST_COMMENT",
      title: "New comment",
      body: `${author.name} commented on "${post.title}"`,
      data: { postId, ...(post.classroomId ? { classroomId: post.classroomId } : {}) },
    });
    return { id: comment.id, body: comment.body, author, isMine: true, createdAt: comment.createdAt };
  }

  async removeComment(commentId: string, userId: string) {
    const comment = await this.prisma.postComment.findFirst({ where: { id: commentId, deletedAt: null }, include: { post: true } });
    if (!comment) throw new NotFoundException("Comment not found");
    // Authors can delete their comments; post authors can clean up their threads.
    if (comment.authorId !== userId && comment.post.authorId !== userId) {
      throw new ForbiddenException("You can't delete this comment");
    }
    await this.prisma.postComment.update({ where: { id: commentId }, data: { deletedAt: new Date() } });
  }

  // ─── Classroom discussions ─────────────────────────────────────────────────

  async classroomPosts(classroomId: string, userId: string, query: PageQuery) {
    const { isInstructor, isEnrolled } = await this.classrooms.access(classroomId, userId);
    if (!isInstructor && !isEnrolled) throw new ForbiddenException("Join the classroom to see its discussions");
    const where = { classroomId, deletedAt: null };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({ where, include: cardInclude(userId), orderBy: { createdAt: "desc" }, ...skipTake(query) }),
      this.prisma.post.count({ where }),
    ]);
    return paged(rows.map((r) => toCard(r, true)), total, query);
  }

  async createClassroomPost(classroomId: string, userId: string, dto: CreatePostDto) {
    const { isInstructor, isEnrolled } = await this.classrooms.access(classroomId, userId);
    if (!isInstructor && !isEnrolled) throw new ForbiddenException("Join the classroom to post in its discussions");
    return this.create(userId, dto, classroomId);
  }
}

const dedupe = (tags?: string[]) => (tags ? [...new Set(tags.map((t) => t.trim()).filter(Boolean))] : undefined);
