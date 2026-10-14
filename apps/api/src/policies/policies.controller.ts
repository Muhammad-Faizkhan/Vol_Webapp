import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator.js";
import { PoliciesService } from "./policies.service.js";

@Controller("policies")
export class PoliciesController {
  constructor(private readonly policies: PoliciesService) {}

  /** /policies/terms or /policies/privacy. Public: the signup screen links to them. */
  @Public()
  @Get(":type")
  current(@Param("type") type: string) {
    const key = type.toUpperCase();
    if (key !== "TERMS" && key !== "PRIVACY") throw new BadRequestException("Unknown policy");
    return this.policies.current(key);
  }
}
