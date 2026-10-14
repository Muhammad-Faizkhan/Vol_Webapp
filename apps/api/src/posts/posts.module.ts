import { Module } from "@nestjs/common";
import { ClassroomsModule } from "../classrooms/classrooms.module.js";
import { PostsController } from "./posts.controller.js";
import { PostsService } from "./posts.service.js";

@Module({
  imports: [ClassroomsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
