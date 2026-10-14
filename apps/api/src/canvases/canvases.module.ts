import { Module } from "@nestjs/common";
import { WorkspacesModule } from "../workspaces/workspaces.module.js";
import { CanvasesController } from "./canvases.controller.js";
import { CanvasesService } from "./canvases.service.js";

@Module({
  imports: [WorkspacesModule],
  controllers: [CanvasesController],
  providers: [CanvasesService],
  exports: [CanvasesService],
})
export class CanvasesModule {}
