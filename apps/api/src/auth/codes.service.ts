import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { CodePurpose } from "../generated/prisma/enums.js";
import type { Env } from "../config/env.js";
import { PrismaService } from "../prisma/prisma.service.js";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

// Six-digit one-time codes for the OTP screens. Codes are HMAC'd with a server-side pepper,
// so a database leak alone doesn't expose them; each code allows MAX_ATTEMPTS guesses.
@Injectable()
export class CodesService {
  private readonly pepper: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService<Env, true>,
  ) {
    this.pepper = config.get("CODE_PEPPER", { infer: true });
  }

  private hash(code: string) {
    return createHmac("sha256", this.pepper).update(code).digest();
  }

  /** Creates a fresh code (invalidating earlier ones for the same purpose) and returns it in plain text. */
  async issue(userId: string, purpose: CodePurpose) {
    // The cooldown only applies while the previous code is still usable; once it's been used
    // (or burned through its attempts) a fresh code can be sent straight away.
    const latest = await this.prisma.verificationCode.findFirst({
      where: { userId, purpose },
      orderBy: { createdAt: "desc" },
    });
    const stillUsable = latest && !latest.consumedAt && latest.attempts < MAX_ATTEMPTS;
    if (stillUsable && Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS) {
      throw new HttpException("Please wait a minute before requesting another code", HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    await this.prisma.$transaction([
      this.prisma.verificationCode.updateMany({
        where: { userId, purpose, consumedAt: null },
        data: { consumedAt: new Date() },
      }),
      this.prisma.verificationCode.create({
        data: {
          userId,
          purpose,
          codeHash: this.hash(code).toString("hex"),
          expiresAt: new Date(Date.now() + CODE_TTL_MS),
        },
      }),
    ]);
    return code;
  }

  /** Consumes the code if it matches. Returns false for wrong, expired or exhausted codes. */
  async consume(userId: string, purpose: CodePurpose, code: string) {
    const record = await this.prisma.verificationCode.findFirst({
      where: { userId, purpose, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!record || record.attempts >= MAX_ATTEMPTS) return false;

    const expected = Buffer.from(record.codeHash, "hex");
    const actual = this.hash(code);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      await this.prisma.verificationCode.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
      return false;
    }

    // Conditional update so two concurrent requests can't both consume the same code.
    const { count } = await this.prisma.verificationCode.updateMany({
      where: { id: record.id, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    return count === 1;
  }
}
