import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { PageQuery } from "../common/pagination.js";
import { CommentDto, CreatePostDto, ListPostsQuery, UpdatePostDto } from "./dto/posts.dto.js";
import { PostsService } from "./posts.service.js";

@Controller()
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get("posts")
  feed(@CurrentUser() user: AuthUser, @Query() query: ListPostsQuery) {
    return this.posts.feed(user.id, query);
  }

  @Post("posts")
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.posts.create(user.id, dto);
  }

  @Get("posts/:id")
  detail(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.posts.detail(id, user.id);
  }

  @Patch("posts/:id")
  update(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdatePostDto) {
    return this.posts.update(id, user.id, dto);
  }

  @HttpCode(204)
  @Delete("posts/:id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.posts.remove(id, user.id);
  }

  @HttpCode(200)
  @Post("posts/:id/like")
  like(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.posts.like(id, user.id, true);
  }

  @HttpCode(200)
  @Delete("posts/:id/like")
  unlike(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.posts.like(id, user.id, false);
  }

  @Get("posts/:id/comments")
  comments(@CurrentUser() user: AuthUser, @Param("id") id: string, @Query() query: PageQuery) {
    return this.posts.comments(id, user.id, query);
  }

  @Post("posts/:id/comments")
  comment(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: CommentDto) {
    return this.posts.comment(id, user.id, dto.body);
  }

  @HttpCode(204)
  @Delete("comments/:id")
  removeComment(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.posts.removeComment(id, user.id);
  }

  @Get("classrooms/:id/posts")
  classroomPosts(@CurrentUser() user: AuthUser, @Param("id") id: string, @Query() query: PageQuery) {
    return this.posts.classroomPosts(id, user.id, query);
  }

  @Post("classrooms/:id/posts")
  createClassroomPost(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: CreatePostDto) {
    return this.posts.createClassroomPost(id, user.id, dto);
  }
}
