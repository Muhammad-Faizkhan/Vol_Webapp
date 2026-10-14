import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { ReportTarget } from "../generated/prisma/enums.js";
import { PrismaService } from "../prisma/prisma.service.js";

const TARGET_LABEL: Record<ReportTarget, string> = {
  USER: "Profile",
  POST: "Post",
  COMMENT: "Comment",
  PRODUCT: "Product listing",
  WORKSPACE: "Workspace",
  CANVAS: "Canvas",
  CLASSROOM: "Classroom",
};

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Files a report. Reports against the same account collect into one open case, which is what
   * moderators see in the admin panel's Cases list.
   */
  async create(reporterId: string, targetType: ReportTarget, targetId: string, reason: string, details?: string) {
    const target = await this.resolve(targetType, targetId);
    if (target.userId === reporterId) throw new BadRequestException("You can't report your own content");

    const evidence = `${TARGET_LABEL[targetType]}: ${target.label}`;
    let kase = await this.prisma.case.findFirst({
      where: { reportedUserId: target.userId, status: { in: ["OPEN", "IN_REVIEW"] } },
      orderBy: { createdAt: "desc" },
    });
    if (kase) {
      kase = await this.prisma.case.update({
        where: { id: kase.id },
        data: { evidence: kase.evidence.includes(evidence) ? undefined : { push: evidence } },
      });
    } else {
      kase = await this.prisma.case.create({
        data: {
          title: `${reason} reported on ${TARGET_LABEL[targetType].toLowerCase()}`,
          violation: reason,
          reportedUserId: target.userId,
          reporterId,
          evidence: [evidence],
        },
      });
    }
    await this.prisma.report.create({
      data: { reporterId, targetType, targetId, reason, details, caseId: kase.id },
    });
    return { ok: true };
  }

  /** Finds who owns the reported thing and a short description of it for the case's evidence list. */
  private async resolve(type: ReportTarget, id: string): Promise<{ userId: string; label: string }> {
    const notFound = () => new NotFoundException("The reported item no longer exists");
    switch (type) {
      case "USER": {
        const u = await this.prisma.user.findFirst({ where: { id, deletedAt: null }, include: { profile: true } });
        if (!u) throw notFound();
        return { userId: u.id, label: u.profile?.fullName ?? u.username ?? u.email };
      }
      case "POST": {
        const p = await this.prisma.post.findFirst({ where: { id, deletedAt: null } });
        if (!p) throw notFound();
        return { userId: p.authorId, label: p.title };
      }
      case "COMMENT": {
        const c = await this.prisma.postComment.findFirst({ where: { id, deletedAt: null } });
        if (!c) throw notFound();
        return { userId: c.authorId, label: `"${c.body.slice(0, 80)}"` };
      }
      case "PRODUCT": {
        const p = await this.prisma.product.findFirst({ where: { id, status: { not: "REMOVED" } } });
        if (!p) throw notFound();
        return { userId: p.businessId, label: p.name };
      }
      case "WORKSPACE": {
        const w = await this.prisma.workspace.findFirst({ where: { id, deletedAt: null } });
        if (!w) throw notFound();
        return { userId: w.ownerId, label: w.name };
      }
      case "CANVAS": {
        const c = await this.prisma.canvas.findFirst({ where: { id, deletedAt: null } });
        if (!c) throw notFound();
        return { userId: c.createdById, label: c.title };
      }
      case "CLASSROOM": {
        const c = await this.prisma.classroom.findFirst({ where: { id, deletedAt: null } });
        if (!c) throw notFound();
        return { userId: c.instructorId, label: c.title };
      }
    }
  }
}
