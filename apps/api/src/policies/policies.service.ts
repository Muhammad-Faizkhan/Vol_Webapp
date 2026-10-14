import { Injectable, NotFoundException } from "@nestjs/common";
import type { PolicyType } from "../generated/prisma/enums.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class PoliciesService {
  constructor(private readonly prisma: PrismaService) {}

  /** The live (latest published) version. */
  async current(type: PolicyType) {
    const policy = await this.prisma.policy.findFirst({
      where: { type, publishedAt: { not: null } },
      orderBy: { version: "desc" },
    });
    if (!policy) throw new NotFoundException("Policy not published yet");
    return { type: policy.type, version: policy.version, content: policy.content, publishedAt: policy.publishedAt };
  }

  /** Publishing always creates a new version so earlier wording stays on record. */
  async publish(type: PolicyType, content: string, actorId: string) {
    const latest = await this.prisma.policy.findFirst({ where: { type }, orderBy: { version: "desc" } });
    const policy = await this.prisma.policy.create({
      data: { type, version: (latest?.version ?? 0) + 1, content, publishedAt: new Date(), updatedById: actorId },
    });
    await this.prisma.auditLog.create({
      data: { actorId, action: "policy.publish", entityType: "Policy", entityId: policy.id, metadata: { type, version: policy.version } },
    });
    return { type: policy.type, version: policy.version, content: policy.content, publishedAt: policy.publishedAt };
  }
}
