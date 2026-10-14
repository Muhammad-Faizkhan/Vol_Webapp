import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Visibility, WorkspaceRole } from "../../generated/prisma/enums.js";
import { PageQuery } from "../../common/pagination.js";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const emptyToNull = ({ value }: { value: unknown }) => (value === "" ? null : value);

export class CreateWorkspaceDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(120) name: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsString() @MaxLength(120) industry?: string;
  @IsOptional() @Transform(emptyToNull) @IsUrl({ require_tld: false }) @MaxLength(2048) imageUrl?: string | null;
  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
}

export class UpdateWorkspaceDto {
  @IsOptional() @Transform(trim) @IsString() @MinLength(1) @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsString() @MaxLength(120) industry?: string;
  @IsOptional() @Transform(emptyToNull) @IsUrl({ require_tld: false }) @MaxLength(2048) imageUrl?: string | null;
  @IsOptional() @IsEnum(Visibility) visibility?: Visibility;
}

export class ListWorkspacesQuery extends PageQuery {
  /** mine: workspaces I own or joined from individuals; business: ones shared with me by businesses. */
  @IsOptional() @IsIn(["mine", "business", "all"]) scope: "mine" | "business" | "all" = "all";
  @IsOptional() @IsIn(["recent", "name"]) sort: "recent" | "name" = "recent";
}

const ASSIGNABLE = [WorkspaceRole.ADMIN, WorkspaceRole.COLLABORATOR, WorkspaceRole.VIEWER];

export class InviteEntryDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  @IsEmail()
  email: string;

  @IsIn(ASSIGNABLE) role: WorkspaceRole;
}

export class InviteMembersDto {
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => InviteEntryDto)
  invites: InviteEntryDto[];
}

export class ChangeRoleDto {
  @IsIn(ASSIGNABLE) role: WorkspaceRole;
}

export class InviteLinkDto {
  @IsOptional() @IsIn([WorkspaceRole.COLLABORATOR, WorkspaceRole.VIEWER]) role?: WorkspaceRole;
}

export class FolderDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(80) name: string;
}
