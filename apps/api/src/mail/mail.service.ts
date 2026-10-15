import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, type Transporter } from "nodemailer";
import type { Env } from "../config/env.js";

type Sender = (to: string, subject: string, text: string) => Promise<void>;

// Sends through Brevo's HTTPS API when BREVO_API_KEY is set (works on hosts that block SMTP, like
// Railway's lower plans), else through SMTP when SMTP_URL is set (any provider: Resend, SES, Gmail...).
// With neither, emails are written to the log so the OTP flows still work locally.
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly sender: Sender | null;
  private readonly from: string;

  constructor(config: ConfigService<Env, true>) {
    this.from = config.get("MAIL_FROM", { infer: true });
    const brevoKey = config.get("BREVO_API_KEY", { infer: true });
    const smtpUrl = config.get("SMTP_URL", { infer: true });
    if (brevoKey) this.sender = this.brevo(brevoKey);
    else if (smtpUrl) this.sender = this.smtp(createTransport(smtpUrl));
    else this.sender = null;
  }

  async send(to: string, subject: string, text: string) {
    if (!this.sender) {
      this.logger.log(`to=${to} subject="${subject}"\n${text}`);
      return;
    }
    try {
      await this.sender(to, subject, text);
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

  private smtp(transport: Transporter): Sender {
    return async (to, subject, text) => {
      await transport.sendMail({ from: this.from, to, subject, text });
    };
  }

  private brevo(apiKey: string): Sender {
    // MAIL_FROM is "Name <address>" or a bare address.
    const match = this.from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
    const sender = match ? { name: match[1].replace(/^"|"$/g, "") || undefined, email: match[2] } : { email: this.from.trim() };
    return async (to, subject, text) => {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ sender, to: [{ email: to }], subject, textContent: text }),
      });
      if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
    };
  }
}
