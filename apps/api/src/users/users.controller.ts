import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import {
  DeleteAccountDto,
  UpdateAccountDto,
  UpdatePreferencesDto,
  UpsertBusinessDto,
  UpsertProfileDto,
} from "./dto/users.dto.js";
import { UsersService } from "./users.service.js";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // ─── The signed-in user ────────────────────────────────────────────────────

  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.users.me(user.id);
  }

  @Patch("me")
  updateAccount(@CurrentUser() user: AuthUser, @Body() dto: UpdateAccountDto) {
    return this.users.updateAccount(user.id, dto);
  }

  @Put("me/profile")
  upsertProfile(@CurrentUser() user: AuthUser, @Body() dto: UpsertProfileDto) {
    return this.users.upsertProfile(user.id, dto);
  }

  @Patch("me/preferences")
  updatePreferences(@CurrentUser() user: AuthUser, @Body() dto: UpdatePreferencesDto) {
    return this.users.updatePreferences(user.id, dto);
  }

  @Put("me/business")
  upsertBusiness(@CurrentUser() user: AuthUser, @Body() dto: UpsertBusinessDto) {
    return this.users.upsertBusiness(user.id, dto);
  }

  @HttpCode(200)
  @Post("me/complete-onboarding")
  completeOnboarding(@CurrentUser() user: AuthUser) {
    return this.users.completeOnboarding(user.id);
  }

  @Get("me/stats")
  stats(@CurrentUser() user: AuthUser) {
    return this.users.stats(user.id);
  }

  /** POST rather than DELETE so the password confirmation can travel in a body. */
  @HttpCode(204)
  @Post("me/delete")
  deleteAccount(@CurrentUser() user: AuthUser, @Body() dto: DeleteAccountDto) {
    return this.users.deleteOwnAccount(user.id, dto.password);
  }

  @Get("suggestions")
  suggestions(@CurrentUser() user: AuthUser, @Query("limit") limit?: string) {
    return this.users.suggestions(user.id, Math.min(Number(limit) || 4, 20));
  }

  // ─── Other people ──────────────────────────────────────────────────────────

  @Get(":id")
  profile(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.users.publicProfile(id, user.id);
  }

  @HttpCode(200)
  @Post(":id/follow")
  follow(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.users.follow(user.id, id);
  }

  @HttpCode(200)
  @Delete(":id/follow")
  unfollow(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.users.unfollow(user.id, id);
  }
}
