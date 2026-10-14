import { Transform } from "class-transformer";
import { IsEnum, IsIn, IsObject, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { Visibility } from "../../generated/prisma/enums.js";
import { PageQuery } from "../../common/pagination.js";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const emptyToNull = ({ value }: { value: unknown }) => (value === "" ? null : value);

export class CreateCanvasDto {
  /** Omit to create it in the user's most recently used workspace (or a new personal one). */
  @IsOptional() @IsString() workspaceId?: string;
  @IsOptional() @Transform(trim) @IsString() @MinLength(1) @MaxLength(160) title?: string;
  @IsOptional() @IsString() folderId?: string;
  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
}

export class UpdateCanvasDto {
  @IsOptional() @Transform(trim) @IsString() @MinLength(1) @MaxLength(160) title?: string;
  @IsOptional() @Transform(emptyToNull) @IsString() folderId?: string | null;
  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
  @IsOptional() @Transform(emptyToNull) @IsUrl({ require_tld: false }) @MaxLength(2048) thumbnailUrl?: string | null;
}

export class SaveCanvasDto {
  @IsObject() data: Record<string, unknown>;
}

export class ListCanvasesQuery extends PageQuery {
  @IsOptional() @IsString() folderId?: string;
  @IsOptional() @IsIn(["recent", "name"]) sort: "recent" | "name" = "recent";
}

export class AddProductDto {
  @IsString() productId: string;
}
