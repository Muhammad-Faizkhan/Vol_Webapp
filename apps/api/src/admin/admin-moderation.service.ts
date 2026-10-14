import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "../generated/prisma/client.js";
import type { CaseStatus, ModerationType } from "../generated/prisma/enums.js";
import { paged, skipTake, type PageQuery } from "../common/pagination.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import { MailService } from "../mail/mail.service.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { displayUserId, UsersService } from "../users/users.service.js";

export type UserAction = "suspend" | "ban" | "delete" | "warn" | "reinstate";
export type CaseAction = UserAction | "dismiss" | "review" | "reopen";

const ACTION_TYPE: Record<UserAction, ModerationType> = {
  suspend: "SUSPEND",
  ban: "BAN",
  delete: "DELETE",
  warn: "WARNING",
  reinstate: "REINSTATE",
};

export const displayCaseId = (n: number) => `ESC-${String(n).padStart(4, "0")}`;

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AdminModerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly notifications: NotificationsService,
    private readonly mail: MailService,
  ) {}

  // ─── Users ─────────────────────────────────────────────────────────────────

  async listUsers(query: PageQuery & { status?: string; type?: string }) {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      role: "USER",
      ...(query.status ? { status: query.status as "ACTIVE" | "SUSPENDED" | "BANNED" } : {}),
      ...(query.type ? { accountType: query.type as "INDIVIDUAL" | "BUSINESS" } : {}),
      ...(query.q ? this.userSearch(query.q) : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ where, include: { profile: true, business: true }, orderBy: { createdAt: "desc" }, ...skipTake(query) }),
      this.prisma.user.count({ where }),
    ]);
    const reportCounts = await this.reportCounts(rows.map((r) => r.id));
    return paged(rows.map((u) => this.toAdminUser(u, reportCounts.get(u.id) ?? 0)), total, query);
  }

  private userSearch(q: string): Prisma.UserWhereInput {
    const n = Number(q.replace(/^usr-/i, ""));
    return {
      OR: [
        { email: { contains: q.toLowerCase() } },
        { username: { contains: q.toLowerCase().replace(/^@/, "") } },
        { profile: { fullName: { contains: q, mode: "insensitive" } } },
        { business: { legalName: { contains: q, mode: "insensitive" } } },
        ...(Number.isInteger(n) && n > 0 ? [{ number: n }] : []),
      ],
    };
  }

  private async reportCounts(userIds: string[]) {
    const cases = await this.prisma.case.findMany({
      where: { reportedUserId: { in: userIds } },
      select: { reportedUserId: true, _count: { select: { reports: true } } },
    });
    const counts = new Map<string, number>();
    for (const c of cases) counts.set(c.reportedUserId, (counts.get(c.reportedUserId) ?? 0) + c._count.reports);
    return counts;
  }

  private toAdminUser(
    u: Prisma.UserGetPayload<{ include: { profile: true; business: true } }>,
    reports: number,
  ) {
    const summary = toUserSummary(u);
    return {
      id: u.id,
      displayId: displayUserId(u.number),
      name: summary.name,
      email: u.email,
      username: u.username,
      avatarUrl: summary.avatarUrl,
      accountType: u.accountType,
      status: u.status,
      suspendedUntil: u.suspendedUntil,
      emailVerified: !!u.emailVerifiedAt,
      reports,
      lastActiveAt: u.lastActiveAt,
      phone: u.profile?.phone ?? u.business?.phone ?? null,
      country: u.profile?.country ?? null,
      city: u.profile?.city ?? null,
      joinedAt: u.createdAt,
      visibility: u.profile?.visibility ?? "PUBLIC",
      business: u.business && { legalName: u.business.legalName, verification: u.business.verification, industry: u.business.industry },
    };
  }

  async userDetail(userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null }, include: { profile: true, business: true } });
    if (!user) throw new NotFoundException("User not found");
    const [reports, memberships, enrollments, actions] = await Promise.all([
      this.reportCounts([userId]),
      this.prisma.workspaceMember.findMany({
        where: { userId, workspace: { deletedAt: null } },
        include: {
          workspace: {
            include: { _count: { select: { members: true, canvases: { where: { deletedAt: null } } } } },
          },
        },
        orderBy: { joinedAt: "desc" },
      }),
      this.prisma.classroomEnrollment.findMany({
        where: { userId, classroom: { deletedAt: null } },
        include: { classroom: { include: { modules: { select: { lessons: { select: { id: true } } } } } } },
      }),
      this.prisma.moderationAction.findMany({
        where: { targetUserId: userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { actor: { select: userSummarySelect } },
      }),
    ]);
    const lessonIds = enrollments.flatMap((e) => e.classroom.modules.flatMap((m) => m.lessons.map((l) => l.id)));
    const done = new Set(
      (await this.prisma.lessonCompletion.findMany({ where: { userId, lessonId: { in: lessonIds } }, select: { lessonId: true } })).map(
        (c) => c.lessonId,
      ),
    );
    const taught = await this.prisma.classroom.findMany({
      where: { instructorId: userId, deletedAt: null },
      select: { id: true, title: true, status: true },
    });

    return {
      ...this.toAdminUser(user, reports.get(userId) ?? 0),
      bio: user.profile?.bio ?? user.business?.description ?? null,
      workspaces: memberships.map((m) => ({
        id: m.workspace.id,
        name: m.workspace.name,
        role: m.role,
        members: m.workspace._count.members,
        canvases: m.workspace._count.canvases,
        visibility: m.workspace.visibility,
        updatedAt: m.workspace.updatedAt,
      })),
      classrooms: [
        ...taught.map((c) => ({ id: c.id, title: c.title, role: "INSTRUCTOR", progress: null, status: c.status === "PUBLISHED" ? "ACTIVE" : "INACTIVE" })),
        ...enrollments.map((e) => {
          const ids = e.classroom.modules.flatMap((m) => m.lessons.map((l) => l.id));
          return {
            id: e.classroom.id,
            title: e.classroom.title,
            role: "STUDENT",
            progress: ids.length ? Math.round((ids.filter((id) => done.has(id)).length / ids.length) * 100) : 0,
            status: e.status,
          };
        }),
      ],
      history: actions.map((a) => ({ id: a.id, type: a.type, reason: a.reason, actor: toUserSummary(a.actor), createdAt: a.createdAt })),
    };
  }

  /** Applies a moderation action to an account. Every action needs a reason and is audit-logged. */
  async actOnUser(userId: string, action: UserAction, reason: string, actorId: string, caseId?: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
    if (!user) throw new NotFoundException("User not found");
    if (user.role !== "USER") throw new ForbiddenException("Staff accounts can't be moderated here");
    if (!reason.trim()) throw new BadRequestException("A reason is required");

    const now = new Date();
    switch (action) {
      case "suspend":
      case "ban":
        await this.prisma.$transaction([
          this.prisma.user.update({
            where: { id: userId },
            data: { status: action === "ban" ? "BANNED" : "SUSPENDED", suspendedUntil: null },
          }),
          this.prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: now } }),
        ]);
        await this.mail.send(
          user.email,
          action === "ban" ? "Your VÔL account has been banned" : "Your VÔL account has been suspended",
          `Reason: ${reason}\n\nIf you believe this is a mistake, reply to this email.`,
        );
        break;
      case "reinstate":
        await this.prisma.user.update({ where: { id: userId }, data: { status: "ACTIVE", suspendedUntil: null } });
        break;
      case "warn":
        await this.notifications.notify({
          userId,
          actorId,
          type: "ACCOUNT_WARNING",
          title: "Formal warning from VÔL",
          body: reason,
          email: true,
        });
        break;
      case "delete":
        break; // erased after the action is recorded, so the record still points at the account
    }

    await this.prisma.moderationAction.create({
      data: { type: ACTION_TYPE[action], reason, targetUserId: userId, actorId, caseId },
    });
    await this.prisma.auditLog.create({
      data: { actorId, action: `user.${action}`, entityType: "User", entityId: userId, metadata: { reason, ...(caseId ? { caseId } : {}) } },
    });
    if (action === "delete") await this.users.eraseAccount(userId, actorId);
    return action === "delete" ? { deleted: true } : this.userDetail(userId);
  }

  // ─── Cases ─────────────────────────────────────────────────────────────────

  async listCases(query: PageQuery & { status?: CaseStatus | "all" }) {
    const where: Prisma.CaseWhereInput = {
      ...(query.status && query.status !== "all" ? { status: query.status } : { status: { in: ["OPEN", "IN_REVIEW"] } }),
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: "insensitive" } },
              { violation: { contains: query.q, mode: "insensitive" } },
              ...(Number(query.q.replace(/^esc-/i, "")) ? [{ number: Number(query.q.replace(/^esc-/i, "")) }] : []),
            ],
          }
        : {}),
    };
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const [rows, total, open, inReview, reopened] = await this.prisma.$transaction([
      this.prisma.case.findMany({ where, include: caseInclude, orderBy: { createdAt: "desc" }, ...skipTake(query) }),
      this.prisma.case.count({ where }),
      this.prisma.case.count({ where: { status: "OPEN" } }),
      this.prisma.case.count({ where: { status: "IN_REVIEW" } }),
      this.prisma.case.count({ where: { reopenedAt: { gte: monthStart } } }),
    ]);
    return { ...paged(rows.map(toCase), total, query), stats: { open, inReview, reopenedThisMonth: reopened } };
  }

  async caseDetail(id: string) {
    const kase = await this.findCase(id);
    const row = await this.prisma.case.findUniqueOrThrow({
      where: { id: kase.id },
      include: {
        ...caseInclude,
        reports: { orderBy: { createdAt: "desc" }, include: { reporter: { select: userSummarySelect } } },
        actions: { orderBy: { createdAt: "desc" }, include: { actor: { select: userSummarySelect } } },
      },
    });
    return {
      ...toCase(row),
      reports: row.reports.map((r) => ({
        id: r.id,
        targetType: r.targetType,
        targetId: r.targetId,
        reason: r.reason,
        details: r.details,
        reporter: toUserSummary(r.reporter),
        createdAt: r.createdAt,
      })),
      actions: row.actions.map((a) => ({ id: a.id, type: a.type, reason: a.reason, actor: toUserSummary(a.actor), createdAt: a.createdAt })),
    };
  }

  /** Accepts the internal id or the displayed "ESC-0001" id. */
  private async findCase(id: string) {
    const n = Number(id.replace(/^esc-/i, ""));
    const kase = await this.prisma.case.findFirst({
      where: Number.isInteger(n) && n > 0 && /^esc-/i.test(id) ? { number: n } : { id },
    });
    if (!kase) throw new NotFoundException("Case not found");
    return kase;
  }

  async actOnCase(id: string, action: CaseAction, reason: string, actorId: string) {
    const kase = await this.findCase(id);
    const now = new Date();
    if (action === "review") {
      await this.prisma.case.update({ where: { id: kase.id }, data: { status: "IN_REVIEW", assigneeId: actorId } });
    } else if (action === "reopen") {
      await this.prisma.case.update({ where: { id: kase.id }, data: { status: "OPEN", reopenedAt: now, resolvedAt: null } });
    } else if (action === "dismiss") {
      if (!reason.trim()) throw new BadRequestException("A reason is required");
      await this.prisma.case.update({ where: { id: kase.id }, data: { status: "DISMISSED", resolvedAt: now } });
      await this.prisma.moderationAction.create({
        data: { type: "DISMISS_CASE", reason, targetUserId: kase.reportedUserId, actorId, caseId: kase.id },
      });
    } else {
      await this.actOnUser(kase.reportedUserId, action, reason, actorId, kase.id);
      await this.prisma.case.update({ where: { id: kase.id }, data: { status: "RESOLVED", resolvedAt: now } });
    }
    await this.prisma.auditLog.create({
      data: { actorId, action: `case.${action}`, entityType: "Case", entityId: kase.id, metadata: reason ? { reason } : undefined },
    });
    return this.caseDetail(kase.id);
  }

  /** Unresolved cases that received a new report in the last week. */
  async openCriticalCases() {
    return this.prisma.case.count({
      where: { status: { in: ["OPEN", "IN_REVIEW"] }, reports: { some: { createdAt: { gt: new Date(Date.now() - WEEK_MS) } } } },
    });
  }
}

const caseInclude = {
  reportedUser: { select: userSummarySelect },
  reporter: { select: userSummarySelect },
  assignee: { select: userSummarySelect },
  _count: { select: { reports: true } },
} satisfies Prisma.CaseInclude;

function toCase(c: Prisma.CaseGetPayload<{ include: typeof caseInclude }>) {
  return {
    id: c.id,
    displayId: displayCaseId(c.number),
    title: c.title,
    violation: c.violation,
    status: c.status,
    reportedUser: toUserSummary(c.reportedUser),
    reporter: c.reporter && toUserSummary(c.reporter),
    assignee: c.assignee && toUserSummary(c.assignee),
    reportCount: c._count.reports,
    location: c.location,
    recommendation: c.recommendation,
    evidence: c.evidence,
    escalatedAt: c.escalatedAt,
    resolvedAt: c.resolvedAt,
    createdAt: c.createdAt,
  };
}
