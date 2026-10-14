import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import type { Env } from "../config/env.js";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { Public } from "../common/decorators/public.decorator.js";
import { UsersService } from "../users/users.service.js";
import { AuthService } from "./auth.service.js";
import {
  ChangePasswordDto,
  CredentialsDto,
  EmailDto,
  ResetPasswordDto,
  SignupDto,
  VerifyCodeDto,
} from "./dto/auth.dto.js";
import { REFRESH_TTL_MS, type ClientMeta, type SessionScope } from "./tokens.service.js";

// The web app and admin panel keep separate refresh cookies so signing into one never signs out the other.
const REFRESH_COOKIE: Record<SessionScope, string> = { app: "vol_rt", admin: "vol_admin_rt" };

// Auth endpoints get a tighter per-IP rate limit than the global default.
@Throttle({ default: { limit: 20, ttl: 60_000 } })
@Controller("auth")
export class AuthController {
  private readonly secureCookies: boolean;

  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
    config: ConfigService<Env, true>,
  ) {
    this.secureCookies = config.get("NODE_ENV", { infer: true }) === "production";
  }

  // ─── User app ──────────────────────────────────────────────────────────────

  @Public()
  @Post("signup")
  async signup(@Body() dto: SignupDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.maybeWithCookie(res, "app", await this.auth.signup(dto, meta(req)));
  }

  @Public()
  @HttpCode(200)
  @Post("verify-email")
  async verifyEmail(@Body() dto: VerifyCodeDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.withCookie(res, "app", await this.auth.verifyEmail(dto, meta(req)));
  }

  @Public()
  @HttpCode(200)
  @Post("resend-verification")
  resendVerification(@Body() { email }: EmailDto) {
    return this.auth.resendVerification(email);
  }

  @Public()
  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: CredentialsDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.maybeWithCookie(res, "app", await this.auth.login(dto, meta(req)));
  }

  @Public()
  @HttpCode(200)
  @Post("login/verify")
  async verifyLogin(@Body() dto: VerifyCodeDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.withCookie(res, "app", await this.auth.verifyLogin(dto, meta(req)));
  }

  @Public()
  @HttpCode(200)
  @Post("forgot-password")
  forgotPassword(@Body() { email }: EmailDto) {
    return this.auth.forgotPassword(email);
  }

  @Public()
  @HttpCode(200)
  @Post("forgot-password/verify")
  verifyResetCode(@Body() dto: VerifyCodeDto) {
    return this.auth.verifyResetCode(dto);
  }

  @Public()
  @HttpCode(200)
  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto);
  }

  @HttpCode(200)
  @Post("change-password")
  changePassword(@CurrentUser() user: AuthUser, @Body() dto: ChangePasswordDto, @Req() req: Request) {
    return this.auth.changePassword(user.id, dto, req.cookies?.[REFRESH_COOKIE.app]);
  }

  @Public()
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  @HttpCode(200)
  @Post("refresh")
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.rotate("app", req, res);
  }

  @Public()
  @HttpCode(204)
  @Post("logout")
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.endSession("app", req, res);
  }

  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.users.me(user.id);
  }

  // ─── Admin panel ───────────────────────────────────────────────────────────

  @Public()
  @HttpCode(200)
  @Post("admin/login")
  adminLogin(@Body() { email }: EmailDto, @Req() req: Request) {
    return this.auth.adminLogin(email, meta(req));
  }

  @Public()
  @HttpCode(200)
  @Post("admin/verify")
  async adminVerify(@Body() dto: VerifyCodeDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.withCookie(res, "admin", await this.auth.adminVerify(dto, meta(req)));
  }

  @Public()
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  @HttpCode(200)
  @Post("admin/refresh")
  adminRefresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.rotate("admin", req, res);
  }

  @Public()
  @HttpCode(204)
  @Post("admin/logout")
  adminLogout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.endSession("admin", req, res);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async rotate(scope: SessionScope, req: Request, res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE[scope]];
    if (!token) throw new UnauthorizedException();
    try {
      return this.withCookie(res, scope, await this.auth.refresh(token, scope));
    } catch (error) {
      this.clearCookie(res, scope);
      throw error;
    }
  }

  private async endSession(scope: SessionScope, req: Request, res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE[scope]];
    if (token) await this.auth.logout(token);
    this.clearCookie(res, scope);
  }

  /** For responses that may or may not start a session (signup, login with 2FA). */
  private maybeWithCookie<T extends object>(res: Response, scope: SessionScope, result: T) {
    return "refreshToken" in result && typeof result.refreshToken === "string"
      ? this.withCookie(res, scope, result as T & { refreshToken: string })
      : result;
  }

  /** Moves the refresh token out of the JSON body into an httpOnly cookie. */
  private withCookie<T extends { refreshToken: string }>(res: Response, scope: SessionScope, result: T) {
    const { refreshToken, ...body } = result;
    res.cookie(REFRESH_COOKIE[scope], refreshToken, {
      httpOnly: true,
      secure: this.secureCookies,
      sameSite: "lax",
      path: "/auth",
      maxAge: REFRESH_TTL_MS[scope],
    });
    return body;
  }

  private clearCookie(res: Response, scope: SessionScope) {
    res.clearCookie(REFRESH_COOKIE[scope], { httpOnly: true, secure: this.secureCookies, sameSite: "lax", path: "/auth" });
  }
}

const meta = (req: Request): ClientMeta => ({ ip: req.ip, userAgent: req.get("user-agent") });
