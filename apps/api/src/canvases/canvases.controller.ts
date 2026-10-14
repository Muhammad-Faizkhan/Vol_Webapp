import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { PageQuery } from "../common/pagination.js";
import { CanvasesService } from "./canvases.service.js";
import { AddProductDto, CreateCanvasDto, ListCanvasesQuery, SaveCanvasDto, UpdateCanvasDto } from "./dto/canvases.dto.js";

@Controller()
export class CanvasesController {
  constructor(private readonly canvases: CanvasesService) {}

  @Get("workspaces/:workspaceId/canvases")
  listInWorkspace(@CurrentUser() user: AuthUser, @Param("workspaceId") workspaceId: string, @Query() query: ListCanvasesQuery) {
    return this.canvases.listInWorkspace(workspaceId, user.id, query);
  }

  @Get("canvases/recent")
  recent(@CurrentUser() user: AuthUser, @Query() query: ListCanvasesQuery) {
    return this.canvases.recent(user.id, query);
  }

  @Get("canvases/public")
  listPublic(@Query() query: ListCanvasesQuery, @Query("authorId") authorId?: string) {
    return this.canvases.listPublic(query, authorId);
  }

  @Post("canvases")
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCanvasDto) {
    return this.canvases.create(user.id, dto);
  }

  @Get("canvases/:id")
  detail(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.canvases.detail(id, user.id);
  }

  @Patch("canvases/:id")
  update(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdateCanvasDto) {
    return this.canvases.update(id, user.id, dto);
  }

  @Put("canvases/:id/data")
  save(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: SaveCanvasDto) {
    return this.canvases.save(id, user.id, dto.data);
  }

  @Get("canvases/:id/revisions")
  revisions(@CurrentUser() user: AuthUser, @Param("id") id: string, @Query() query: PageQuery) {
    return this.canvases.revisions(id, user.id, query);
  }

  @HttpCode(204)
  @Delete("canvases/:id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.canvases.remove(id, user.id);
  }

  @Post("canvases/:id/products")
  addProduct(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: AddProductDto) {
    return this.canvases.addProduct(id, user.id, dto.productId);
  }

  @HttpCode(204)
  @Delete("canvases/:id/products/:productId")
  removeProduct(@CurrentUser() user: AuthUser, @Param("id") id: string, @Param("productId") productId: string) {
    return this.canvases.removeProduct(id, user.id, productId);
  }
}
