import { Transform } from "class-transformer";
import { ArrayMaxSize, IsArray, IsIn, IsNumber, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator";
import { PageQuery } from "../../common/pagination.js";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
// Empty number inputs arrive as "" or null; both mean "not set".
const optionalNumber = ({ value }: { value: unknown }) => (value === "" || value === null ? undefined : Number(value));
const asArray = ({ value }: { value: unknown }) => (value === undefined ? undefined : Array.isArray(value) ? value : [value]);

class ProductFields {
  @IsOptional() @IsString() @MaxLength(120) brand?: string;
  @IsOptional() @IsString() @MaxLength(120) category?: string;
  @IsOptional() @IsString() @MaxLength(120) trade?: string;
  @IsOptional() @IsString() @MaxLength(5000) description?: string;
  @IsOptional() @Transform(optionalNumber) @IsNumber() @Min(0) @Max(1e7) heightMm?: number;
  @IsOptional() @Transform(optionalNumber) @IsNumber() @Min(0) @Max(1e7) widthMm?: number;
  @IsOptional() @Transform(optionalNumber) @IsNumber() @Min(0) @Max(1e7) lengthMm?: number;
  @IsOptional() @Transform(optionalNumber) @IsNumber() @Min(0) @Max(1e7) weightKg?: number;
  @IsOptional() @Transform(optionalNumber) @IsNumber() @Min(0) @Max(1e9) price?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsUrl({ require_tld: false }, { each: true })
  images?: string[];

  @IsOptional() @IsIn(["DRAFT", "PUBLISHED"]) status?: "DRAFT" | "PUBLISHED";
}

export class CreateProductDto extends ProductFields {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(200) name: string;
}

export class UpdateProductDto extends ProductFields {
  @IsOptional() @Transform(trim) @IsString() @MinLength(1) @MaxLength(200) name?: string;
}

export class ListProductsQuery extends PageQuery {
  @IsOptional() @Transform(asArray) @IsArray() @IsString({ each: true }) trade?: string[];
  @IsOptional() @Transform(asArray) @IsArray() @IsString({ each: true }) brand?: string[];
  @IsOptional() @IsString() businessId?: string;
  @IsOptional() @IsIn(["relevance", "newest", "name"]) sort: "relevance" | "newest" | "name" = "relevance";
}

export class MyProductsQuery extends PageQuery {
  @IsOptional() @IsIn(["DRAFT", "PUBLISHED"]) status?: "DRAFT" | "PUBLISHED";
}
