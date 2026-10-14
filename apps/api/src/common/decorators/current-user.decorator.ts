import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { UserRole } from "../../generated/prisma/enums.js";

/** What JwtAuthGuard attaches to `request.user`. */
export type AuthUser = { id: string; role: UserRole };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user,
);
