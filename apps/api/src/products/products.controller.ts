import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { CreateProductDto, ListProductsQuery, MyProductsQuery, UpdateProductDto } from "./dto/products.dto.js";
import { ProductsService } from "./products.service.js";

@Controller("products")
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@Query() query: ListProductsQuery) {
    return this.products.list(query);
  }

  @Get("facets")
  facets() {
    return this.products.facets();
  }

  @Get("mine")
  mine(@CurrentUser() user: AuthUser, @Query() query: MyProductsQuery) {
    return this.products.mine(user.id, query);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateProductDto) {
    return this.products.create(user.id, dto);
  }

  @Get(":id")
  detail(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.products.detail(id, user.id);
  }

  @Patch(":id")
  update(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.products.update(id, user.id, dto);
  }

  @HttpCode(204)
  @Delete(":id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.products.remove(id, user.id);
  }
}
