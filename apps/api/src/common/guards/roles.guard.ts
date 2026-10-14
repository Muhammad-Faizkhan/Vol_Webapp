import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "../../generated/prisma/enums.js";
import { ROLES_KEY } from "../decorators/roles.decorator.js";
import type { AuthUser } from "../decorators/current-user.decorator.js";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const user = context.switchToHttp().getRequest().user as AuthUser | undefined;
    return !!user && roles.includes(user.role);
  }
}
