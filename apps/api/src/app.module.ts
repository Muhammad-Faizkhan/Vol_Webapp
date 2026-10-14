import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AdminModule } from "./admin/admin.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { CanvasesModule } from "./canvases/canvases.module.js";
import { ClassroomsModule } from "./classrooms/classrooms.module.js";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard.js";
import { RolesGuard } from "./common/guards/roles.guard.js";
import { validateEnv, type Env } from "./config/env.js";
import { HealthController } from "./health/health.controller.js";
import { MailModule } from "./mail/mail.module.js";
import { NotificationsModule } from "./notifications/notifications.module.js";
import { PoliciesModule } from "./policies/policies.module.js";
import { PostsModule } from "./posts/posts.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { ProductsModule } from "./products/products.module.js";
import { ReportsModule } from "./reports/reports.module.js";
import { SearchModule } from "./search/search.module.js";
import { SettingsModule } from "./settings/settings.module.js";
import { UploadsModule } from "./uploads/uploads.module.js";
import { UsersModule } from "./users/users.module.js";
import { WorkspacesModule } from "./workspaces/workspaces.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        secret: config.get("JWT_ACCESS_SECRET", { infer: true }),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    PrismaModule,
    SettingsModule,
    MailModule,
    NotificationsModule,
    UploadsModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    CanvasesModule,
    ClassroomsModule,
    PostsModule,
    ProductsModule,
    SearchModule,
    ReportsModule,
    PoliciesModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    // Order matters: rate limit first, then authenticate, then check roles.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
