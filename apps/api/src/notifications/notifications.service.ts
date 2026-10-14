import { Injectable, NotFoundException } from "@nestjs/common";
import type { NotificationType } from "../generated/prisma/enums.js";
import { Prisma } from "../generated/prisma/client.js";
import { MailService } from "../mail/mail.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { SettingsService } from "../settings/settings.service.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import type { PageQuery } from "../common/pagination.js";
import { paged, skipTake } from "../common/pagination.js";

type NotifyInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  actorId?: string;
  data?: Record<string, string>;
  /** Also email it (when email notifications are on platform-wide and for this user). */
  email?: boolean;
};

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SettingsService,
    private readonly mail: MailService,
  ) {}

  async notify({ userId, type, title, body, actorId, data, email }: NotifyInput) {
    if (userId === actorId) return;
    if (await this.settings.bool("notifications.inApp")) {
      await this.prisma.notification.create({
        data: { userId, type, title, body, actorId, data: data ?? Prisma.JsonNull },
      });
    }
    if (email && (await this.settings.bool("notifications.email"))) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, deletedAt: true, profile: { select: { emailNotifications: true } } },
      });
      if (user && !user.deletedAt && user.profile?.emailNotifications !== false) {
        await this.mail.send(user.email, title, body);
      }
    }
  }

  async list(userId: string, query: PageQuery) {
    const where = { userId };
    const [rows, total, unread] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { actor: { select: userSummarySelect } },
        ...skipTake(query),
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, readAt: null } }),
    ]);
    const items = rows.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      data: n.data,
      read: !!n.readAt,
      resolved: !!n.resolvedAt,
      createdAt: n.createdAt,
      actor: n.actor && toUserSummary(n.actor),
    }));
    return { ...paged(items, total, query), unread };
  }

  async markRead(userId: string, id?: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null, ...(id ? { id } : {}) },
      data: { readAt: new Date() },
    });
  }

  /** Marks the actionable notifications pointing at `key=value` (e.g. inviteId) as answered. */
  async resolve(userId: string, key: string, value: string) {
    await this.prisma.notification.updateMany({
      where: { userId, resolvedAt: null, data: { path: [key], equals: value } },
      data: { resolvedAt: new Date(), readAt: new Date() },
    });
  }

  async remove(userId: string, id: string) {
    const { count } = await this.prisma.notification.deleteMany({ where: { id, userId } });
    if (!count) throw new NotFoundException();
  }
}
