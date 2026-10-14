import { Controller, Delete, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { PageQuery } from "../common/pagination.js";
import { NotificationsService } from "./notifications.service.js";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: PageQuery) {
    return this.notifications.list(user.id, query);
  }

  @HttpCode(204)
  @Post("read")
  readAll(@CurrentUser() user: AuthUser) {
    return this.notifications.markRead(user.id);
  }

  @HttpCode(204)
  @Post(":id/read")
  read(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.notifications.markRead(user.id, id);
  }

  @HttpCode(204)
  @Delete(":id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.notifications.remove(user.id, id);
  }
}
