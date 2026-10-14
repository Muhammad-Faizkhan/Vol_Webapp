import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module.js";
import { WorkspacesModule } from "../workspaces/workspaces.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { CodesService } from "./codes.service.js";
import { TokensService } from "./tokens.service.js";

@Module({
  imports: [UsersModule, WorkspacesModule],
  controllers: [AuthController],
  providers: [AuthService, CodesService, TokensService],
})
export class AuthModule {}
