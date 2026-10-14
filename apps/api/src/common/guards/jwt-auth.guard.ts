import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator.js";
import type { AuthUser } from "../decorators/current-user.decorator.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { accountBlockReason } from "../../auth/account-status.js";
import type { AccessTokenPayload } from "../../auth/tokens.service.js";

// Applied globally. Verifies the bearer access token, then re-reads the account so a ban,
// suspension or deletion takes effect immediately rather than when the token expires.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const [scheme, token] = request.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) throw new UnauthorizedException();

    let payload: AccessTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<AccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }
    if (payload.typ !== "access") throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, status: true, suspendedUntil: true, deletedAt: true },
    });
    if (!user || user.deletedAt) throw new UnauthorizedException();
    const blocked = accountBlockReason(user);
    if (blocked) throw new ForbiddenException(blocked);

    request.user = { id: user.id, role: user.role };
    return true;
  }
}
