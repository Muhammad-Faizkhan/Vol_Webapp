import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser, type AuthUser } from "../common/decorators/current-user.decorator.js";
import { UploadsService } from "./uploads.service.js";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  /** multipart/form-data with a single `file` field. Returns the file's public URL. */
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  // Hard ceiling; the admin-configurable limit (data.maxUploadMb) is checked in the service.
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 100 * 1024 * 1024 } }))
  @Post()
  upload(@CurrentUser() user: AuthUser, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException("Attach a file in the `file` field");
    return this.uploads.store(user.id, file);
  }
}
