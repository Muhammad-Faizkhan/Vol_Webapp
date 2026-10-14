import { Global, Module } from "@nestjs/common";
import { PlatformController } from "./platform.controller.js";
import { SettingsService } from "./settings.service.js";

@Global()
@Module({
  controllers: [PlatformController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
