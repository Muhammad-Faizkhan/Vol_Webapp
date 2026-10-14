import { Transform } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { AccountType, Visibility } from "../../generated/prisma/enums.js";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
// Empty strings from untouched form fields mean "no value".
const emptyToNull = ({ value }: { value: unknown }) => (value === "" ? null : value);
const url = { require_tld: false } as const;

export class UpdateAccountDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase().replace(/^@/, "") : value))
  @Matches(/^[a-z0-9_.]{3,30}$/, { message: "username must be 3–30 letters, numbers, dots or underscores" })
  username?: string;

  /** Chosen on the join-network screen; locked once onboarding is complete. */
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;
}

class TagsField {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  tags?: string[];
}

export class UpsertProfileDto extends TagsField {
  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  fullName: string;

  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) avatarUrl?: string | null;
  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) coverUrl?: string | null;
  @IsOptional() @IsString() @MaxLength(1000) bio?: string;
  @IsOptional() @IsString() @MaxLength(120) specialty?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  interests?: string[];

  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) portfolioUrl?: string | null;
  @IsOptional() @IsString() @MaxLength(32) phone?: string;
  @IsOptional() @IsString() @MaxLength(80) country?: string;
  @IsOptional() @IsString() @MaxLength(80) city?: string;
}

/** The network-visibility screen and the notification preferences in Settings. */
export class UpdatePreferencesDto {
  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
  @IsOptional() @IsBoolean() searchIndexing?: boolean;
  @IsOptional() @IsBoolean() emailNotifications?: boolean;
}

export class UpsertBusinessDto {
  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  legalName: string;

  @IsOptional() @Transform(emptyToNull) @IsEmail() @MaxLength(254) contactEmail?: string | null;
  @IsOptional() @IsString() @MaxLength(32) phone?: string;
  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) website?: string | null;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) logoUrl?: string | null;
  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) coverUrl?: string | null;
  @IsOptional() @IsString() @MaxLength(120) specialty?: string;
  @IsOptional() @IsString() @MaxLength(120) industry?: string;
  @IsOptional() @Transform(emptyToNull) @IsUrl(url) @MaxLength(2048) verificationDocUrl?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  categoryTags?: string[];
}

export class DeleteAccountDto {
  @IsString()
  @MaxLength(128)
  password: string;
}
