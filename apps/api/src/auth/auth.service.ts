import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { hash, verify } from "argon2";
import type { Env } from "../config/env.js";
import type { CodePurpose } from "../generated/prisma/enums.js";
import { MailService } from "../mail/mail.service.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { SettingsService } from "../settings/settings.service.js";
import { UsersService } from "../users/users.service.js";
import { WorkspacesService } from "../workspaces/workspaces.service.js";
import { accountBlockReason } from "./account-status.js";
import { CodesService } from "./codes.service.js";
import type { ChangePasswordDto, CredentialsDto, ResetPasswordDto, SignupDto, VerifyCodeDto } from "./dto/auth.dto.js";
import { TokensService, type ClientMeta, type SessionScope } from "./tokens.service.js";

const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_FAILURES = 10;
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const ADMIN_ROLES = new Set(["ADMIN", "MODERATOR"]);

const MAIL_PURPOSE: Record<CodePurpose, "verify" | "reset" | "admin" | "login"> = {
  EMAIL_VERIFICATION: "verify",
  PASSWORD_RESET: "reset",
  ADMIN_LOGIN: "admin",
  LOGIN_2FA: "login",
};

@Injectable()
export class AuthService {
  // Verified against when the email doesn't exist, so response time doesn't reveal registered emails.
  private dummyHash = hash("not-a-real-password");
  private readonly showSignupCode: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokensService,
    private readonly codes: CodesService,
    private readonly mail: MailService,
    private readonly users: UsersService,
    private readonly settings: SettingsService,
    private readonly notifications: NotificationsService,
    private readonly workspaces: WorkspacesService,
    config: ConfigService<Env, true>,
  ) {
    this.showSignupCode = config.get("SHOW_SIGNUP_CODE", { infer: true });
  }

  // ─── Sign up & email verification ──────────────────────────────────────────

  /**
   * Returns `{ email, verificationRequired: true }` when a code was emailed, or a full session when
   * the admin has turned email verification off.
   */
  async signup({ email, password, accountType }: SignupDto, meta: ClientMeta) {
    await this.checkPasswordLength(password);
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing?.emailVerifiedAt || existing?.deletedAt) {
      throw new ConflictException("An account with this email already exists");
    }

    const verificationRequired = await this.settings.bool("users.emailVerificationRequired");
    // An unverified account can sign up again (e.g. they lost the first code); the new details win.
    const data = {
      passwordHash: await hash(password),
      ...(accountType ? { accountType } : {}),
      emailVerifiedAt: verificationRequired ? null : new Date(),
    };
    const user = existing
      ? await this.prisma.user.update({ where: { id: existing.id }, data })
      : await this.prisma.user.create({ data: { email, ...data } });

    if (!verificationRequired) {
      await this.workspaces.claimEmailInvites(user.id, email);
      return this.startSession(user.id, "app", meta);
    }
    const code = await this.sendCode(user.id, email, "EMAIL_VERIFICATION");
    return { email, verificationRequired: true as const, ...this.exposedCode(code) };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && !user.emailVerifiedAt && !user.deletedAt) {
      const code = await this.codes.issue(user.id, "EMAIL_VERIFICATION");
      await this.mail.sendCode(email, code, "verify");
      return { email, ...this.exposedCode(code) };
    }
    return { email };
  }

  async verifyEmail({ email, code }: VerifyCodeDto, meta: ClientMeta) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt || !(await this.codes.consume(user.id, "EMAIL_VERIFICATION", code))) {
      throw new UnauthorizedException("Invalid or expired code");
    }
    if (!user.emailVerifiedAt) {
      await this.prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date() } });
      // Workspace invites sent to this address before the account existed become in-app invites.
      await this.workspaces.claimEmailInvites(user.id, email);
    }
    return this.startSession(user.id, "app", meta);
  }

  // ─── Login ─────────────────────────────────────────────────────────────────

  /** Returns a session, or `{ email, twoFactorRequired: true }` when a sign-in code was emailed. */
  async login({ email, password }: CredentialsDto, meta: ClientMeta) {
    const user = await this.checkPassword(email, password, meta);

    const blocked = accountBlockReason(user);
    if (blocked) throw new ForbiddenException(blocked);

    if (!user.emailVerifiedAt) {
      await this.sendCode(user.id, email, "EMAIL_VERIFICATION", { ignoreCooldown: true });
      throw new ForbiddenException({ message: "Email not verified", code: "EMAIL_NOT_VERIFIED" });
    }

    const twoFactor =
      (await this.settings.bool("access.require2fa")) ||
      (user.accountType === "BUSINESS" && (await this.settings.bool("security.businessOwner2fa")));
    if (twoFactor) {
      await this.sendCode(user.id, email, "LOGIN_2FA", { ignoreCooldown: true });
      return { email, twoFactorRequired: true as const };
    }
    return this.startSession(user.id, "app", meta);
  }

  async verifyLogin({ email, code }: VerifyCodeDto, meta: ClientMeta) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt || !(await this.codes.consume(user.id, "LOGIN_2FA", code))) {
      throw new UnauthorizedException("Invalid or expired code");
    }
    const blocked = accountBlockReason(user);
    if (blocked) throw new ForbiddenException(blocked);
    return this.startSession(user.id, "app", meta);
  }

  // Admin sign-in is passwordless: the admin enters their email and gets a one-time code.
  // The response never reveals whether the email belongs to an admin.
  async adminLogin(email: string, meta: ClientMeta) {
    await this.checkLockout(email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && !user.deletedAt && ADMIN_ROLES.has(user.role) && !accountBlockReason(user)) {
      // Cooldown errors are swallowed too, or a 429 would reveal which emails are admins.
      await this.sendCode(user.id, email, "ADMIN_LOGIN", { ignoreCooldown: true });
    } else {
      await this.recordAttempt(email, user?.id, false, true, meta);
    }
    return { email };
  }

  async adminVerify({ email, code }: VerifyCodeDto, meta: ClientMeta) {
    await this.checkLockout(email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    const ok =
      !!user &&
      !user.deletedAt &&
      ADMIN_ROLES.has(user.role) &&
      !accountBlockReason(user) &&
      (await this.codes.consume(user.id, "ADMIN_LOGIN", code));
    await this.recordAttempt(email, user?.id, ok, true, meta);
    if (!ok || !user) throw new UnauthorizedException("Invalid or expired code");

    await this.prisma.auditLog.create({
      data: { actorId: user.id, action: "admin.login", entityType: "User", entityId: user.id, ip: meta.ip },
    });
    return this.startSession(user.id, "admin", meta);
  }

  /** Checks credentials with lockout and attempt logging. Throws a generic 401 on any mismatch. */
  private async checkPassword(email: string, password: string, meta: ClientMeta) {
    await this.checkLockout(email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    const ok = user?.passwordHash && !user.deletedAt
      ? await verify(user.passwordHash, password)
      : await verify(await this.dummyHash, password).then(() => false);

    await this.recordAttempt(email, user?.id, ok, false, meta);
    if (!ok || !user) throw new UnauthorizedException("Invalid email or password");
    return user;
  }

  private async checkLockout(email: string) {
    if (!(await this.settings.bool("access.lockout"))) return;
    const recentFailures = await this.prisma.loginAttempt.count({
      where: { email, success: false, createdAt: { gt: new Date(Date.now() - LOCKOUT_WINDOW_MS) } },
    });
    if (recentFailures >= LOCKOUT_FAILURES) {
      throw new HttpException("Too many failed attempts, try again later", HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private recordAttempt(email: string, userId: string | undefined, success: boolean, isAdmin: boolean, meta: ClientMeta) {
    return this.prisma.loginAttempt.create({
      data: { email, userId, success, isAdmin, ip: meta.ip, userAgent: meta.userAgent?.slice(0, 512) },
    });
  }

  // ─── Passwords ─────────────────────────────────────────────────────────────

  // Always succeeds so the endpoint can't be used to discover which emails are registered.
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && !user.deletedAt) {
      await this.sendCode(user.id, email, "PASSWORD_RESET", { ignoreCooldown: true });
    }
    return { email };
  }

  /** Step 2 of the reset flow (the OTP screen): trades a valid code for a short-lived reset token. */
  async verifyResetCode({ email, code }: VerifyCodeDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt || !(await this.codes.consume(user.id, "PASSWORD_RESET", code))) {
      throw new UnauthorizedException("Invalid or expired code");
    }
    return { resetToken: await this.tokens.signReset(user) };
  }

  async resetPassword({ resetToken, password }: ResetPasswordDto) {
    await this.checkPasswordLength(password);
    const userId = await this.tokens.verifyReset(resetToken, async (id) => {
      const user = await this.prisma.user.findUnique({ where: { id }, select: { passwordHash: true } });
      return user ? user.passwordHash : undefined;
    });
    await this.prisma.user.update({
      where: { id: userId },
      // Receiving the code proves ownership of the inbox, so the email counts as verified too.
      data: { passwordHash: await hash(password), emailVerifiedAt: new Date() },
    });
    await this.tokens.revokeAll(userId);
    await this.prisma.auditLog.create({
      data: { actorId: userId, action: "user.password_reset", entityType: "User", entityId: userId },
    });
    return { ok: true };
  }

  /** Signs out every other device; the current session (its refresh token) stays signed in. */
  async changePassword(userId: string, { currentPassword, newPassword }: ChangePasswordDto, currentRefreshToken?: string) {
    await this.checkPasswordLength(newPassword);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.passwordHash || !(await verify(user.passwordHash, currentPassword))) {
      throw new BadRequestException("Current password is incorrect");
    }
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: await hash(newPassword) } });
    await this.tokens.revokeAll(userId, currentRefreshToken);
    await this.prisma.auditLog.create({
      data: { actorId: userId, action: "user.password_change", entityType: "User", entityId: userId },
    });
    return { ok: true };
  }

  private async checkPasswordLength(password: string) {
    const min = await this.settings.number("security.minPasswordLength");
    if (password.length < min) throw new BadRequestException(`Password must be at least ${min} characters`);
  }

  // ─── Sessions ──────────────────────────────────────────────────────────────

  async refresh(refreshToken: string, scope: SessionScope) {
    const idleTimeout = (await this.settings.bool("access.sessionTimeout")) ? IDLE_TIMEOUT_MS : undefined;
    const { userId, refreshToken: next } = await this.tokens.rotate(refreshToken, scope, idleTimeout);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt || accountBlockReason(user) || (scope === "admin" && !ADMIN_ROLES.has(user.role))) {
      await this.tokens.revoke(next);
      throw new UnauthorizedException();
    }
    await this.prisma.user.update({ where: { id: userId }, data: { lastActiveAt: new Date() } });
    return { refreshToken: next, accessToken: await this.tokens.signAccess(user), user: await this.users.me(userId) };
  }

  logout(refreshToken: string) {
    return this.tokens.revoke(refreshToken);
  }

  private async startSession(userId: string, scope: SessionScope, meta: ClientMeta) {
    await this.alertOnNewDevice(userId, meta);
    const user = await this.prisma.user.update({ where: { id: userId }, data: { lastActiveAt: new Date() } });
    return {
      refreshToken: await this.tokens.createSession(userId, scope, meta),
      accessToken: await this.tokens.signAccess(user),
      user: await this.users.me(userId),
    };
  }

  private async alertOnNewDevice(userId: string, meta: ClientMeta) {
    const enabled =
      (await this.settings.bool("access.newDeviceAlert")) || (await this.settings.bool("security.suspiciousLoginAlerts"));
    if (!enabled || !meta.userAgent) return;
    const [known, any] = await this.prisma.$transaction([
      this.prisma.session.count({ where: { userId, userAgent: meta.userAgent.slice(0, 512) } }),
      this.prisma.session.count({ where: { userId } }),
    ]);
    if (known > 0 || any === 0) return; // first ever sign-in isn't "new device"
    await this.notifications.notify({
      userId,
      type: "SECURITY_ALERT",
      title: "New sign-in to your VÔL account",
      body: `Your account was signed in from a new device${meta.ip ? ` (IP ${meta.ip})` : ""}. If this wasn't you, reset your password.`,
      email: true,
    });
  }

  /** Only while SHOW_SIGNUP_CODE is on: the email verification code, for the app to show on screen. */
  private exposedCode(code: string | undefined) {
    return this.showSignupCode && code ? { devCode: code } : {};
  }

  /**
   * Emails a code and returns it. With `ignoreCooldown`, a code sent under a minute ago is kept
   * (it's still valid) and nothing is returned.
   */
  private async sendCode(userId: string, email: string, purpose: CodePurpose, opts: { ignoreCooldown?: boolean } = {}) {
    try {
      const code = await this.codes.issue(userId, purpose);
      await this.mail.sendCode(email, code, MAIL_PURPOSE[purpose]);
      return code;
    } catch (error) {
      const coolingDown = error instanceof HttpException && error.getStatus() === HttpStatus.TOO_MANY_REQUESTS;
      if (!(coolingDown && opts.ignoreCooldown)) throw error;
    }
  }
}
