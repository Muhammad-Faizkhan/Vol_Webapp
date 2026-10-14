import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, type Transporter } from "nodemailer";
import type { Env } from "../config/env.js";

// Sends through SMTP when SMTP_URL is set (any provider: Resend, SES, Postmark, Gmail...).
// Without it, emails are written to the log so the OTP flows still work locally.
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport: Transporter | null;
  private readonly from: string;

  constructor(config: ConfigService<Env, true>) {
    const smtpUrl = config.get("SMTP_URL", { infer: true });
    this.transport = smtpUrl ? createTransport(smtpUrl) : null;
    this.from = config.get("MAIL_FROM", { infer: true });
  }

  async send(to: string, subject: string, text: string) {
    if (!this.transport) {
      this.logger.log(`to=${to} subject="${subject}"\n${text}`);
      return;
    }
    try {
      await this.transport.sendMail({ from: this.from, to, subject, text });
    } catch (error) {
      // A mail outage shouldn't fail the request that triggered it; the user can ask for a resend.
      this.logger.error(`Failed to send "${subject}" to ${to}: ${(error as Error).message}`);
    }
  }

  sendCode(to: string, code: string, purpose: "verify" | "reset" | "admin" | "login") {
    const subject = {
      verify: "Verify your VÔL account",
      reset: "Reset your VÔL password",
      admin: "Your VÔL admin sign-in code",
      login: "Your VÔL sign-in code",
    }[purpose];
    return this.send(to, subject, `Your code is ${code}. It expires in 10 minutes.`);
  }
}
