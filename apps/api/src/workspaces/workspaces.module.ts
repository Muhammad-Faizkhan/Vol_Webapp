import { Module } from "@nestjs/common";
import { InvitesController, WorkspacesController } from "./workspaces.controller.js";
import { WorkspacesService } from "./workspaces.service.js";

@Module({
  controllers: [WorkspacesController, InvitesController],
  providers: [WorkspacesService],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
