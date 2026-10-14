import { BadRequestException, Body, Controller, Get, Header, Param, Post, Put, Query } from "@nestjs/common";
import { IsIn, IsObject, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { paged, PageQuery, skipTake } from "../common/pagination.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import { PoliciesService } from "../policies/policies.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { SettingsService } from "../settings/settings.service.js";
import { AdminModerationService, type CaseAction, type UserAction } from "./admin-moderation.service.js";
import { AdminStatsService } from "./admin-stats.service.js";

class UsersQuery extends PageQuery {
  @IsOptional() @IsIn(["ACTIVE", "SUSPENDED", "BANNED"]) status?: string;
  @IsOptional() @IsIn(["INDIVIDUAL", "BUSINESS"]) type?: string;
}

class CasesQuery extends PageQuery {
  @IsOptional() @IsIn(["OPEN", "IN_REVIEW", "RESOLVED", "DISMISSED", "all"]) status?: "OPEN" | "IN_REVIEW" | "RESOLVED" | "DISMISSED" | "all";
}

class ReasonDto {
  @IsOptional() @IsString() @MaxLength(2000) reason = "";
}

class SettingsDto {
  @IsObject() changes: Record<string, unknown>;
}

class PolicyDto {
  @IsString() @MinLength(1) @MaxLength(200_000) content: string;
}

const USER_ACTIONS = ["suspend", "ban", "delete", "warn", "reinstate"];
const CASE_ACTIONS = [...USER_ACTIONS, "dismiss", "review", "reopen"];

// Moderators handle users and cases; platform configuration is admin-only (see per-route @Roles).
@Roles("ADMIN", "MODERATOR")
@Controller("admin")
export class AdminController {
  constructor(
    private readonly stats: AdminStatsService,
    private readonly moderation: AdminModerationService,
    private readonly settings: SettingsService,
    private readonly policies: PoliciesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get("dashboard")
  dashboard() {
    return this.stats.dashboard();
  }

  @Get("analytics")
  analytics(@Query("period") period = "yearly") {
    return this.stats.analytics(period === "monthly" ? "monthly" : "yearly");
  }

  // ─── Users ─────────────────────────────────────────────────────────────────

  @Get("users")
  users(@Query() query: UsersQuery) {
    return this.moderation.listUsers(query);
  }

  /** Every matching user as CSV (the "Export" button). */
  @Get("users/export")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", 'attachment; filename="vol-users.csv"')
  async exportUsers(@Query() query: UsersQuery) {
    const { items } = await this.moderation.listUsers({ ...query, page: 1, limit: 100_000 });
    const header = ["ID", "Name", "Email", "Username", "Type", "Status", "Reports", "Last active", "Joined"];
    const rows = items.map((u) => [
      u.displayId,
      u.name,
      u.email,
      u.username ? `@${u.username}` : "",
      u.accountType,
      u.status,
      String(u.reports),
      u.lastActiveAt?.toISOString() ?? "",
      u.joinedAt.toISOString(),
    ]);
    return [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
  }

  @Get("users/:id")
  user(@Param("id") id: string) {
    return this.moderation.userDetail(id);
  }

  @Post("users/:id/:action")
  actOnUser(@CurrentUser() actor: AuthUser, @Param("id") id: string, @Param("action") action: string, @Body() dto: ReasonDto) {
    if (!USER_ACTIONS.includes(action)) throw new BadRequestException("Unknown action");
    if (action === "delete" && actor.role !== "ADMIN") throw new BadRequestException("Only admins can delete accounts");
    return this.moderation.actOnUser(id, action as UserAction, dto.reason, actor.id);
  }

  // ─── Cases ─────────────────────────────────────────────────────────────────

  @Get("cases")
  cases(@Query() query: CasesQuery) {
    return this.moderation.listCases(query);
  }

  @Get("cases/:id")
  caseDetail(@Param("id") id: string) {
    return this.moderation.caseDetail(id);
  }

  @Post("cases/:id/:action")
  actOnCase(@CurrentUser() actor: AuthUser, @Param("id") id: string, @Param("action") action: string, @Body() dto: ReasonDto) {
    if (!CASE_ACTIONS.includes(action)) throw new BadRequestException("Unknown action");
    if (action === "delete" && actor.role !== "ADMIN") throw new BadRequestException("Only admins can delete accounts");
    return this.moderation.actOnCase(id, action as CaseAction, dto.reason, actor.id);
  }

  // ─── Security, settings, policies, audit ───────────────────────────────────

  @Roles("ADMIN")
  @Get("security")
  async security() {
    return { policies: await this.settings.accessPolicies(), health: await this.stats.health() };
  }

  @Roles("ADMIN")
  @Put("security")
  async updateSecurity(@CurrentUser() actor: AuthUser, @Body() dto: SettingsDto) {
    if (!Object.keys(dto.changes).every((k) => k.startsWith("access."))) {
      throw new BadRequestException("Only access policies can be changed here");
    }
    await this.saveSettings(actor.id, dto.changes);
    return this.security();
  }

  @Roles("ADMIN")
  @Get("settings")
  settingsTabs() {
    return this.settings.tabs();
  }

  @Roles("ADMIN")
  @Put("settings")
  async updateSettings(@CurrentUser() actor: AuthUser, @Body() dto: SettingsDto) {
    await this.saveSettings(actor.id, dto.changes);
    return this.settings.tabs();
  }

  private async saveSettings(actorId: string, changes: Record<string, unknown>) {
    const changed = await this.settings.update(changes, actorId);
    if (changed.length) {
      await this.prisma.auditLog.create({
        data: {
          actorId,
          action: "settings.update",
          entityType: "SystemSetting",
          metadata: Object.fromEntries(changed.map((c) => [c.key, { from: c.previous ?? null, to: c.value }])),
        },
      });
    }
  }

  @Roles("ADMIN")
  @Get("policies/:type")
  policy(@Param("type") type: string) {
    return this.policies.current(policyType(type));
  }

  @Roles("ADMIN")
  @Put("policies/:type")
  publishPolicy(@CurrentUser() actor: AuthUser, @Param("type") type: string, @Body() dto: PolicyDto) {
    return this.policies.publish(policyType(type), dto.content, actor.id);
  }

  @Roles("ADMIN")
  @Get("audit-log")
  async auditLog(@Query() query: PageQuery) {
    const where = query.q ? { action: { contains: query.q } } : {};
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { actor: { select: userSummarySelect } },
        ...skipTake(query),
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    const items = rows.map((r) => ({
      id: r.id,
      action: r.action,
      entityType: r.entityType,
      entityId: r.entityId,
      metadata: r.metadata,
      ip: r.ip,
      actor: r.actor && toUserSummary(r.actor),
      createdAt: r.createdAt,
    }));
    return paged(items, total, query);
  }
}

function policyType(type: string) {
  const key = type.toUpperCase();
  if (key !== "TERMS" && key !== "PRIVACY") throw new BadRequestException("Unknown policy");
  return key;
}

/** Quotes a CSV cell and defuses spreadsheet formula injection. */
function csvCell(value: string) {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}
