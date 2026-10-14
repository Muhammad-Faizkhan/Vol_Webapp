import { Transform } from "class-transformer";
import { ArrayMaxSize, IsArray, IsEnum, IsIn, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { Visibility } from "../../generated/prisma/enums.js";
import { PageQuery } from "../../common/pagination.js";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const emptyToNull = ({ value }: { value: unknown }) => (value === "" ? null : value);

export class CreatePostDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(200) title: string;
  @IsString() @MaxLength(20_000) body: string;
  @IsOptional() @IsString() @MaxLength(80) category?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags?: string[];

  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
  @IsOptional() @Transform(emptyToNull) @IsString() canvasId?: string | null;
  @IsOptional() @Transform(emptyToNull) @IsUrl({ require_tld: false }) @MaxLength(2048) imageUrl?: string | null;
}

export class UpdatePostDto {
  @IsOptional() @Transform(trim) @IsString() @MinLength(1) @MaxLength(200) title?: string;
  @IsOptional() @IsString() @MaxLength(20_000) body?: string;
  @IsOptional() @IsString() @MaxLength(80) category?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags?: string[];

  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
  @IsOptional() @Transform(emptyToNull) @IsString() canvasId?: string | null;
  @IsOptional() @Transform(emptyToNull) @IsUrl({ require_tld: false }) @MaxLength(2048) imageUrl?: string | null;
}

export class ListPostsQuery extends PageQuery {
  @IsOptional() @IsIn(["latest", "trending", "following"]) feed: "latest" | "trending" | "following" = "latest";
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() authorId?: string;
  @IsOptional() @IsString() tag?: string;
}

export class CommentDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(5000) body: string;
}
