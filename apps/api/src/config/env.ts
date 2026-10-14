// Validates process.env once at boot so a missing secret fails fast instead of at first request.

export type Env = {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  DATABASE_URL: string;
  /** Max open database connections. Set 1 for `prisma dev`, which serves one connection at a time. */
  DATABASE_POOL_MAX?: number;
  JWT_ACCESS_SECRET: string;
  CODE_PEPPER: string;
  CORS_ORIGINS: string[];
  /** Public base URL of this API; uploaded files are served from `${API_PUBLIC_URL}/uploads/...`. */
  API_PUBLIC_URL: string;
  /** Base URL of the user app, for links in emails and invite links. */
  WEB_URL: string;
  UPLOAD_DIR: string;
  /** e.g. smtps://user:pass@smtp.example.com:465. Unset: emails are logged instead of sent. */
  SMTP_URL?: string;
  MAIL_FROM: string;
};

export function validateEnv(raw: Record<string, unknown>): Env {
  const missing: string[] = [];
  const str = (key: string, fallback?: string) => {
    const value = raw[key];
    if (typeof value === "string" && value.length > 0) return value;
    if (fallback !== undefined) return fallback;
    missing.push(key);
    return "";
  };

  const nodeEnv = str("NODE_ENV", "development");
  const port = Number(str("PORT", "4000"));
  const env: Env = {
    NODE_ENV: nodeEnv === "production" || nodeEnv === "test" ? nodeEnv : "development",
    PORT: port,
    DATABASE_URL: str("DATABASE_URL"),
    DATABASE_POOL_MAX: Number(str("DATABASE_POOL_MAX", "")) || undefined,
    JWT_ACCESS_SECRET: str("JWT_ACCESS_SECRET"),
    CODE_PEPPER: str("CODE_PEPPER"),
    CORS_ORIGINS: str("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    API_PUBLIC_URL: str("API_PUBLIC_URL", `http://localhost:${port}`).replace(/\/$/, ""),
    WEB_URL: str("WEB_URL", "http://localhost:3000").replace(/\/$/, ""),
    UPLOAD_DIR: str("UPLOAD_DIR", "uploads"),
    SMTP_URL: str("SMTP_URL", "") || undefined,
    MAIL_FROM: str("MAIL_FROM", "VÔL <no-reply@vol.design>"),
  };

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
  if (env.NODE_ENV === "production" && (env.JWT_ACCESS_SECRET.length < 32 || env.CODE_PEPPER.length < 32)) {
    throw new Error("JWT_ACCESS_SECRET and CODE_PEPPER must be at least 32 characters in production");
  }
  return env;
}
