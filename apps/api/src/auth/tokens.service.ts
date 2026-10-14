import { createHash, randomBytes } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { UserRole } from "../generated/prisma/enums.js";
import { PrismaService } from "../prisma/prisma.service.js";

export type AccessTokenPayload = { sub: string; role: UserRole; typ: "access" };
type ResetTokenPayload = { sub: string; typ: "reset"; pwh: string };

export type SessionScope = "app" | "admin";
export type ClientMeta = { ip?: string; userAgent?: string };

const ACCESS_TTL = "15m";
const RESET_TTL = "10m";
export const REFRESH_TTL_MS: Record<SessionScope, number> = {
  app: 30 * 24 * 60 * 60 * 1000,
  admin: 12 * 60 * 60 * 1000,
};

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

// Ties a reset token to the password it was issued against, so it stops working once used.
const passwordFingerprint = (passwordHash: string | null) => sha256(passwordHash ?? "").slice(0, 16);

@Injectable()
export class TokensService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  signAccess(user: { id: string; role: UserRole }) {
    const payload: AccessTokenPayload = { sub: user.id, role: user.role, typ: "access" };
    return this.jwt.signAsync(payload, { expiresIn: ACCESS_TTL });
  }

  signReset(user: { id: string; passwordHash: string | null }) {
    const payload: ResetTokenPayload = { sub: user.id, typ: "reset", pwh: passwordFingerprint(user.passwordHash) };
    return this.jwt.signAsync(payload, { expiresIn: RESET_TTL });
  }

  /** Returns the user id if the reset token is valid for the user's current password. */
  async verifyReset(token: string, currentPasswordHash: (userId: string) => Promise<string | null | undefined>) {
    let payload: ResetTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<ResetTokenPayload>(token);
    } catch {
      throw new UnauthorizedException("Reset link expired, request a new code");
    }
    const hash = await currentPasswordHash(payload.sub);
    if (payload.typ !== "reset" || hash === undefined || payload.pwh !== passwordFingerprint(hash)) {
      throw new UnauthorizedException("Reset link expired, request a new code");
    }
    return payload.sub;
  }

  /** Opens a session and returns its refresh token. Only the token's hash is stored. */
  async createSession(userId: string, scope: SessionScope, meta: ClientMeta) {
    const refreshToken = randomBytes(32).toString("base64url");
    await this.prisma.session.create({
      data: {
        userId,
        isAdmin: scope === "admin",
        refreshTokenHash: sha256(refreshToken),
        userAgent: meta.userAgent?.slice(0, 512),
        ip: meta.ip,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS[scope]),
      },
    });
    return refreshToken;
  }

  /**
   * Swaps a refresh token for a new one (rotation); the old token stops working.
   * `idleTimeoutMs` ends sessions that haven't been refreshed for that long.
   */
  async rotate(refreshToken: string, scope: SessionScope, idleTimeoutMs?: number) {
    const session = await this.prisma.session.findUnique({ where: { refreshTokenHash: sha256(refreshToken) } });
    const now = Date.now();
    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() < now ||
      session.isAdmin !== (scope === "admin") ||
      (idleTimeoutMs && now - session.lastUsedAt.getTime() > idleTimeoutMs)
    ) {
      throw new UnauthorizedException();
    }
    const next = randomBytes(32).toString("base64url");
    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenHash: sha256(next), lastUsedAt: new Date() },
    });
    return { userId: session.userId, refreshToken: next };
  }

  async revoke(refreshToken: string) {
    await this.prisma.session.updateMany({
      where: { refreshTokenHash: sha256(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAll(userId: string, exceptToken?: string) {
    await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(exceptToken ? { refreshTokenHash: { not: sha256(exceptToken) } } : {}),
      },
      data: { revokedAt: new Date() },
    });
  }
}
