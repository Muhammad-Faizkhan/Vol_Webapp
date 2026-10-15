import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import { AccountType } from "../../generated/prisma/enums.js";

const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim().toLowerCase() : value;

export class EmailDto {
  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(254)
  email: string;
}

export class CredentialsDto extends EmailDto {
  @IsString()
  @MaxLength(128)
  password: string;
}

/** `password` is only used while the API shows codes on screen (SHOW_SIGNUP_CODE); see AuthService.adminLogin. */
export class AdminLoginDto extends EmailDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  password?: string;
}

// The admin-configurable minimum (security.minPasswordLength) is checked in AuthService.
export class SignupDto extends EmailDto {
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  /** The persona picked before signing up ("Individual" or "Business" card), if any. */
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;
}

export class VerifyCodeDto extends EmailDto {
  @Matches(/^\d{6}$/, { message: "code must be 6 digits" })
  code: string;
}

export class ResetPasswordDto {
  @IsString()
  @Length(1, 2048)
  resetToken: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @MaxLength(128)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}
