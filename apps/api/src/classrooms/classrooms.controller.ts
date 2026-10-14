import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { ClassroomsService } from "./classrooms.service.js";
import {
  CreateClassroomDto,
  JoinClassroomDto,
  LessonDto,
  ListClassroomsQuery,
  ModuleDto,
  ReorderDto,
  UpdateClassroomDto,
  UpdateLessonDto,
  UpdateModuleDto,
} from "./dto/classrooms.dto.js";

@Controller()
export class ClassroomsController {
  constructor(private readonly classrooms: ClassroomsService) {}

  @Get("classrooms")
  list(@CurrentUser() user: AuthUser, @Query() query: ListClassroomsQuery) {
    return this.classrooms.list(user.id, query);
  }

  @Post("classrooms")
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateClassroomDto) {
    return this.classrooms.create(user.id, dto);
  }

  @Get("classrooms/code/:code")
  preview(@Param("code") code: string) {
    return this.classrooms.previewByCode(code);
  }

  @HttpCode(200)
  @Post("classrooms/join")
  join(@CurrentUser() user: AuthUser, @Body() dto: JoinClassroomDto) {
    return this.classrooms.join(dto.code, user.id);
  }

  @Get("classrooms/:id")
  detail(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.detail(id, user.id);
  }

  @Patch("classrooms/:id")
  update(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdateClassroomDto) {
    return this.classrooms.update(id, user.id, dto);
  }

  @HttpCode(204)
  @Delete("classrooms/:id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.remove(id, user.id);
  }

  @HttpCode(200)
  @Post("classrooms/:id/publish")
  publish(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.publish(id, user.id);
  }

  @HttpCode(204)
  @Post("classrooms/:id/archive")
  archive(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.archive(id, user.id);
  }

  @HttpCode(204)
  @Post("classrooms/:id/leave")
  leave(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.leave(id, user.id);
  }

  @Get("classrooms/:id/students")
  students(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.students(id, user.id);
  }

  // ─── Curriculum ────────────────────────────────────────────────────────────

  @Post("classrooms/:id/modules")
  addModule(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: ModuleDto) {
    return this.classrooms.addModule(id, user.id, dto);
  }

  @Put("classrooms/:id/modules/order")
  reorder(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: ReorderDto) {
    return this.classrooms.reorderModules(id, user.id, dto.ids);
  }

  @Patch("modules/:id")
  updateModule(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdateModuleDto) {
    return this.classrooms.updateModule(id, user.id, dto);
  }

  @Delete("modules/:id")
  removeModule(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.removeModule(id, user.id);
  }

  @Post("modules/:id/lessons")
  addLesson(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: LessonDto) {
    return this.classrooms.addLesson(id, user.id, dto);
  }

  @Patch("lessons/:id")
  updateLesson(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdateLessonDto) {
    return this.classrooms.updateLesson(id, user.id, dto);
  }

  @Delete("lessons/:id")
  removeLesson(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.removeLesson(id, user.id);
  }

  @HttpCode(200)
  @Post("lessons/:id/complete")
  complete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.setLessonComplete(id, user.id, true);
  }

  @HttpCode(200)
  @Delete("lessons/:id/complete")
  uncomplete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.classrooms.setLessonComplete(id, user.id, false);
  }
}
