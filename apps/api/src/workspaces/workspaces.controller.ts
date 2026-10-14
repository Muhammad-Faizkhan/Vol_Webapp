import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import {
  ChangeRoleDto,
  CreateWorkspaceDto,
  FolderDto,
  InviteLinkDto,
  InviteMembersDto,
  ListWorkspacesQuery,
  UpdateWorkspaceDto,
} from "./dto/workspaces.dto.js";
import { WorkspacesService } from "./workspaces.service.js";

@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspaces: WorkspacesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListWorkspacesQuery) {
    return this.workspaces.list(user.id, query);
  }

  @Get("public")
  listPublic(@Query() query: ListWorkspacesQuery) {
    return this.workspaces.listPublic(query);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateWorkspaceDto) {
    return this.workspaces.create(user.id, dto);
  }

  @Get(":id")
  detail(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.detail(id, user.id);
  }

  @Patch(":id")
  update(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdateWorkspaceDto) {
    return this.workspaces.update(id, user.id, dto);
  }

  @HttpCode(204)
  @Delete(":id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.remove(id, user.id);
  }

  // ─── Members ───────────────────────────────────────────────────────────────

  @Get(":id/members")
  members(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.members(id, user.id);
  }

  @Patch(":id/members/:userId")
  changeRole(@CurrentUser() user: AuthUser, @Param("id") id: string, @Param("userId") memberId: string, @Body() dto: ChangeRoleDto) {
    return this.workspaces.changeRole(id, user.id, memberId, dto.role);
  }

  @HttpCode(204)
  @Delete(":id/members/:userId")
  removeMember(@CurrentUser() user: AuthUser, @Param("id") id: string, @Param("userId") memberId: string) {
    return this.workspaces.removeMember(id, user.id, memberId);
  }

  // ─── Invites ───────────────────────────────────────────────────────────────

  @Get(":id/invites")
  pendingInvites(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.pendingInvites(id, user.id);
  }

  @Post(":id/invites")
  invite(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: InviteMembersDto) {
    return this.workspaces.invite(id, user.id, dto);
  }

  @HttpCode(204)
  @Delete(":id/invites/:inviteId")
  revokeInvite(@CurrentUser() user: AuthUser, @Param("id") id: string, @Param("inviteId") inviteId: string) {
    return this.workspaces.revokeInvite(id, user.id, inviteId);
  }

  @Get(":id/invite-link")
  inviteLink(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.inviteLink(id, user.id);
  }

  @Post(":id/invite-link")
  resetInviteLink(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: InviteLinkDto) {
    return this.workspaces.inviteLink(id, user.id, !dto.role, dto.role);
  }

  @Get(":id/join-requests")
  joinRequests(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.joinRequests(id, user.id);
  }

  // ─── Activity & folders ────────────────────────────────────────────────────

  @Get(":id/activity")
  activity(@CurrentUser() user: AuthUser, @Param("id") id: string, @Query("limit") limit?: string) {
    return this.workspaces.activity(id, user.id, Math.min(Number(limit) || 10, 100));
  }

  @Get(":id/folders")
  folders(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.folders(id, user.id);
  }

  @Post(":id/folders")
  createFolder(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: FolderDto) {
    return this.workspaces.createFolder(id, user.id, dto.name);
  }

  @HttpCode(204)
  @Patch(":id/folders/:folderId")
  renameFolder(@CurrentUser() user: AuthUser, @Param("id") id: string, @Param("folderId") folderId: string, @Body() dto: FolderDto) {
    return this.workspaces.renameFolder(id, user.id, folderId, dto.name);
  }

  @HttpCode(204)
  @Delete(":id/folders/:folderId")
  deleteFolder(@CurrentUser() user: AuthUser, @Param("id") id: string, @Param("folderId") folderId: string) {
    return this.workspaces.deleteFolder(id, user.id, folderId);
  }
}

/** Endpoints addressed by invite / request id rather than workspace id. */
@Controller()
export class InvitesController {
  constructor(private readonly workspaces: WorkspacesService) {}

  @HttpCode(200)
  @Post("invites/:id/accept")
  accept(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.answerInvite(id, user.id, true);
  }

  @HttpCode(200)
  @Post("invites/:id/decline")
  decline(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.answerInvite(id, user.id, false);
  }

  @Get("invite-links/:token")
  preview(@CurrentUser() user: AuthUser, @Param("token") token: string) {
    return this.workspaces.linkPreview(token, user.id);
  }

  @HttpCode(200)
  @Post("invite-links/:token/request")
  requestToJoin(@CurrentUser() user: AuthUser, @Param("token") token: string) {
    return this.workspaces.requestToJoin(token, user.id);
  }

  @HttpCode(200)
  @Post("join-requests/:id/accept")
  acceptRequest(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.answerJoinRequest(id, user.id, true);
  }

  @HttpCode(200)
  @Post("join-requests/:id/decline")
  declineRequest(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.workspaces.answerJoinRequest(id, user.id, false);
  }
}
