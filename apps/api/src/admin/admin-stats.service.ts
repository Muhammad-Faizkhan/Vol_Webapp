import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { AdminModerationService } from "./admin-moderation.service.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Counted = { createdAt: Date };

/** Percentage change between two periods, e.g. "+8.7%". */
const delta = (current: number, previous: number) =>
  previous === 0 ? (current > 0 ? "+100%" : "0%") : `${current >= previous ? "+" : ""}${(((current - previous) / previous) * 100).toFixed(1)}%`;

@Injectable()
export class AdminStatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moderation: AdminModerationService,
  ) {}

  async dashboard() {
    const now = Date.now();
    const ago = (days: number) => new Date(now - days * DAY_MS);
    const users = { deletedAt: null, role: "USER" as const };
    const db = this.prisma;

    const [
      total, totalPrev, individual, business, active30, activePrev, new7, newPrev7,
      workspaces, workspacesPrev, classrooms, classroomsPrev, products, productsPrev, canvases, canvasesPrev,
      suspended, banned, suspendedWeek, bannedWeek,
    ] = await db.$transaction([
      db.user.count({ where: users }),
      db.user.count({ where: { ...users, createdAt: { lt: ago(30) } } }),
      db.user.count({ where: { ...users, accountType: "INDIVIDUAL" } }),
      db.user.count({ where: { ...users, accountType: "BUSINESS" } }),
      db.user.count({ where: { ...users, lastActiveAt: { gt: ago(30) } } }),
      db.user.count({ where: { ...users, lastActiveAt: { gt: ago(60), lte: ago(30) } } }),
      db.user.count({ where: { ...users, createdAt: { gt: ago(7) } } }),
      db.user.count({ where: { ...users, createdAt: { gt: ago(14), lte: ago(7) } } }),
      db.workspace.count({ where: { deletedAt: null } }),
      db.workspace.count({ where: { deletedAt: null, createdAt: { lt: ago(30) } } }),
      db.classroom.count({ where: { deletedAt: null } }),
      db.classroom.count({ where: { deletedAt: null, createdAt: { lt: ago(30) } } }),
      db.product.count({ where: { status: { not: "REMOVED" } } }),
      db.product.count({ where: { status: { not: "REMOVED" }, createdAt: { lt: ago(30) } } }),
      db.canvas.count({ where: { deletedAt: null } }),
      db.canvas.count({ where: { deletedAt: null, createdAt: { lt: ago(30) } } }),
      db.user.count({ where: { ...users, status: "SUSPENDED" } }),
      db.user.count({ where: { ...users, status: "BANNED" } }),
      db.moderationAction.count({ where: { type: "SUSPEND", createdAt: { gt: ago(7) } } }),
      db.moderationAction.count({ where: { type: "BAN", createdAt: { gt: ago(7) } } }),
    ]);

    return {
      stats: {
        totalUsers: { value: total, delta: delta(total, totalPrev) },
        individualUsers: { value: individual },
        businessUsers: { value: business },
        activeUsers30d: { value: active30, delta: delta(active30, activePrev) },
        newRegistrations7d: { value: new7, delta: delta(new7, newPrev7) },
        workspaces: { value: workspaces, delta: delta(workspaces, workspacesPrev) },
        classrooms: { value: classrooms, delta: delta(classrooms, classroomsPrev) },
        catalogs: { value: products, delta: delta(products, productsPrev) },
        canvases: { value: canvases, delta: delta(canvases, canvasesPrev) },
        suspendedUsers: { value: suspended, thisWeek: suspendedWeek },
        bannedUsers: { value: banned, thisWeek: bannedWeek },
      },
      userGrowth: await this.userGrowth("yearly"),
      businessGrowth: await this.businessGrowth(),
      activityByWeek: await this.activityByWeek(),
      health: await this.health(),
    };
  }

  /** Cumulative users per month this year (yearly) or per day this month (monthly), with active users. */
  async userGrowth(period: "yearly" | "monthly") {
    const now = new Date();
    const buckets = this.buckets(period, now);
    const rows = await this.prisma.user.findMany({
      where: { deletedAt: null, role: "USER", createdAt: { lt: buckets[buckets.length - 1].end } },
      select: { createdAt: true, lastActiveAt: true },
    });
    return buckets.map((b) => ({
      label: b.label,
      total: rows.filter((r) => r.createdAt < b.end).length,
      // Active in a bucket = signed in during that bucket (approximated by last activity).
      active: rows.filter((r) => r.lastActiveAt && r.lastActiveAt >= b.start && r.lastActiveAt < b.end).length,
    }));
  }

  /** Cumulative business accounts per month, up to the current month. */
  async businessGrowth() {
    const now = new Date();
    const buckets = this.buckets("yearly", now).slice(0, now.getMonth() + 1);
    const rows = await this.prisma.user.findMany({
      where: { deletedAt: null, role: "USER", accountType: "BUSINESS" },
      select: { createdAt: true },
    });
    return buckets.map((b) => ({ label: b.label, business: count(rows, b.end) }));
  }

  /** Things created in each of the last four weeks. */
  async activityByWeek() {
    const now = Date.now();
    const weeks = [3, 2, 1, 0].map((i, n) => ({
      label: `WEEK ${n + 1}`,
      start: new Date(now - (i + 1) * 7 * DAY_MS),
      end: new Date(now - i * 7 * DAY_MS),
    }));
    const since = { createdAt: { gte: weeks[0].start } };
    const [workspaces, canvases, classrooms, products] = await this.prisma.$transaction([
      this.prisma.workspace.findMany({ where: since, select: { createdAt: true } }),
      this.prisma.canvas.findMany({ where: since, select: { createdAt: true } }),
      this.prisma.classroom.findMany({ where: since, select: { createdAt: true } }),
      this.prisma.product.findMany({ where: since, select: { createdAt: true } }),
    ]);
    const inWeek = (rows: Counted[], w: { start: Date; end: Date }) =>
      rows.filter((r) => r.createdAt >= w.start && r.createdAt < w.end).length;
    return weeks.map((w) => ({
      label: w.label,
      workspaces: inWeek(workspaces, w),
      canvases: inWeek(canvases, w),
      classrooms: inWeek(classrooms, w),
      catalog: inWeek(products, w),
    }));
  }

  async health() {
    const dayAgo = new Date(Date.now() - DAY_MS);
    const [securityAlerts, failedAdminLogins] = await this.prisma.$transaction([
      this.prisma.loginAttempt.count({ where: { success: false, createdAt: { gt: dayAgo } } }),
      this.prisma.loginAttempt.count({ where: { success: false, isAdmin: true, createdAt: { gt: dayAgo } } }),
    ]);
    return {
      openCriticalCases: await this.moderation.openCriticalCases(),
      securityAlerts24h: securityAlerts,
      failedAdminLogins24h: failedAdminLogins,
    };
  }

  async analytics(period: "yearly" | "monthly") {
    const db = this.prisma;
    const [totalUsers, activeWorkspaces, classroomsRunning, products, individuals, businesses] = await db.$transaction([
      db.user.count({ where: { deletedAt: null, role: "USER" } }),
      db.workspace.count({ where: { deletedAt: null, updatedAt: { gt: new Date(Date.now() - 30 * DAY_MS) } } }),
      db.classroom.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
      db.product.count({ where: { status: "PUBLISHED" } }),
      db.user.count({ where: { deletedAt: null, role: "USER", accountType: "INDIVIDUAL" } }),
      db.businessProfile.groupBy({
        by: ["industry"],
        where: { user: { deletedAt: null } },
        _count: { _all: true },
        orderBy: { industry: "asc" },
      }),
    ]);
    const segments = businesses
      .map((b) => ({ name: b.industry ?? "Other business", value: (b._count as { _all: number })._all }))
      .sort((a, b) => b.value - a.value);
    return {
      stats: { totalUsers, activeWorkspaces, classroomsRunning, products },
      growth: await this.userGrowth(period),
      accountShare: [{ name: "Individual Users", value: individuals }, ...segments.slice(0, 4)],
    };
  }

  private buckets(period: "yearly" | "monthly", now: Date) {
    if (period === "yearly") {
      return MONTHS.map((label, m) => ({
        label,
        start: new Date(now.getFullYear(), m, 1),
        end: new Date(now.getFullYear(), m + 1, 1),
      }));
    }
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Array.from({ length: days }, (_, d) => ({
      label: String(d + 1),
      start: new Date(now.getFullYear(), now.getMonth(), d + 1),
      end: new Date(now.getFullYear(), now.getMonth(), d + 2),
    }));
  }
}

const count = (rows: Counted[], before: Date) => rows.filter((r) => r.createdAt < before).length;
