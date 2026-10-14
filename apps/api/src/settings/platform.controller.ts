import { Controller, Get } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator.js";
import { SettingsService } from "./settings.service.js";

/** Public platform details the apps show (About, Help & Feedback). */
@Controller("platform")
export class PlatformController {
  constructor(private readonly settings: SettingsService) {}

  @Public()
  @Get()
  async info() {
    return {
      name: await this.settings.string("platform.name"),
      supportEmail: await this.settings.string("platform.supportEmail"),
      domain: await this.settings.string("platform.domain"),
      selfServiceDeletion: await this.settings.bool("users.selfServiceDeletion"),
    };
  }
}
