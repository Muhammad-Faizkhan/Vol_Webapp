import { BadRequestException, ForbiddenException, Injectable, NotFoundException, PayloadTooLargeException } from "@nestjs/common";
import type { Prisma } from "../generated/prisma/client.js";
import { paged, skipTake, type PageQuery } from "../common/pagination.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { SettingsService } from "../settings/settings.service.js";
import { WorkspacesService } from "../workspaces/workspaces.service.js";
import type { CreateCanvasDto, ListCanvasesQuery, UpdateCanvasDto } from "./dto/canvases.dto.js";

const REVISION_EVERY_MS = 5 * 60 * 1000;
const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;

const cardInclude = {
  workspace: { select: { id: true, name: true, _count: { select: { members: true } } } },
  createdBy: { select: userSummarySelect },
  _count: { select: { products: true } },
} satisfies Prisma.CanvasInclude;

type CardRow = Prisma.CanvasGetPayload<{ include: typeof cardInclude }>;

export const toCanvasCard = (c: CardRow) => ({
  id: c.id,
  title: c.title,
  thumbnailUrl: c.thumbnailUrl,
  visibility: c.visibility,
  folderId: c.folderId,
  workspace: { id: c.workspace.id, name: c.workspace.name },
  collaboratorCount: c.workspace._count.members,
  productCount: c._count.products,
  createdBy: toUserSummary(c.createdBy),
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
});

@Injectable()
export class CanvasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaces: WorkspacesService,
    private readonly settings: SettingsService,
  ) {}

  async listInWorkspace(workspaceId: string, userId: string, query: ListCanvasesQuery) {
    const role = await this.workspaces.require(workspaceId, userId, "PUBLIC_READ");
    const where: Prisma.CanvasWhereInput = {
      workspaceId,
      deletedAt: null,
      ...(role ? {} : { visibility: "PUBLIC" }),
      ...(query.folderId ? { folderId: query.folderId } : {}),
      ...(query.q ? { title: { contains: query.q, mode: "insensitive" } } : {}),
    };
    return this.page(where, query);
  }

  /** Canvases across every workspace the user belongs to, newest first (Home, select-canvas). */
  async recent(userId: string, query: ListCanvasesQuery) {
    const where: Prisma.CanvasWhereInput = {
      deletedAt: null,
      workspace: { deletedAt: null, members: { some: { userId } } },
      ...(query.q ? { title: { contains: query.q, mode: "insensitive" } } : {}),
    };
    return this.page(where, query);
  }

  async listPublic(query: ListCanvasesQuery, authorId?: string) {
    const where: Prisma.CanvasWhereInput = {
      deletedAt: null,
      visibility: "PUBLIC",
      workspace: { deletedAt: null },
      ...(authorId ? { createdById: authorId } : {}),
      ...(query.q ? { title: { contains: query.q, mode: "insensitive" } } : {}),
    };
    return this.page(where, query);
  }

  private async page(where: Prisma.CanvasWhereInput, query: ListCanvasesQuery) {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.canvas.findMany({
        where,
        include: cardInclude,
        orderBy: query.sort === "name" ? { title: "asc" } : { updatedAt: "desc" },
        ...skipTake(query),
      }),
      this.prisma.canvas.count({ where }),
    ]);
    return paged(rows.map(toCanvasCard), total, query);
  }

  async create(userId: string, dto: CreateCanvasDto) {
    const workspaceId = dto.workspaceId ?? (await this.defaultWorkspace(userId));
    await this.workspaces.require(workspaceId, userId, "COLLABORATOR");
    if (dto.folderId) await this.checkFolder(workspaceId, dto.folderId);
    const canvas = await this.prisma.canvas.create({
      data: {
        workspaceId,
        title: dto.title ?? "Untitled canvas",
        folderId: dto.folderId,
        visibility: dto.visibility,
        createdById: userId,
        data: { objects: [] },
      },
      include: cardInclude,
    });
    await this.workspaces.logActivity(workspaceId, userId, `created the canvas "${canvas.title}"`);
    return toCanvasCard(canvas);
  }

  /** The workspace a canvas lands in when "Create Canvas" is pressed outside any workspace. */
  private async defaultWorkspace(userId: string) {
    const recent = await this.prisma.workspace.findFirst({
      where: { deletedAt: null, members: { some: { userId, role: { in: ["OWNER", "ADMIN", "COLLABORATOR"] } } } },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    if (recent) return recent.id;
    const created = await this.workspaces.create(userId, { name: "My Workspace" });
    return created.id;
  }

  private async checkFolder(workspaceId: string, folderId: string) {
    const folder = await this.prisma.canvasFolder.findFirst({ where: { id: folderId, workspaceId } });
    if (!folder) throw new BadRequestException("Folder not found in this workspace");
  }

  /** Loads a canvas the caller may view. Public canvases are viewable by anyone signed in. */
  private async access(canvasId: string, userId: string) {
    const canvas = await this.prisma.canvas.findFirst({
      where: { id: canvasId, deletedAt: null, workspace: { deletedAt: null } },
      select: { id: true, workspaceId: true, visibility: true, title: true },
    });
    if (!canvas) throw new NotFoundException("Canvas not found");
    const { role } = await this.workspaces.roleIn(canvas.workspaceId, userId);
    if (!role && canvas.visibility !== "PUBLIC") throw new NotFoundException("Canvas not found");
    return { canvas, role, canEdit: !!role && role !== "VIEWER" };
  }

  async detail(canvasId: string, userId: string) {
    const { role, canEdit } = await this.access(canvasId, userId);
    const canvas = await this.prisma.canvas.findUniqueOrThrow({
      where: { id: canvasId },
      include: {
        ...cardInclude,
        products: {
          orderBy: { createdAt: "asc" },
          include: { product: { include: { business: { select: userSummarySelect } } } },
        },
      },
    });
    return {
      ...toCanvasCard(canvas),
      data: canvas.data,
      myRole: role,
      canEdit,
      autosaveSeconds: await this.settings.number("canvas.autosaveSeconds"),
      products: canvas.products.map((p) => ({
        id: p.product.id,
        name: p.product.name,
        brand: p.product.brand,
        image: p.product.images[0] ?? null,
        business: toUserSummary(p.product.business),
      })),
    };
  }

  async update(canvasId: string, userId: string, dto: UpdateCanvasDto) {
    const { canvas, canEdit } = await this.access(canvasId, userId);
    if (!canEdit) throw new ForbiddenException("You can only view this canvas");
    if (dto.folderId) await this.checkFolder(canvas.workspaceId, dto.folderId);
    const updated = await this.prisma.canvas.update({ where: { id: canvasId }, data: dto, include: cardInclude });
    if (dto.title && dto.title !== canvas.title) {
      await this.workspaces.logActivity(canvas.workspaceId, userId, `renamed "${canvas.title}" to "${dto.title}"`);
    }
    return toCanvasCard(updated);
  }

  /** Saves the editor document. A revision snapshot is kept at most every few minutes. */
  async save(canvasId: string, userId: string, data: Record<string, unknown>) {
    const { canvas, canEdit } = await this.access(canvasId, userId);
    if (!canEdit) throw new ForbiddenException("You can only view this canvas");
    const objects = data.objects;
    if (!Array.isArray(objects)) throw new BadRequestException("data.objects must be an array");
    const maxObjects = await this.settings.number("canvas.maxObjects");
    if (objects.length > maxObjects) throw new BadRequestException(`Canvases can hold up to ${maxObjects} objects`);
    if (JSON.stringify(data).length > MAX_DOCUMENT_BYTES) throw new PayloadTooLargeException("Canvas is too large to save");

    const json = data as Prisma.InputJsonObject;
    const updated = await this.prisma.canvas.update({ where: { id: canvasId }, data: { data: json } });

    const last = await this.prisma.canvasRevision.findFirst({ where: { canvasId }, orderBy: { createdAt: "desc" } });
    if (!last || Date.now() - last.createdAt.getTime() > REVISION_EVERY_MS) {
      await this.prisma.canvasRevision.create({ data: { canvasId, data: json, authorId: userId } });
      const keep = await this.settings.number("data.canvasRevisionHistory");
      const stale = await this.prisma.canvasRevision.findMany({
        where: { canvasId },
        orderBy: { createdAt: "desc" },
        skip: keep,
        select: { id: true },
      });
      if (stale.length) await this.prisma.canvasRevision.deleteMany({ where: { id: { in: stale.map((r) => r.id) } } });
      await this.workspaces.logActivity(canvas.workspaceId, userId, `edited "${canvas.title}"`);
    }
    return { savedAt: updated.updatedAt };
  }

  async revisions(canvasId: string, userId: string, query: PageQuery) {
    await this.access(canvasId, userId);
    const where = { canvasId };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.canvasRevision.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { author: { select: userSummarySelect } },
        ...skipTake(query),
      }),
      this.prisma.canvasRevision.count({ where }),
    ]);
    return paged(rows.map((r) => ({ id: r.id, author: toUserSummary(r.author), createdAt: r.createdAt })), total, query);
  }

  async remove(canvasId: string, userId: string) {
    const { canvas, role } = await this.access(canvasId, userId);
    const own = await this.prisma.canvas.count({ where: { id: canvasId, createdById: userId } });
    if (!role || (!own && role !== "ADMIN" && role !== "OWNER")) {
      throw new ForbiddenException("Only the canvas creator or a workspace admin can delete it");
    }
    await this.prisma.canvas.update({ where: { id: canvasId }, data: { deletedAt: new Date() } });
    await this.workspaces.logActivity(canvas.workspaceId, userId, `deleted the canvas "${canvas.title}"`);
  }

  async addProduct(canvasId: string, userId: string, productId: string) {
    const { canvas, canEdit } = await this.access(canvasId, userId);
    if (!canEdit) throw new ForbiddenException("You can only view this canvas");
    const product = await this.prisma.product.findFirst({ where: { id: productId, status: "PUBLISHED" } });
    if (!product) throw new NotFoundException("Product not found");
    await this.prisma.canvasProduct.upsert({
      where: { canvasId_productId: { canvasId, productId } },
      create: { canvasId, productId, addedById: userId },
      update: {},
    });
    await this.workspaces.logActivity(canvas.workspaceId, userId, `added ${product.name} to "${canvas.title}"`);
    return this.detail(canvasId, userId);
  }

  async removeProduct(canvasId: string, userId: string, productId: string) {
    const { canEdit } = await this.access(canvasId, userId);
    if (!canEdit) throw new ForbiddenException("You can only view this canvas");
    await this.prisma.canvasProduct.deleteMany({ where: { canvasId, productId } });
  }
}
