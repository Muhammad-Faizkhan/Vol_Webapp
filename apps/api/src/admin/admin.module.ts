import { Module } from "@nestjs/common";
import { PoliciesModule } from "../policies/policies.module.js";
import { UsersModule } from "../users/users.module.js";
import { AdminModerationService } from "./admin-moderation.service.js";
import { AdminStatsService } from "./admin-stats.service.js";
import { AdminController } from "./admin.controller.js";

@Module({
  imports: [UsersModule, PoliciesModule],
  controllers: [AdminController],
  providers: [AdminModerationService, AdminStatsService],
})
export class AdminModule {}
