import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { BadRequestException, Injectable, PayloadTooLargeException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../config/env.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { SettingsService } from "../settings/settings.service.js";

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

// Stores files on local disk and serves them from /uploads. To move to S3/R2 later, replace
// `store` with an object-storage put and return that object's public URL; callers only see the URL.
@Injectable()
export class UploadsService {
  private readonly dir: string;
  private readonly publicUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SettingsService,
    config: ConfigService<Env, true>,
  ) {
    this.dir = path.resolve(config.get("UPLOAD_DIR", { infer: true }));
    this.publicUrl = config.get("API_PUBLIC_URL", { infer: true });
  }

  get directory() {
    return this.dir;
  }

  async store(ownerId: string, file: Express.Multer.File) {
    const ext = EXTENSIONS[file.mimetype];
    if (!ext) throw new BadRequestException("Only PNG, JPG, WEBP, GIF, PDF, MP4 and WEBM files are allowed");
    const maxMb = await this.settings.number("data.maxUploadMb");
    if (file.size > maxMb * 1024 * 1024) throw new PayloadTooLargeException(`Files must be ${maxMb}MB or smaller`);

    const key = `${new Date().toISOString().slice(0, 7)}/${randomBytes(16).toString("hex")}.${ext}`;
    await mkdir(path.join(this.dir, path.dirname(key)), { recursive: true });
    await writeFile(path.join(this.dir, key), file.buffer);

    const upload = await this.prisma.upload.create({
      data: {
        ownerId,
        key,
        url: `${this.publicUrl}/uploads/${key}`,
        name: file.originalname.slice(0, 255),
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
    });
    return { id: upload.id, url: upload.url, name: upload.name, mimeType: upload.mimeType, sizeBytes: upload.sizeBytes };
  }
}
