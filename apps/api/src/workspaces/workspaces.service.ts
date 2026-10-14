import { randomBytes } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../config/env.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { WorkspaceRole } from "../generated/prisma/enums.js";
import { paged, skipTake } from "../common/pagination.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import { MailService } from "../mail/mail.service.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { SettingsService } from "../settings/settings.service.js";
import type {
  CreateWorkspaceDto,
  InviteMembersDto,
  ListWorkspacesQuery,
  UpdateWorkspaceDto,
} from "./dto/workspaces.dto.js";

const RANK: Record<WorkspaceRole, number> = { VIEWER: 0, COLLABORATOR: 1, ADMIN: 2, OWNER: 3 };
const INVITE_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const ROLE_LABEL: Record<WorkspaceRole, string> = {
  OWNER: "owner",
  ADMIN: "an admin",
  COLLABORATOR: "a collaborator",
  VIEWER: "a viewer",
};

const cardInclude = {
  _count: { select: { members: true, canvases: { where: { deletedAt: null } } } },
  members: { take: 3, orderBy: { joinedAt: "asc" }, include: { user: { select: userSummarySelect } } },
  canvases: {
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take: 1,
    select: { updatedAt: true, thumbnailUrl: true },
  },
  owner: { select: userSummarySelect },
} satisfies Prisma.WorkspaceInclude;

type CardRow = Prisma.WorkspaceGetPayload<{ include: typeof cardInclude }>;

@Injectable()
export class WorkspacesService {
  private readonly webUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SettingsService,
    private readonly notifications: NotificationsService,
    private readonly mail: MailService,
    config: ConfigService<Env, true>,
  ) {
    this.webUrl = config.get("WEB_URL", { infer: true });
  }

  // ─── Access ────────────────────────────────────────────────────────────────

  /** The caller's role, or null when they aren't a member. Throws 404 for missing/deleted workspaces. */
  async roleIn(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, deletedAt: null },
      select: { id: true, visibility: true, members: { where: { userId }, select: { role: true } } },
    });
    if (!workspace) throw new NotFoundException("Workspace not found");
    return { role: workspace.members[0]?.role ?? null, visibility: workspace.visibility };
  }

  /** Throws unless the caller has at least `min` role. Public workspaces are readable by anyone. */
  async require(workspaceId: string, userId: string, min: WorkspaceRole | "PUBLIC_READ") {
    const { role, visibility } = await this.roleIn(workspaceId, userId);
    if (min === "PUBLIC_READ") {
      if (role || visibility === "PUBLIC") return role;
      throw new NotFoundException("Workspace not found");
    }
    if (!role) throw new NotFoundException("Workspace not found");
    if (RANK[role] < RANK[min]) throw new ForbiddenException("You don't have permission to do that in this workspace");
    return role;
  }

  async logActivity(workspaceId: string, actorId: string | null, message: string) {
    await this.prisma.workspaceActivity.create({ data: { workspaceId, actorId, message } });
    await this.prisma.workspace.update({ where: { id: workspaceId }, data: { updatedAt: new Date() } });
  }

  // ─── Workspaces ────────────────────────────────────────────────────────────

  async list(userId: string, query: ListWorkspacesQuery) {
    const where: Prisma.WorkspaceWhereInput = {
      deletedAt: null,
      members: { some: { userId } },
      ...(query.q ? { name: { contains: query.q, mode: "insensitive" } } : {}),
      ...(query.scope === "business"
        ? { owner: { accountType: "BUSINESS", id: { not: userId } } }
        : query.scope === "mine"
          ? { OR: [{ ownerId: userId }, { owner: { accountType: "INDIVIDUAL" } }] }
          : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.workspace.findMany({
        where,
        include: cardInclude,
        orderBy: query.sort === "name" ? { name: "asc" } : { updatedAt: "desc" },
        ...skipTake(query),
      }),
      this.prisma.workspace.count({ where }),
    ]);
    const items = await this.withProductCounts(rows.map((row) => this.toCard(row, userId)));
    return paged(items, total, query);
  }

  /** Public workspaces for Explore. */
  async listPublic(query: ListWorkspacesQuery) {
    const where: Prisma.WorkspaceWhereInput = {
      deletedAt: null,
      visibility: "PUBLIC",
      ...(query.q ? { name: { contains: query.q, mode: "insensitive" } } : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.workspace.findMany({ where, include: cardInclude, orderBy: { updatedAt: "desc" }, ...skipTake(query) }),
      this.prisma.workspace.count({ where }),
    ]);
    return paged(await this.withProductCounts(rows.map((row) => this.toCard(row, ""))), total, query);
  }

  private toCard(row: CardRow, userId: string) {
    const lastCanvas = row.canvases[0];
    const lastActivity = lastCanvas && lastCanvas.updatedAt > row.updatedAt ? lastCanvas.updatedAt : row.updatedAt;
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      industry: row.industry,
      imageUrl: row.imageUrl ?? lastCanvas?.thumbnailUrl ?? null,
      visibility: row.visibility,
      owner: toUserSummary(row.owner),
      isOwner: row.ownerId === userId,
      memberCount: row._count.members,
      canvasCount: row._count.canvases,
      productCount: 0,
      members: row.members.map((m) => ({ ...toUserSummary(m.user), role: m.role })),
      createdAt: row.createdAt,
      lastActivityAt: lastActivity,
    };
  }

  private async withProductCounts<T extends { id: string; productCount: number }>(cards: T[]) {
    if (!cards.length) return cards;
    const counts = await this.prisma.canvasProduct.groupBy({
      by: ["canvasId"],
      where: { canvas: { workspaceId: { in: cards.map((c) => c.id) }, deletedAt: null } },
      _count: { _all: true },
    });
    if (!counts.length) return cards;
    const canvases = await this.prisma.canvas.findMany({
      where: { id: { in: counts.map((c) => c.canvasId) } },
      select: { id: true, workspaceId: true },
    });
    const byWorkspace = new Map<string, number>();
    for (const c of counts) {
      const ws = canvases.find((x) => x.id === c.canvasId)?.workspaceId;
      if (ws) byWorkspace.set(ws, (byWorkspace.get(ws) ?? 0) + c._count._all);
    }
    return cards.map((card) => ({ ...card, productCount: byWorkspace.get(card.id) ?? 0 }));
  }

  async create(userId: string, dto: CreateWorkspaceDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const limit = await this.settings.number(user.accountType === "BUSINESS" ? "workspaces.perBusiness" : "workspaces.perIndividual");
    const owned = await this.prisma.workspace.count({ where: { ownerId: userId, deletedAt: null } });
    if (owned >= limit) throw new ForbiddenException(`You can own up to ${limit} workspaces`);

    const workspace = await this.prisma.workspace.create({
      data: {
        ...dto,
        ownerId: userId,
        members: { create: { userId, role: "OWNER" } },
        folders: { createMany: { data: [{ name: "Set-out Plans" }, { name: "Customer-facing" }] } },
      },
    });
    await this.logActivity(workspace.id, userId, `created ${workspace.name}`);
    return this.detail(workspace.id, userId);
  }

  async detail(workspaceId: string, userId: string) {
    const role = await this.require(workspaceId, userId, "PUBLIC_READ");
    const row = await this.prisma.workspace.findUniqueOrThrow({ where: { id: workspaceId }, include: cardInclude });
    const [card] = await this.withProductCounts([this.toCard(row, userId)]);
    return { ...card, myRole: role };
  }

  async update(workspaceId: string, userId: string, dto: UpdateWorkspaceDto) {
    await this.require(workspaceId, userId, "ADMIN");
    await this.prisma.workspace.update({ where: { id: workspaceId }, data: dto });
    if (dto.visibility) {
      await this.logActivity(workspaceId, userId, `made the workspace ${dto.visibility === "PUBLIC" ? "public" : "private"}`);
    }
    return this.detail(workspaceId, userId);
  }

  async remove(workspaceId: string, userId: string) {
    await this.require(workspaceId, userId, "OWNER");
    await this.prisma.workspace.update({ where: { id: workspaceId }, data: { deletedAt: new Date() } });
  }

  // ─── Members ───────────────────────────────────────────────────────────────

  async members(workspaceId: string, userId: string) {
    const role = await this.require(workspaceId, userId, "PUBLIC_READ");
    const rows = await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      orderBy: [{ joinedAt: "asc" }],
      include: { user: { select: { ...userSummarySelect, email: true } } },
    });
    return rows
      .map((m) => ({
        ...toUserSummary(m.user),
        // Emails are only visible to people inside the workspace.
        email: role ? m.user.email : null,
        role: m.role,
        isYou: m.userId === userId,
        joinedAt: m.joinedAt,
      }))
      .sort((a, b) => RANK[b.role] - RANK[a.role]);
  }

  async changeRole(workspaceId: string, actorId: string, memberId: string, role: WorkspaceRole) {
    const actorRole = await this.require(workspaceId, actorId, "ADMIN");
    const member = await this.prisma.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId, userId: memberId } } });
    if (!member) throw new NotFoundException("Member not found");
    if (member.role === "OWNER") throw new BadRequestException("The owner's role can't be changed");
    if (actorRole !== "OWNER" && (member.role === "ADMIN" || role === "ADMIN") && memberId !== actorId) {
      throw new ForbiddenException("Only the owner can add or remove admins");
    }
    await this.prisma.workspaceMember.update({ where: { workspaceId_userId: { workspaceId, userId: memberId } }, data: { role } });
    const name = await this.nameOf(memberId);
    await this.logActivity(workspaceId, actorId, `made ${name} ${ROLE_LABEL[role]}`);
    return this.members(workspaceId, actorId);
  }

  async removeMember(workspaceId: string, actorId: string, memberId: string) {
    const leaving = actorId === memberId;
    const actorRole = await this.require(workspaceId, actorId, leaving ? "VIEWER" : "ADMIN");
    const member = await this.prisma.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId, userId: memberId } } });
    if (!member) throw new NotFoundException("Member not found");
    if (member.role === "OWNER") throw new BadRequestException("The owner can't leave; delete the workspace instead");
    if (!leaving && member.role === "ADMIN" && actorRole !== "OWNER") throw new ForbiddenException("Only the owner can remove admins");
    await this.prisma.workspaceMember.delete({ where: { workspaceId_userId: { workspaceId, userId: memberId } } });
    const name = await this.nameOf(memberId);
    await this.logActivity(workspaceId, actorId, leaving ? "left the workspace" : `removed ${name}`);
  }

  private async addMember(workspaceId: string, userId: string, role: WorkspaceRole) {
    const limit = await this.settings.number("workspaces.membersPerWorkspace");
    const count = await this.prisma.workspaceMember.count({ where: { workspaceId } });
    if (count >= limit) throw new ForbiddenException(`Workspaces can have up to ${limit} members`);
    await this.prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId, userId } },
      create: { workspaceId, userId, role },
      update: {},
    });
  }

  private async nameOf(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: userSummarySelect });
    return user ? toUserSummary(user).name : "a member";
  }

  // ─── Invites ───────────────────────────────────────────────────────────────

  /** Direct invites by email. Existing users get an in-app invite; everyone gets an email. */
  async invite(workspaceId: string, actorId: string, { invites }: InviteMembersDto) {
    await this.require(workspaceId, actorId, "ADMIN");
    const workspace = await this.prisma.workspace.findUniqueOrThrow({ where: { id: workspaceId } });
    const inviterName = await this.nameOf(actorId);
    const results: { email: string; status: "invited" | "already_member" | "updated" }[] = [];

    for (const { email, role } of invites) {
      const user = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });
      if (user) {
        const member = await this.prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId: user.id } },
        });
        if (member) {
          results.push({ email, status: "already_member" });
          continue;
        }
      }
      // One open invite per email: re-inviting updates the role instead of stacking invites.
      const open = await this.prisma.workspaceInvite.findFirst({
        where: { workspaceId, email, acceptedAt: null, declinedAt: null, revokedAt: null },
      });
      if (open) {
        await this.prisma.workspaceInvite.update({ where: { id: open.id }, data: { role } });
        results.push({ email, status: "updated" });
        continue;
      }
      const invite = await this.prisma.workspaceInvite.create({
        data: {
          workspaceId,
          email,
          role,
          token: randomBytes(18).toString("base64url"),
          invitedById: actorId,
          expiresAt: new Date(Date.now() + INVITE_TTL_MS),
        },
      });
      const title = `${workspace.name} Invitation`;
      const body = `${inviterName} invited you as ${ROLE_LABEL[role]}`;
      if (user) {
        await this.notifications.notify({
          userId: user.id,
          actorId,
          type: "WORKSPACE_INVITE",
          title,
          body,
          data: { workspaceId, inviteId: invite.id },
          email: true,
        });
      } else {
        await this.mail.send(email, title, `${body} on VÔL. Create your account to join: ${this.webUrl}/signup`);
      }
      results.push({ email, status: "invited" });
    }
    await this.logActivity(workspaceId, actorId, `invited ${invites.length} ${invites.length === 1 ? "person" : "people"}`);
    return results;
  }

  /** Turns invites sent to an email before the account existed into in-app invites. */
  async claimEmailInvites(userId: string, email: string) {
    const invites = await this.prisma.workspaceInvite.findMany({
      where: { email, acceptedAt: null, declinedAt: null, revokedAt: null, expiresAt: { gt: new Date() } },
      include: { workspace: true },
    });
    for (const invite of invites) {
      const inviterName = await this.nameOf(invite.invitedById);
      await this.notifications.notify({
        userId,
        actorId: invite.invitedById,
        type: "WORKSPACE_INVITE",
        title: `${invite.workspace.name} Invitation`,
        body: `${inviterName} invited you as ${ROLE_LABEL[invite.role]}`,
        data: { workspaceId: invite.workspaceId, inviteId: invite.id },
      });
    }
  }

  async pendingInvites(workspaceId: string, actorId: string) {
    await this.require(workspaceId, actorId, "ADMIN");
    const invites = await this.prisma.workspaceInvite.findMany({
      where: { workspaceId, email: { not: null }, acceptedAt: null, declinedAt: null, revokedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return invites.map((i) => ({ id: i.id, email: i.email, role: i.role, createdAt: i.createdAt, expiresAt: i.expiresAt }));
  }

  async revokeInvite(workspaceId: string, actorId: string, inviteId: string) {
    await this.require(workspaceId, actorId, "ADMIN");
    await this.prisma.workspaceInvite.updateMany({ where: { id: inviteId, workspaceId }, data: { revokedAt: new Date() } });
  }

  /** The invitee answers a direct invite (from their notifications). */
  async answerInvite(inviteId: string, userId: string, accept: boolean) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const invite = await this.prisma.workspaceInvite.findUnique({ where: { id: inviteId }, include: { workspace: true } });
    if (!invite || invite.email !== user.email) throw new NotFoundException("Invite not found");
    if (invite.revokedAt || invite.acceptedAt || invite.declinedAt || (invite.expiresAt && invite.expiresAt < new Date())) {
      await this.notifications.resolve(userId, "inviteId", inviteId);
      throw new BadRequestException("This invite is no longer valid");
    }
    if (invite.workspace.deletedAt) throw new NotFoundException("Workspace not found");

    if (accept) {
      await this.addMember(invite.workspaceId, userId, invite.role);
      await this.prisma.workspaceInvite.update({ where: { id: inviteId }, data: { acceptedAt: new Date() } });
      await this.logActivity(invite.workspaceId, userId, `joined as ${ROLE_LABEL[invite.role]}`);
    } else {
      await this.prisma.workspaceInvite.update({ where: { id: inviteId }, data: { declinedAt: new Date() } });
    }
    await this.notifications.resolve(userId, "inviteId", inviteId);
    return { workspaceId: invite.workspaceId, accepted: accept };
  }

  // ─── Invite links & join requests ──────────────────────────────────────────

  async inviteLink(workspaceId: string, actorId: string, reset = false, role?: WorkspaceRole) {
    await this.require(workspaceId, actorId, "ADMIN");
    let link = await this.prisma.workspaceInvite.findFirst({
      where: { workspaceId, email: null, revokedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (link && reset) {
      await this.prisma.workspaceInvite.update({ where: { id: link.id }, data: { revokedAt: new Date() } });
      link = null;
    }
    if (!link) {
      link = await this.prisma.workspaceInvite.create({
        data: { workspaceId, email: null, role: role ?? "VIEWER", token: randomBytes(9).toString("base64url"), invitedById: actorId },
      });
    } else if (role && role !== link.role) {
      link = await this.prisma.workspaceInvite.update({ where: { id: link.id }, data: { role } });
    }
    return { url: `${this.webUrl}/invite/${link.token}`, token: link.token, role: link.role };
  }

  /** What someone opening an invite link sees before asking to join. */
  async linkPreview(token: string, userId: string) {
    const link = await this.prisma.workspaceInvite.findUnique({
      where: { token },
      include: { workspace: { include: { owner: { select: userSummarySelect }, _count: { select: { members: true } } } } },
    });
    if (!link || link.email !== null || link.revokedAt || link.workspace.deletedAt) {
      throw new NotFoundException("This invite link is no longer valid");
    }
    const [member, request] = await this.prisma.$transaction([
      this.prisma.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId: link.workspaceId, userId } } }),
      this.prisma.workspaceJoinRequest.findUnique({ where: { workspaceId_userId: { workspaceId: link.workspaceId, userId } } }),
    ]);
    return {
      workspace: {
        id: link.workspaceId,
        name: link.workspace.name,
        description: link.workspace.description,
        imageUrl: link.workspace.imageUrl,
        memberCount: link.workspace._count.members,
        owner: toUserSummary(link.workspace.owner),
      },
      role: link.role,
      isMember: !!member,
      requestStatus: request?.status ?? null,
    };
  }

  async requestToJoin(token: string, userId: string) {
    const preview = await this.linkPreview(token, userId);
    if (preview.isMember) throw new ConflictException("You're already a member of this workspace");
    const workspaceId = preview.workspace.id;
    const request = await this.prisma.workspaceJoinRequest.upsert({
      where: { workspaceId_userId: { workspaceId, userId } },
      create: { workspaceId, userId },
      update: { status: "PENDING", decidedAt: null, createdAt: new Date() },
    });
    const name = await this.nameOf(userId);
    const admins = await this.prisma.workspaceMember.findMany({
      where: { workspaceId, role: { in: ["OWNER", "ADMIN"] } },
      select: { userId: true },
    });
    for (const admin of admins) {
      await this.notifications.notify({
        userId: admin.userId,
        actorId: userId,
        type: "WORKSPACE_JOIN_REQUEST",
        title: `${preview.workspace.name} Join Request`,
        body: `${name} asked to join ${preview.workspace.name}`,
        data: { workspaceId, requestId: request.id },
      });
    }
    return { status: request.status };
  }

  async joinRequests(workspaceId: string, actorId: string) {
    await this.require(workspaceId, actorId, "ADMIN");
    const rows = await this.prisma.workspaceJoinRequest.findMany({
      where: { workspaceId, status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { user: { select: userSummarySelect } },
    });
    return rows.map((r) => ({ id: r.id, user: toUserSummary(r.user), createdAt: r.createdAt }));
  }

  async answerJoinRequest(requestId: string, actorId: string, accept: boolean) {
    const request = await this.prisma.workspaceJoinRequest.findUnique({ where: { id: requestId }, include: { workspace: true } });
    if (!request) throw new NotFoundException("Request not found");
    await this.require(request.workspaceId, actorId, "ADMIN");
    if (request.status !== "PENDING") {
      await this.notifications.resolve(actorId, "requestId", requestId);
      throw new BadRequestException("This request was already answered");
    }

    if (accept) {
      const link = await this.prisma.workspaceInvite.findFirst({
        where: { workspaceId: request.workspaceId, email: null, revokedAt: null },
        orderBy: { createdAt: "desc" },
      });
      await this.addMember(request.workspaceId, request.userId, link?.role ?? "VIEWER");
      await this.logActivity(request.workspaceId, actorId, `accepted ${await this.nameOf(request.userId)}'s request to join`);
      await this.notifications.notify({
        userId: request.userId,
        actorId,
        type: "WORKSPACE_JOIN_ACCEPTED",
        title: "Workspace Request Accepted",
        body: `${await this.nameOf(actorId)} accepted your request to join ${request.workspace.name}`,
        data: { workspaceId: request.workspaceId },
      });
    }
    await this.prisma.workspaceJoinRequest.update({
      where: { id: requestId },
      data: { status: accept ? "ACCEPTED" : "DECLINED", decidedAt: new Date() },
    });
    // Every admin got the same notification; answering it once clears it for all of them.
    await this.prisma.notification.updateMany({
      where: { resolvedAt: null, data: { path: ["requestId"], equals: requestId } },
      data: { resolvedAt: new Date() },
    });
    return { accepted: accept };
  }

  // ─── Activity & folders ────────────────────────────────────────────────────

  async activity(workspaceId: string, userId: string, limit: number) {
    await this.require(workspaceId, userId, "VIEWER");
    const rows = await this.prisma.workspaceActivity.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { actor: { select: userSummarySelect } },
    });
    return rows.map((a) => ({ id: a.id, message: a.message, actor: a.actor && toUserSummary(a.actor), createdAt: a.createdAt }));
  }

  async folders(workspaceId: string, userId: string) {
    await this.require(workspaceId, userId, "PUBLIC_READ");
    const [folders, total] = await this.prisma.$transaction([
      this.prisma.canvasFolder.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "asc" },
        include: { _count: { select: { canvases: { where: { deletedAt: null } } } } },
      }),
      this.prisma.canvas.count({ where: { workspaceId, deletedAt: null } }),
    ]);
    return { total, folders: folders.map((f) => ({ id: f.id, name: f.name, canvasCount: f._count.canvases })) };
  }

  async createFolder(workspaceId: string, userId: string, name: string) {
    await this.require(workspaceId, userId, "COLLABORATOR");
    const exists = await this.prisma.canvasFolder.findUnique({ where: { workspaceId_name: { workspaceId, name } } });
    if (exists) throw new ConflictException("A folder with that name already exists");
    const folder = await this.prisma.canvasFolder.create({ data: { workspaceId, name } });
    return { id: folder.id, name: folder.name, canvasCount: 0 };
  }

  async renameFolder(workspaceId: string, userId: string, folderId: string, name: string) {
    await this.require(workspaceId, userId, "COLLABORATOR");
    await this.prisma.canvasFolder.updateMany({ where: { id: folderId, workspaceId }, data: { name } });
  }

  async deleteFolder(workspaceId: string, userId: string, folderId: string) {
    await this.require(workspaceId, userId, "COLLABORATOR");
    await this.prisma.canvasFolder.deleteMany({ where: { id: folderId, workspaceId } });
  }
}
