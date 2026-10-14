import "reflect-metadata";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module.js";
import type { Env } from "./config/env.js";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  // Behind Vercel/Render/a load balancer, so req.ip is the client's address rather than the proxy's.
  app.set("trust proxy", 1);
  // Canvas documents can be a few MB; everything else is small.
  app.useBodyParser("json", { limit: "5mb" });
  app.useBodyParser("urlencoded", { extended: true, limit: "1mb" });
  app.use(cookieParser());
  app.enableCors({ origin: config.get("CORS_ORIGINS", { infer: true }), credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableShutdownHooks();

  // Uploaded files. Served with a restrictive policy so an uploaded file can't run script on this origin.
  const uploadDir = path.resolve(config.get("UPLOAD_DIR", { infer: true }));
  mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, {
    prefix: "/uploads/",
    maxAge: "30d",
    immutable: true,
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  });

  if (config.get("NODE_ENV", { infer: true }) !== "production") {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle("VÔL API").setVersion("0.1").addBearerAuth().build(),
    );
    SwaggerModule.setup("docs", app, document);
  }

  await app.listen(config.get("PORT", { infer: true }));
}

await bootstrap();
