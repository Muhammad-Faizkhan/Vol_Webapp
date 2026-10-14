import { randomInt } from "node:crypto";
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "../generated/prisma/client.js";
import { paged, skipTake } from "../common/pagination.js";
import { toUserSummary, userSummarySelect } from "../common/user-summary.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { SettingsService } from "../settings/settings.service.js";
import type {
  CreateClassroomDto,
  LessonDto,
  ListClassroomsQuery,
  ModuleDto,
  UpdateClassroomDto,
  UpdateLessonDto,
  UpdateModuleDto,
} from "./dto/classrooms.dto.js";

// No 0/O or 1/I so codes read unambiguously when shared verbally.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const cardInclude = {
  instructor: { select: userSummarySelect },
  _count: { select: { modules: true, enrollments: { where: { status: "ACTIVE" } } } },
  modules: { select: { lessons: { select: { id: true } } } },
} satisfies Prisma.ClassroomInclude;

type CardRow = Prisma.ClassroomGetPayload<{ include: typeof cardInclude }>;

@Injectable()
export class ClassroomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SettingsService,
    private readonly notifications: NotificationsService,
  ) {}

  // ─── Listing ───────────────────────────────────────────────────────────────

  async list(userId: string, query: ListClassroomsQuery) {
    const base: Prisma.ClassroomWhereInput = {
      deletedAt: null,
      ...(query.q ? { title: { contains: query.q, mode: "insensitive" } } : {}),
    };
    const where: Prisma.ClassroomWhereInput =
      query.scope === "teaching"
        ? { ...base, instructorId: userId, status: { not: "ARCHIVED" } }
        : query.scope === "explore"
          ? { ...base, status: "PUBLISHED", visibility: "PUBLIC", ...(query.instructorId ? { instructorId: query.instructorId } : {}) }
          : { ...base, status: "PUBLISHED", enrollments: { some: { userId, status: "ACTIVE" } } };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.classroom.findMany({ where, include: cardInclude, orderBy: { updatedAt: "desc" }, ...skipTake(query) }),
      this.prisma.classroom.count({ where }),
    ]);
    let items = await this.withProgress(rows.map(toCard), userId);
    // "Active" = started but not finished; filtered after progress is known.
    if (query.scope === "active") items = items.filter((c) => c.progress !== null && c.progress < 100);
    return paged(items, query.scope === "active" ? items.length : total, query);
  }

  /** Adds the caller's progress (completed / total lessons) and current module to each card. */
  private async withProgress<T extends { id: string; lessonIds: string[] }>(cards: T[], userId: string) {
    const allLessonIds = cards.flatMap((c) => c.lessonIds);
    const [completed, enrollments] = await this.prisma.$transaction([
      this.prisma.lessonCompletion.findMany({ where: { userId, lessonId: { in: allLessonIds } }, select: { lessonId: true } }),
      this.prisma.classroomEnrollment.findMany({
        where: { userId, classroomId: { in: cards.map((c) => c.id) } },
        select: { classroomId: true },
      }),
    ]);
    const done = new Set(completed.map((c) => c.lessonId));
    const enrolled = new Set(enrollments.map((e) => e.classroomId));
    return cards.map(({ lessonIds, ...card }) => {
      const finished = lessonIds.filter((id) => done.has(id)).length;
      return {
        ...card,
        lessonCount: lessonIds.length,
        completedLessons: finished,
        progress: enrolled.has(card.id) ? (lessonIds.length ? Math.round((finished / lessonIds.length) * 100) : 0) : null,
      };
    });
  }

  // ─── Classroom CRUD ────────────────────────────────────────────────────────

  async create(userId: string, dto: CreateClassroomDto) {
    if ((await this.settings.string("classrooms.whoCanCreate")) === "Business only") {
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
      if (user.accountType !== "BUSINESS") throw new ForbiddenException("Only business accounts can create classrooms");
    }
    const classroom = await this.prisma.classroom.create({
      data: { ...dto, instructorId: userId, joinCode: await this.uniqueCode() },
    });
    return this.detail(classroom.id, userId);
  }

  private async uniqueCode() {
    for (;;) {
      const code = Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
      if (!(await this.prisma.classroom.findUnique({ where: { joinCode: code } }))) return code;
    }
  }

  private async load(classroomId: string) {
    const classroom = await this.prisma.classroom.findFirst({ where: { id: classroomId, deletedAt: null } });
    if (!classroom) throw new NotFoundException("Classroom not found");
    return classroom;
  }

  private async requireInstructor(classroomId: string, userId: string) {
    const classroom = await this.load(classroomId);
    if (classroom.instructorId !== userId) throw new ForbiddenException("Only the instructor can change this classroom");
    return classroom;
  }

  /** Instructor, enrolled student, or (for published public classrooms) anyone — as a preview. */
  async access(classroomId: string, userId: string) {
    const classroom = await this.load(classroomId);
    const isInstructor = classroom.instructorId === userId;
    const enrollment = await this.prisma.classroomEnrollment.findUnique({
      where: { classroomId_userId: { classroomId, userId } },
    });
    const isEnrolled = enrollment?.status === "ACTIVE";
    const canPreview = classroom.status === "PUBLISHED" && classroom.visibility === "PUBLIC";
    if (!isInstructor && !isEnrolled && !canPreview) throw new NotFoundException("Classroom not found");
    return { classroom, isInstructor, isEnrolled };
  }

  async detail(classroomId: string, userId: string) {
    const { isInstructor, isEnrolled } = await this.access(classroomId, userId);
    const classroom = await this.prisma.classroom.findUniqueOrThrow({
      where: { id: classroomId },
      include: {
        ...cardInclude,
        modules: {
          orderBy: { position: "asc" },
          include: {
            lessons: {
              orderBy: { position: "asc" },
              include: { canvas: { select: { id: true, title: true, thumbnailUrl: true } } },
            },
          },
        },
        _count: { select: { ...cardInclude._count.select, posts: { where: { deletedAt: null } } } },
      },
    });
    const lessonIds = classroom.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const completed = new Set(
      (
        await this.prisma.lessonCompletion.findMany({ where: { userId, lessonId: { in: lessonIds } }, select: { lessonId: true } })
      ).map((c) => c.lessonId),
    );
    const member = isInstructor || isEnrolled;
    const currentModule = classroom.modules.find((m) => m.lessons.some((l) => !completed.has(l.id)));

    return {
      ...toCard({ ...classroom, modules: classroom.modules }),
      lessonIds: undefined,
      description: classroom.description,
      targetAudience: classroom.targetAudience,
      durationLabel: classroom.durationLabel,
      status: classroom.status,
      joinCode: member ? classroom.joinCode : null,
      isInstructor,
      isEnrolled,
      discussionCount: classroom._count.posts,
      lessonCount: lessonIds.length,
      completedLessons: completed.size,
      progress: isEnrolled ? (lessonIds.length ? Math.round((completed.size / lessonIds.length) * 100) : 0) : null,
      currentModuleId: isEnrolled ? (currentModule?.id ?? null) : null,
      modules: classroom.modules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        position: m.position,
        durationMinutes: m.durationMinutes,
        lessons: m.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          kind: l.kind,
          position: l.position,
          durationMinutes: l.durationMinutes,
          // Lesson content is for members only; previewers see the outline.
          body: member ? l.body : null,
          resourceUrl: member ? l.resourceUrl : null,
          canvas: member ? l.canvas : null,
          completed: completed.has(l.id),
        })),
      })),
    };
  }

  async update(classroomId: string, userId: string, dto: UpdateClassroomDto) {
    await this.requireInstructor(classroomId, userId);
    await this.prisma.classroom.update({ where: { id: classroomId }, data: dto });
    return this.detail(classroomId, userId);
  }

  async publish(classroomId: string, userId: string) {
    const classroom = await this.requireInstructor(classroomId, userId);
    const lessons = await this.prisma.lesson.count({ where: { module: { classroomId } } });
    if (!lessons) throw new BadRequestException("Add at least one module with a lesson before publishing");
    await this.prisma.classroom.update({
      where: { id: classroomId },
      data: { status: "PUBLISHED", publishedAt: classroom.publishedAt ?? new Date() },
    });
    return this.detail(classroomId, userId);
  }

  async archive(classroomId: string, userId: string) {
    await this.requireInstructor(classroomId, userId);
    await this.prisma.classroom.update({ where: { id: classroomId }, data: { status: "ARCHIVED" } });
  }

  async remove(classroomId: string, userId: string) {
    await this.requireInstructor(classroomId, userId);
    await this.prisma.classroom.update({ where: { id: classroomId }, data: { deletedAt: new Date() } });
  }

  // ─── Curriculum ────────────────────────────────────────────────────────────

  async addModule(classroomId: string, userId: string, dto: ModuleDto) {
    await this.requireInstructor(classroomId, userId);
    const count = await this.prisma.classroomModule.count({ where: { classroomId } });
    const position = Math.min(dto.position ?? count + 1, count + 1);
    await this.prisma.$transaction([
      this.prisma.classroomModule.updateMany({ where: { classroomId, position: { gte: position } }, data: { position: { increment: 1 } } }),
      this.prisma.classroomModule.create({ data: { ...dto, classroomId, position } }),
    ]);
    return this.detail(classroomId, userId);
  }

  private async moduleForInstructor(moduleId: string, userId: string) {
    const module = await this.prisma.classroomModule.findUnique({ where: { id: moduleId } });
    if (!module) throw new NotFoundException("Module not found");
    await this.requireInstructor(module.classroomId, userId);
    return module;
  }

  async updateModule(moduleId: string, userId: string, { position, ...dto }: UpdateModuleDto) {
    const module = await this.moduleForInstructor(moduleId, userId);
    await this.prisma.classroomModule.update({ where: { id: moduleId }, data: dto });
    if (position && position !== module.position) {
      const ids = (
        await this.prisma.classroomModule.findMany({ where: { classroomId: module.classroomId }, orderBy: { position: "asc" } })
      ).map((m) => m.id);
      ids.splice(ids.indexOf(moduleId), 1);
      ids.splice(Math.min(position, ids.length + 1) - 1, 0, moduleId);
      await this.reorderModules(module.classroomId, userId, ids);
    }
    return this.detail(module.classroomId, userId);
  }

  async removeModule(moduleId: string, userId: string) {
    const module = await this.moduleForInstructor(moduleId, userId);
    await this.prisma.$transaction([
      this.prisma.classroomModule.delete({ where: { id: moduleId } }),
      this.prisma.classroomModule.updateMany({
        where: { classroomId: module.classroomId, position: { gt: module.position } },
        data: { position: { decrement: 1 } },
      }),
    ]);
    return this.detail(module.classroomId, userId);
  }

  async reorderModules(classroomId: string, userId: string, ids: string[]) {
    await this.requireInstructor(classroomId, userId);
    const existing = await this.prisma.classroomModule.findMany({ where: { classroomId }, select: { id: true } });
    if (existing.length !== ids.length || !existing.every((m) => ids.includes(m.id))) {
      throw new BadRequestException("Send every module id exactly once");
    }
    await this.prisma.$transaction(
      ids.map((id, i) => this.prisma.classroomModule.update({ where: { id }, data: { position: i + 1 } })),
    );
    return this.detail(classroomId, userId);
  }

  async addLesson(moduleId: string, userId: string, dto: LessonDto) {
    const module = await this.moduleForInstructor(moduleId, userId);
    if (dto.canvasId) await this.checkCanvas(dto.canvasId, userId);
    const count = await this.prisma.lesson.count({ where: { moduleId } });
    await this.prisma.lesson.create({ data: { ...dto, moduleId, position: count + 1 } });
    return this.detail(module.classroomId, userId);
  }

  private async lessonForInstructor(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
    if (!lesson) throw new NotFoundException("Lesson not found");
    await this.requireInstructor(lesson.module.classroomId, userId);
    return lesson;
  }

  async updateLesson(lessonId: string, userId: string, dto: UpdateLessonDto) {
    const lesson = await this.lessonForInstructor(lessonId, userId);
    if (dto.canvasId) await this.checkCanvas(dto.canvasId, userId);
    await this.prisma.lesson.update({ where: { id: lessonId }, data: dto });
    return this.detail(lesson.module.classroomId, userId);
  }

  async removeLesson(lessonId: string, userId: string) {
    const lesson = await this.lessonForInstructor(lessonId, userId);
    await this.prisma.$transaction([
      this.prisma.lesson.delete({ where: { id: lessonId } }),
      this.prisma.lesson.updateMany({
        where: { moduleId: lesson.moduleId, position: { gt: lesson.position } },
        data: { position: { decrement: 1 } },
      }),
    ]);
    return this.detail(lesson.module.classroomId, userId);
  }

  /** Linked canvases must be ones the instructor can see. */
  private async checkCanvas(canvasId: string, userId: string) {
    const canvas = await this.prisma.canvas.findFirst({
      where: {
        id: canvasId,
        deletedAt: null,
        OR: [{ visibility: "PUBLIC" }, { workspace: { members: { some: { userId } } } }],
      },
    });
    if (!canvas) throw new BadRequestException("Canvas not found");
  }

  // ─── Enrollment & progress ─────────────────────────────────────────────────

  /** What the join modal shows once all six characters are typed. */
  async previewByCode(code: string) {
    const classroom = await this.prisma.classroom.findFirst({
      where: { joinCode: code.replace(/[^a-z0-9]/gi, "").toUpperCase(), deletedAt: null, status: "PUBLISHED" },
      include: cardInclude,
    });
    if (!classroom) throw new NotFoundException("No classroom found for that code");
    const { lessonIds: _lessonIds, ...card } = toCard(classroom);
    return card;
  }

  async join(code: string, userId: string) {
    const classroom = await this.prisma.classroom.findFirst({
      where: { joinCode: code, deletedAt: null, status: "PUBLISHED" },
      include: { _count: { select: { enrollments: { where: { status: "ACTIVE" } } } } },
    });
    if (!classroom) throw new NotFoundException("No classroom found for that code");
    if (classroom.instructorId === userId) throw new BadRequestException("You're the instructor of this classroom");

    const existing = await this.prisma.classroomEnrollment.findUnique({
      where: { classroomId_userId: { classroomId: classroom.id, userId } },
    });
    if (existing?.status === "ACTIVE") throw new ConflictException("You're already enrolled in this classroom");
    const max = await this.settings.number("classrooms.maxStudents");
    if (classroom._count.enrollments >= max) throw new ForbiddenException("This classroom is full");

    await this.prisma.classroomEnrollment.upsert({
      where: { classroomId_userId: { classroomId: classroom.id, userId } },
      create: { classroomId: classroom.id, userId },
      update: { status: "ACTIVE", enrolledAt: new Date() },
    });
    const student = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: userSummarySelect });
    await this.notifications.notify({
      userId: classroom.instructorId,
      actorId: userId,
      type: "CLASSROOM_ENROLLED",
      title: "Classroom Code Accepted",
      body: `${toUserSummary(student).name} joined ${classroom.title}`,
      data: { classroomId: classroom.id },
    });
    return { classroomId: classroom.id };
  }

  async leave(classroomId: string, userId: string) {
    await this.prisma.classroomEnrollment.updateMany({ where: { classroomId, userId }, data: { status: "INACTIVE" } });
  }

  async students(classroomId: string, userId: string) {
    await this.requireInstructor(classroomId, userId);
    const [enrollments, lessons] = await this.prisma.$transaction([
      this.prisma.classroomEnrollment.findMany({
        where: { classroomId },
        orderBy: { enrolledAt: "asc" },
        include: { user: { select: userSummarySelect } },
      }),
      this.prisma.lesson.findMany({ where: { module: { classroomId } }, select: { id: true } }),
    ]);
    const lessonIds = lessons.map((l) => l.id);
    const completions = await this.prisma.lessonCompletion.groupBy({
      by: ["userId"],
      where: { lessonId: { in: lessonIds } },
      _count: { _all: true },
    });
    const done = new Map(completions.map((c) => [c.userId, c._count._all]));
    return enrollments.map((e) => ({
      ...toUserSummary(e.user),
      status: e.status,
      enrolledAt: e.enrolledAt,
      progress: lessonIds.length ? Math.round(((done.get(e.userId) ?? 0) / lessonIds.length) * 100) : 0,
    }));
  }

  async setLessonComplete(lessonId: string, userId: string, complete: boolean) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
    if (!lesson) throw new NotFoundException("Lesson not found");
    const { isEnrolled } = await this.access(lesson.module.classroomId, userId);
    if (!isEnrolled) throw new ForbiddenException("Join the classroom to track progress");
    if (complete) {
      await this.prisma.lessonCompletion.upsert({
        where: { lessonId_userId: { lessonId, userId } },
        create: { lessonId, userId },
        update: {},
      });
    } else {
      await this.prisma.lessonCompletion.deleteMany({ where: { lessonId, userId } });
    }
    return this.detail(lesson.module.classroomId, userId);
  }
}

function toCard(c: CardRow) {
  return {
    id: c.id,
    title: c.title,
    category: c.category,
    skillLevel: c.skillLevel,
    imageUrl: c.imageUrl,
    visibility: c.visibility,
    status: c.status,
    instructor: toUserSummary(c.instructor),
    moduleCount: c._count.modules,
    enrolledCount: c._count.enrollments,
    lessonIds: c.modules.flatMap((m) => m.lessons.map((l) => l.id)),
    updatedAt: c.updatedAt,
  };
}
