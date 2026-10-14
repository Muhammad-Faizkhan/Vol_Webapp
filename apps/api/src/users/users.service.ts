import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { verify } from "argon2";
import { Prisma } from "../generated/prisma/client.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { SettingsService } from "../settings/settings.service.js";
import type { UpdateAccountDto, UpdatePreferencesDto, UpsertBusinessDto, UpsertProfileDto } from "./dto/users.dto.js";

/** "USR-10241" style id the admin panel displays. */
export const displayUserId = (number: number) => `USR-${number}`;

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SettingsService,
    private readonly notifications: NotificationsService,
  ) {}

  /** The signed-in user's own account, as returned by /auth/me and every login response. */
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, business: true },
    });
    if (!user) throw new NotFoundException();
    const { profile, business } = user;
    return {
      ...toUserSummary(user),
      displayId: displayUserId(user.number),
      email: user.email,
      role: user.role,
      emailVerified: !!user.emailVerifiedAt,
      onboarded: !!user.onboardedAt,
      createdAt: user.createdAt,
      profile: profile && {
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        coverUrl: profile.coverUrl,
        bio: profile.bio,
        specialty: profile.specialty,
        interests: profile.interests,
        tags: profile.tags,
        portfolioUrl: profile.portfolioUrl,
        phone: profile.phone,
        country: profile.country,
        city: profile.city,
        visibility: profile.visibility,
        searchIndexing: profile.searchIndexing,
        emailNotifications: profile.emailNotifications,
      },
      business: business && {
        legalName: business.legalName,
        contactEmail: business.contactEmail,
        phone: business.phone,
        website: business.website,
        description: business.description,
        logoUrl: business.logoUrl,
        coverUrl: business.coverUrl,
        specialty: business.specialty,
        industry: business.industry,
        categoryTags: business.categoryTags,
        verification: business.verification,
        verificationDocUrl: business.verificationDocUrl,
      },
    };
  }

  async updateAccount(userId: string, dto: UpdateAccountDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (dto.accountType && dto.accountType !== user.accountType && user.onboardedAt) {
      throw new BadRequestException("Account type can't be changed after onboarding");
    }
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { username: dto.username, accountType: dto.accountType },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("That username is taken");
      }
      throw error;
    }
    return this.me(userId);
  }

  async upsertProfile(userId: string, dto: UpsertProfileDto) {
    const exists = await this.prisma.profile.findUnique({ where: { userId }, select: { userId: true } });
    const visibility = exists
      ? undefined
      : (await this.settings.string("users.defaultVisibility")) === "Private"
        ? "PRIVATE"
        : "PUBLIC";
    await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...dto, visibility },
      update: dto,
    });
    return this.me(userId);
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException("Create your profile first");
    await this.prisma.profile.update({ where: { userId }, data: dto });
    return this.me(userId);
  }

  async upsertBusiness(userId: string, dto: UpsertBusinessDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { business: true } });
    if (user.accountType !== "BUSINESS") {
      throw new BadRequestException("Only business accounts have business details");
    }
    const docUrl = dto.verificationDocUrl !== undefined ? dto.verificationDocUrl : user.business?.verificationDocUrl;
    if (!docUrl && (await this.settings.bool("business.documentsRequired"))) {
      throw new BadRequestException("Upload a business license or certification to continue");
    }

    // Verification: automatic unless admins require manual review. A new document re-opens review.
    let verification = user.business?.verification;
    const newDocument = dto.verificationDocUrl && dto.verificationDocUrl !== user.business?.verificationDocUrl;
    if (!verification || verification === "UNVERIFIED" || newDocument) {
      verification = (await this.settings.bool("business.manualVerification"))
        ? docUrl
          ? "PENDING"
          : "UNVERIFIED"
        : "VERIFIED";
    }
    const verifiedAt = verification === "VERIFIED" ? (user.business?.verifiedAt ?? new Date()) : null;

    await this.prisma.businessProfile.upsert({
      where: { userId },
      create: { userId, ...dto, verification, verifiedAt },
      update: { ...dto, verification, verifiedAt },
    });
    // Business accounts also need a Profile row (it carries visibility and preferences).
    await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, fullName: dto.legalName, avatarUrl: dto.logoUrl ?? null, coverUrl: dto.coverUrl ?? null },
      update: {},
    });
    return this.me(userId);
  }

  /** Called after the network-visibility screen, the last onboarding step. */
  async completeOnboarding(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { profile: true, business: true },
    });
    if (!user.profile) throw new BadRequestException("Create your profile first");
    if (user.accountType === "BUSINESS" && !user.business) {
      throw new BadRequestException("Add your business information first");
    }
    if (!user.onboardedAt) {
      await this.prisma.user.update({ where: { id: userId }, data: { onboardedAt: new Date() } });
    }
    return this.me(userId);
  }

  async deleteOwnAccount(userId: string, password: string) {
    if (!(await this.settings.bool("users.selfServiceDeletion"))) {
      throw new ForbiddenException("Account deletion is disabled. Contact support to close your account.");
    }
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.passwordHash || !(await verify(user.passwordHash, password))) {
      throw new BadRequestException("Password is incorrect");
    }
    await this.eraseAccount(userId, userId);
  }

  /**
   * Deletes an account: personal data is erased, sessions end, and the email is released.
   * Content others depend on (workspaces they own, posts) is hidden rather than hard-deleted.
   */
  async eraseAccount(userId: string, actorId: string) {
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: now } }),
      this.prisma.profile.deleteMany({ where: { userId } }),
      this.prisma.businessProfile.deleteMany({ where: { userId } }),
      this.prisma.oAuthAccount.deleteMany({ where: { userId } }),
      this.prisma.follow.deleteMany({ where: { OR: [{ followerId: userId }, { followingId: userId }] } }),
      this.prisma.workspaceMember.deleteMany({ where: { userId, role: { not: "OWNER" } } }),
      this.prisma.workspace.updateMany({ where: { ownerId: userId, deletedAt: null }, data: { deletedAt: now } }),
      this.prisma.post.updateMany({ where: { authorId: userId, deletedAt: null }, data: { deletedAt: now } }),
      this.prisma.product.updateMany({ where: { businessId: userId }, data: { status: "REMOVED" } }),
      this.prisma.classroom.updateMany({ where: { instructorId: userId, deletedAt: null }, data: { deletedAt: now } }),
      this.prisma.user.update({
        where: { id: userId },
        data: { email: `deleted-${userId}@deleted.invalid`, username: null, passwordHash: null, deletedAt: now },
      }),
      this.prisma.auditLog.create({
        data: { actorId, action: "user.delete", entityType: "User", entityId: userId },
      }),
    ]);
  }

  // ─── Public profiles & follows ─────────────────────────────────────────────

  async publicProfile(id: string, viewerId: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ id }, { username: id.toLowerCase() }], deletedAt: null, status: { not: "BANNED" } },
      select: {
        ...userSummarySelect,
        createdAt: true,
        profile: true,
        business: true,
        _count: { select: { followers: true, following: true, products: { where: { status: "PUBLISHED" } } } },
      },
    });
    if (!user) throw new NotFoundException("Profile not found");
    const isSelf = user.id === viewerId;
    const [isFollowing, workspaces, classrooms, canvases] = await this.prisma.$transaction([
      this.prisma.follow.count({ where: { followerId: viewerId, followingId: user.id } }),
      this.prisma.workspace.count({ where: { ownerId: user.id, deletedAt: null, ...(isSelf ? {} : { visibility: "PUBLIC" }) } }),
      this.prisma.classroom.count({ where: { instructorId: user.id, deletedAt: null, status: "PUBLISHED" } }),
      this.prisma.canvas.count({ where: { createdById: user.id, deletedAt: null, ...(isSelf ? {} : { visibility: "PUBLIC" }) } }),
    ]);
    const hidden = !isSelf && user.profile?.visibility === "PRIVATE";
    return {
      ...toUserSummary(user),
      isSelf,
      isFollowing: isFollowing > 0,
      private: hidden,
      joinedAt: user.createdAt,
      stats: {
        followers: user._count.followers,
        following: user._count.following,
        products: user._count.products,
        workspaces,
        classrooms,
        canvases,
      },
      profile:
        user.profile && !hidden
          ? {
              bio: user.profile.bio,
              coverUrl: user.profile.coverUrl,
              interests: user.profile.interests,
              tags: user.profile.tags,
              portfolioUrl: user.profile.portfolioUrl,
              country: user.profile.country,
              city: user.profile.city,
            }
          : null,
      business: user.business && {
        legalName: user.business.legalName,
        description: user.business.description,
        logoUrl: user.business.logoUrl,
        coverUrl: user.business.coverUrl,
        industry: user.business.industry,
        categoryTags: user.business.categoryTags,
        contactEmail: user.business.contactEmail,
        phone: user.business.phone,
        website: user.business.website,
        verification: user.business.verification,
      },
    };
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new BadRequestException("You can't follow yourself");
    const target = await this.prisma.user.findFirst({ where: { id: followingId, deletedAt: null } });
    if (!target) throw new NotFoundException();
    const created = await this.prisma.follow
      .create({ data: { followerId, followingId } })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return null;
        throw error;
      });
    if (created) {
      const follower = await this.me(followerId);
      await this.notifications.notify({
        userId: followingId,
        actorId: followerId,
        type: "NEW_FOLLOWER",
        title: "New follower",
        body: `${follower.name} started following you`,
        data: { userId: followerId },
      });
    }
    return { following: true };
  }

  async unfollow(followerId: string, followingId: string) {
    await this.prisma.follow.deleteMany({ where: { followerId, followingId } });
    return { following: false };
  }

  /** Business profiles the user doesn't follow yet ("Business profiles to follow"). */
  async suggestions(userId: string, limit = 4) {
    const rows = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        accountType: "BUSINESS",
        deletedAt: null,
        status: "ACTIVE",
        business: { isNot: null },
        profile: { visibility: "PUBLIC" },
        followers: { none: { followerId: userId } },
      },
      select: { ...userSummarySelect, business: { select: { ...userSummarySelect.business.select, industry: true } }, _count: { select: { products: { where: { status: "PUBLISHED" } }, followers: true } } },
      orderBy: { followers: { _count: "desc" } },
      take: limit,
    });
    return rows.map((u) => ({
      ...toUserSummary(u),
      industry: u.business?.industry ?? null,
      productCount: u._count.products,
      followerCount: u._count.followers,
    }));
  }

  /** The stat cards on Home and the business dashboard. */
  async stats(userId: string) {
    const weekAgo = new Date(Date.now() - WEEK_MS);
    const monthAgo = new Date(Date.now() - MONTH_MS);
    const memberOf = { deletedAt: null, members: { some: { userId } } };
    const myCanvases = { deletedAt: null, workspace: memberOf };
    const [workspaces, newWorkspaces, canvases, publicCanvases, products, publicProducts, followers, newFollowers] =
      await this.prisma.$transaction([
        this.prisma.workspace.count({ where: memberOf }),
        this.prisma.workspace.count({ where: { ...memberOf, createdAt: { gt: weekAgo } } }),
        this.prisma.canvas.count({ where: myCanvases }),
        this.prisma.canvas.count({ where: { ...myCanvases, visibility: "PUBLIC" } }),
        this.prisma.product.count({ where: { businessId: userId, status: { not: "REMOVED" } } }),
        this.prisma.product.count({ where: { businessId: userId, status: "PUBLISHED" } }),
        this.prisma.follow.count({ where: { followingId: userId } }),
        this.prisma.follow.count({ where: { followingId: userId, createdAt: { gt: monthAgo } } }),
      ]);
    return {
      workspaces: { total: workspaces, newThisWeek: newWorkspaces },
      canvases: { total: canvases, public: publicCanvases },
      products: { total: products, public: publicProducts },
      followers: { total: followers, newThisMonth: newFollowers },
    };
  }
}
