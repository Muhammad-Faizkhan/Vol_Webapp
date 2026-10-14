import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class PageQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}

export const skipTake = ({ page, limit }: PageQuery) => ({ skip: (page - 1) * limit, take: limit });

export const paged = <T>(items: T[], total: number, { page, limit }: PageQuery) => ({
  items,
  total,
  page,
  limit,
  pages: Math.max(1, Math.ceil(total / limit)),
});
