import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { LessonKind, SkillLevel, Visibility } from "../../generated/prisma/enums.js";
import { PageQuery } from "../../common/pagination.js";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const emptyToNull = ({ value }: { value: unknown }) => (value === "" ? null : value);
const url = { require_tld: false } as const;

export class CreateClassroomDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(160) title: string;
  @IsOptional() @IsString() @MaxLength(5000) description?: string;
  @IsOptional() @IsString() @MaxLength(120) category?: string;
  @IsOptional() @IsEnum(SkillLevel) skillLevel?: SkillLevel;
  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) imageUrl?: string | null;
  @IsOptional() @IsString() @MaxLength(120) targetAudience?: string;
  @IsOptional() @IsString() @MaxLength(120) durationLabel?: string;
  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
}

export class UpdateClassroomDto {
  @IsOptional() @Transform(trim) @IsString() @MinLength(1) @MaxLength(160) title?: string;
  @IsOptional() @IsString() @MaxLength(5000) description?: string;
  @IsOptional() @IsString() @MaxLength(120) category?: string;
  @IsOptional() @IsEnum(SkillLevel) skillLevel?: SkillLevel;
  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) imageUrl?: string | null;
  @IsOptional() @IsString() @MaxLength(120) targetAudience?: string;
  @IsOptional() @IsString() @MaxLength(120) durationLabel?: string;
  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
}

export class ListClassroomsQuery extends PageQuery {
  /** enrolled: classes I joined · teaching: classes I run · active: enrolled and in progress · explore: public */
  @IsOptional() @IsIn(["enrolled", "teaching", "active", "explore"]) scope: "enrolled" | "teaching" | "active" | "explore" = "enrolled";
  @IsOptional() @IsString() instructorId?: string;
}

export class ModuleDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(160) title: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(100_000) durationMinutes?: number;
  /** 1-based position; omitted = append. */
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) position?: number;
}

export class UpdateModuleDto {
  @IsOptional() @Transform(trim) @IsString() @MinLength(1) @MaxLength(160) title?: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(100_000) durationMinutes?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) position?: number;
}

export class LessonDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(160) title: string;
  @IsEnum(LessonKind) kind: LessonKind;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(100_000) durationMinutes?: number;
  @IsOptional() @IsString() @MaxLength(20_000) body?: string;
  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) resourceUrl?: string | null;
  @IsOptional() @Transform(emptyToNull) @IsString() canvasId?: string | null;
}

export class UpdateLessonDto {
  @IsOptional() @Transform(trim) @IsString() @MinLength(1) @MaxLength(160) title?: string;
  @IsOptional() @IsEnum(LessonKind) kind?: LessonKind;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(100_000) durationMinutes?: number;
  @IsOptional() @IsString() @MaxLength(20_000) body?: string;
  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) resourceUrl?: string | null;
  @IsOptional() @Transform(emptyToNull) @IsString() canvasId?: string | null;
}

export class ReorderDto {
  @IsArray() @ArrayMaxSize(500) @IsString({ each: true }) ids: string[];
}

export class JoinClassroomDto {
  @Transform(({ value }) => (typeof value === "string" ? value.replace(/[^a-z0-9]/gi, "").toUpperCase() : value))
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
