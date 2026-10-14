import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({ status: "error", database: "down" });
    }
    return { status: "ok", database: "up" };
  }
}
