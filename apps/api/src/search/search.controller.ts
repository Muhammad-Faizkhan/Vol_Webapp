import { Controller, Get, Query } from "@nestjs/common";
import { IsEnum, IsOptional } from "class-validator";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { PageQuery } from "../common/pagination.js";
import { AccountType } from "../generated/prisma/enums.js";
import { SearchService } from "./search.service.js";

class PeopleQuery extends PageQuery {
  @IsOptional() @IsEnum(AccountType) type?: AccountType;
}

@Controller()
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get("search")
  everything(@CurrentUser() user: AuthUser, @Query("q") q = "") {
    return this.search.everything(user.id, q.slice(0, 100));
  }

  @Get("people")
  people(@CurrentUser() user: AuthUser, @Query() query: PeopleQuery) {
    return this.search.people(user.id, query);
  }
}
