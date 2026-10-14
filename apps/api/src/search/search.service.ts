import { Injectable } from "@nestjs/common";
import type { Prisma } from "../generated/prisma/client.js";
import type { AccountType } from "../generated/prisma/enums.js";
import { paged, skipTake, type PageQuery } from "../common/pagination.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import { PrismaService } from "../prisma/prisma.service.js";

const PREVIEW = 5;

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  /** Directory of public, searchable profiles ("Peoples & Business" in Explore). */
  async people(viewerId: string, query: PageQuery & { type?: AccountType }) {
    const where = this.peopleWhere(viewerId, query.q, query.type);
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          ...userSummarySelect,
          business: { select: { ...userSummarySelect.business.select, industry: true, coverUrl: true, description: true } },
          profile: { select: { ...userSummarySelect.profile.select, bio: true, coverUrl: true } },
          _count: {
            select: {
              followers: true,
              products: { where: { status: "PUBLISHED" } },
              taughtClassrooms: { where: { status: "PUBLISHED", deletedAt: null } },
              ownedWorkspaces: { where: { deletedAt: null, visibility: "PUBLIC" } },
            },
          },
          followers: { where: { followerId: viewerId }, select: { followerId: true } },
        },
        orderBy: { followers: { _count: "desc" } },
        ...skipTake(query),
      }),
      this.prisma.user.count({ where }),
    ]);
    const items = rows.map((u) => ({
      ...toUserSummary(u),
      industry: u.business?.industry ?? null,
      bio: u.business?.description ?? u.profile?.bio ?? null,
      coverUrl: u.business?.coverUrl ?? u.profile?.coverUrl ?? null,
      followerCount: u._count.followers,
      productCount: u._count.products,
      classroomCount: u._count.taughtClassrooms,
      workspaceCount: u._count.ownedWorkspaces,
      isFollowing: u.followers.length > 0,
    }));
    return paged(items, total, query);
  }

  private peopleWhere(viewerId: string, q?: string, type?: AccountType): Prisma.UserWhereInput {
    return {
      id: { not: viewerId },
      deletedAt: null,
      status: "ACTIVE",
      onboardedAt: { not: null },
      role: "USER",
      profile: { visibility: "PUBLIC", searchIndexing: true },
      ...(type ? { accountType: type } : {}),
      ...(q
        ? {
            OR: [
              { username: { contains: q.toLowerCase() } },
              { profile: { fullName: { contains: q, mode: "insensitive" } } },
              { business: { legalName: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    };
  }

  /** The header search: a few matches of each kind. */
  async everything(viewerId: string, q: string) {
    const term = q.trim();
    if (!term) return { people: [], workspaces: [], classrooms: [], posts: [], products: [] };
    const contains = { contains: term, mode: "insensitive" as const };

    const [people, workspaces, classrooms, posts, products] = await Promise.all([
      this.prisma.user.findMany({ where: this.peopleWhere(viewerId, term), select: userSummarySelect, take: PREVIEW }),
      this.prisma.workspace.findMany({
        where: {
          deletedAt: null,
          name: contains,
          OR: [{ visibility: "PUBLIC" }, { members: { some: { userId: viewerId } } }],
        },
        select: { id: true, name: true, imageUrl: true, visibility: true },
        take: PREVIEW,
      }),
      this.prisma.classroom.findMany({
        where: {
          deletedAt: null,
          title: contains,
          OR: [
            { status: "PUBLISHED", visibility: "PUBLIC" },
            { instructorId: viewerId },
            { enrollments: { some: { userId: viewerId, status: "ACTIVE" } } },
          ],
        },
        select: { id: true, title: true, imageUrl: true, category: true },
        take: PREVIEW,
      }),
      this.prisma.post.findMany({
        where: {
          deletedAt: null,
          classroomId: null,
          OR: [{ visibility: "PUBLIC" }, { authorId: viewerId }],
          AND: [{ OR: [{ title: contains }, { tags: { has: term } }] }],
        },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: PREVIEW,
      }),
      this.prisma.product.findMany({
        where: { status: "PUBLISHED", OR: [{ name: contains }, { brand: contains }] },
        select: { id: true, name: true, brand: true, images: true },
        take: PREVIEW,
      }),
    ]);

    return {
      people: people.map(toUserSummary),
      workspaces,
      classrooms,
      posts,
      products: products.map(({ images, ...p }) => ({ ...p, image: images[0] ?? null })),
    };
  }
}
