import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "../generated/prisma/client.js";
import { paged, skipTake } from "../common/pagination.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { SettingsService } from "../settings/settings.service.js";
import type { CreateProductDto, ListProductsQuery, MyProductsQuery, UpdateProductDto } from "./dto/products.dto.js";

const include = {
  business: { select: userSummarySelect },
  _count: { select: { canvases: true } },
} satisfies Prisma.ProductInclude;

type Row = Prisma.ProductGetPayload<{ include: typeof include }>;

const num = (d: Prisma.Decimal | null) => (d === null ? null : Number(d));

/** "600x1200x9MM": width × length × height, whichever are set. */
function sizeLabel(p: Row) {
  const dims = [p.widthMm, p.lengthMm, p.heightMm].map(num).filter((d): d is number => d !== null);
  return dims.length ? `${dims.join("x")}MM` : null;
}

function toProduct(p: Row) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    trade: p.trade,
    description: p.description,
    heightMm: num(p.heightMm),
    widthMm: num(p.widthMm),
    lengthMm: num(p.lengthMm),
    weightKg: num(p.weightKg),
    price: num(p.price),
    currency: p.currency,
    images: p.images,
    status: p.status,
    size: sizeLabel(p),
    business: toUserSummary(p.business),
    canvasCount: p._count.canvases,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SettingsService,
  ) {}

  private publicWhere(query: ListProductsQuery): Prisma.ProductWhereInput {
    return {
      status: "PUBLISHED",
      business: { deletedAt: null, status: "ACTIVE" },
      ...(query.businessId ? { businessId: query.businessId } : {}),
      ...(query.trade?.length ? { trade: { in: query.trade } } : {}),
      ...(query.brand?.length ? { brand: { in: query.brand } } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { brand: { contains: query.q, mode: "insensitive" } },
              { description: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
    };
  }

  async list(query: ListProductsQuery) {
    const where = this.publicWhere(query);
    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      query.sort === "name"
        ? [{ name: "asc" }]
        : query.sort === "newest"
          ? [{ createdAt: "desc" }]
          : [{ canvases: { _count: "desc" } }, { createdAt: "desc" }];
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({ where, include, orderBy, ...skipTake(query) }),
      this.prisma.product.count({ where }),
    ]);
    return paged(rows.map(toProduct), total, query);
  }

  /** Filter options for the catalog sidebar, with counts. */
  async facets() {
    const where: Prisma.ProductWhereInput = { status: "PUBLISHED", business: { deletedAt: null, status: "ACTIVE" } };
    const [trades, brands] = await Promise.all([
      this.prisma.product.groupBy({ by: ["trade"], where: { ...where, trade: { not: null } }, _count: { _all: true } }),
      this.prisma.product.groupBy({ by: ["brand"], where: { ...where, brand: { not: null } }, _count: { _all: true } }),
    ]);
    return {
      trades: trades.map((t) => ({ value: t.trade!, count: t._count._all })).sort((a, b) => b.count - a.count),
      brands: brands.map((b) => ({ value: b.brand!, count: b._count._all })).sort((a, b) => b.count - a.count),
    };
  }

  async mine(userId: string, query: MyProductsQuery) {
    const where: Prisma.ProductWhereInput = {
      businessId: userId,
      status: query.status ?? { not: "REMOVED" },
      ...(query.q ? { name: { contains: query.q, mode: "insensitive" } } : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({ where, include, orderBy: { updatedAt: "desc" }, ...skipTake(query) }),
      this.prisma.product.count({ where }),
    ]);
    return paged(rows.map(toProduct), total, query);
  }

  async detail(productId: string, userId: string) {
    const product = await this.prisma.product.findFirst({ where: { id: productId, status: { not: "REMOVED" } }, include });
    if (!product || (product.status !== "PUBLISHED" && product.businessId !== userId)) {
      throw new NotFoundException("Product not found");
    }
    return { ...toProduct(product), isMine: product.businessId === userId };
  }

  async create(userId: string, dto: CreateProductDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { business: true } });
    if (user.accountType !== "BUSINESS" || !user.business) {
      throw new ForbiddenException("Only business accounts can list products");
    }
    const max = await this.settings.number("business.maxCatalogs");
    const count = await this.prisma.product.count({ where: { businessId: userId, status: { not: "REMOVED" } } });
    if (count >= max) throw new ForbiddenException(`Your catalog can hold up to ${max} products`);
    await this.checkRules(dto, user.business.verification);

    const product = await this.prisma.product.create({ data: { ...dto, businessId: userId }, include });
    return toProduct(product);
  }

  async update(productId: string, userId: string, dto: UpdateProductDto) {
    const product = await this.own(productId, userId);
    const business = await this.prisma.businessProfile.findUnique({ where: { userId } });
    await this.checkRules(dto, business?.verification ?? "UNVERIFIED", product.status);
    const updated = await this.prisma.product.update({ where: { id: productId }, data: dto, include });
    return toProduct(updated);
  }

  async remove(productId: string, userId: string) {
    await this.own(productId, userId);
    await this.prisma.product.update({ where: { id: productId }, data: { status: "REMOVED" } });
  }

  private async own(productId: string, userId: string) {
    const product = await this.prisma.product.findFirst({ where: { id: productId, status: { not: "REMOVED" } } });
    if (!product || product.businessId !== userId) throw new NotFoundException("Product not found");
    return product;
  }

  private async checkRules(dto: UpdateProductDto, verification: string, currentStatus?: string) {
    const maxImages = await this.settings.number("catalog.imagesPerProduct");
    if (dto.images && dto.images.length > maxImages) {
      throw new BadRequestException(`Products can have up to ${maxImages} images`);
    }
    const publishing = dto.status === "PUBLISHED" && currentStatus !== "PUBLISHED";
    if (publishing && verification !== "VERIFIED" && !(await this.settings.bool("business.unverifiedMayPublish"))) {
      throw new ForbiddenException("Your business must be verified before publishing products");
    }
  }
}
