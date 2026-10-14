import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { ReportTarget } from "../generated/prisma/enums.js";
import { ReportsService } from "./reports.service.js";

class CreateReportDto {
  @IsEnum(ReportTarget) targetType: ReportTarget;
  @IsString() targetId: string;
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  reason: string;
  @IsOptional() @IsString() @MaxLength(2000) details?: string;
}

@Controller("reports")
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(201)
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateReportDto) {
    return this.reports.create(user.id, dto.targetType, dto.targetId, dto.reason, dto.details);
  }
}
