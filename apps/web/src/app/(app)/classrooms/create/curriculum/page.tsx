"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { errorMessage, type ClassroomDetail, type ClassroomModule } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { lessonBody, LessonForm, LessonRow, type LessonInput } from "@/components/classrooms/Curriculum";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Stepper } from "@/components/ui/Stepper";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

export default function CurriculumBuilderPage() {
  return (
    <Suspense fallback={null}>
      <CurriculumBuilder />
    </Suspense>
  );
}

function CurriculumBuilder() {
  const id = useSearchParams().get("id");
  const toast = useToast();
  const key = id ? `/classrooms/${id}` : null;
  const { data: classroom, error, mutate } = useApiQuery<ClassroomDetail>(key);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState<string | null>(null);

  if (!id) return <EmptyState title="Start with the course identity" action={{ label: "Create a classroom", href: "/classrooms/create" }} />;
  if (error) return <ErrorState error={error} />;
  if (!classroom) return null;

  /** Every curriculum endpoint returns the updated classroom; use it directly. */
  async function run(action: () => Promise<ClassroomDetail>, done?: string) {
    try {
      await mutate(await action(), { revalidate: false });
      if (done) toast(done);
    } catch (err) {
      toast(errorMessage(err), "error");
      throw err;
    }
  }

  const isOpen = (m: ClassroomModule) => open[m.id] ?? true;

  async function addLesson(moduleId: string, lesson: LessonInput) {
    await run(() => api.post<ClassroomDetail>(`/modules/${moduleId}/lessons`, lessonBody(lesson)), "Lesson added");
    setAdding(null);
  }

  async function renameModule(m: ClassroomModule) {
    const title = window.prompt("Module title", m.title)?.trim();
    if (title && title !== m.title) await run(() => api.patch<ClassroomDetail>(`/modules/${m.id}`, { title })).catch(() => {});
  }

  async function moveModule(m: ClassroomModule, by: -1 | 1) {
    await run(() => api.patch<ClassroomDetail>(`/modules/${m.id}`, { position: m.position + by })).catch(() => {});
  }

  async function deleteModule(m: ClassroomModule) {
    if (!window.confirm(`Delete "${m.title}" and its ${m.lessons.length} lessons?`)) return;
    await run(() => api.del<ClassroomDetail>(`/modules/${m.id}`), "Module deleted").catch(() => {});
  }

  return (
    <div className="flex w-full max-w-[929px] flex-col gap-6">
      <Link href={`/classrooms/create?id=${id}`} className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">Curriculum Builder</h1>
        <p className="text-base text-[#4f626e] dark:text-dak-body">
          Arrange your syllabus into modules and lessons. Link Engineering Canvases to interactive lessons to provide students with hands-on drafting tools.
        </p>
      </div>

      <Stepper steps={["Identity", "Curriculum", "Publish"]} currentStep={1} />

      <div className="flex flex-col gap-6">
        {classroom.modules.length === 0 && <p className="text-sm text-[#4f626e] dark:text-dak-body">No modules yet — add the first one below.</p>}
        {classroom.modules.map((m, index) => (
          <div key={m.id} className="overflow-hidden rounded-lg border border-light-border shadow-sm dark:border-[rgba(244,244,246,0.15)]">
            <div className="flex w-full items-center justify-between gap-4 border-b border-[rgba(198,198,205,0.4)] bg-[#f8f9ff] px-4 py-4 dark:border-[rgba(43,43,49,0.6)] dark:bg-dak-border">
              <button type="button" onClick={() => setOpen({ ...open, [m.id]: !isOpen(m) })} className="flex min-w-0 flex-1 flex-col gap-1 text-left">
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#4f626e] dark:text-dak-body">Module {m.position}</span>
                <span className="truncate text-xl font-semibold text-auth-navy dark:text-dak-heading sm:text-2xl">{m.title}</span>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => moveModule(m, -1)} className="rounded px-2 py-1 text-auth-navy disabled:opacity-30 dark:text-dak-heading">
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={index === classroom.modules.length - 1}
                  onClick={() => moveModule(m, 1)}
                  className="rounded px-2 py-1 text-auth-navy disabled:opacity-30 dark:text-dak-heading"
                >
                  ↓
                </button>
                <button type="button" onClick={() => renameModule(m)} className="rounded px-2 py-1 text-sm text-auth-navy dark:text-dak-heading">
                  Rename
                </button>
                <button type="button" onClick={() => deleteModule(m)} className="rounded px-2 py-1 text-sm text-red-500">
                  Delete
                </button>
                <button type="button" aria-label={isOpen(m) ? "Collapse" : "Expand"} onClick={() => setOpen({ ...open, [m.id]: !isOpen(m) })} className="px-2 py-1">
                  <Image src="/icons/chevron-down-small.svg" alt="" width={12} height={12} className={`dark:invert ${isOpen(m) ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
            {isOpen(m) && (
              <div className="flex flex-col gap-3 bg-white p-4 dark:bg-dak-surface">
                {m.lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    onDelete={() => {
                      if (window.confirm(`Delete "${lesson.title}"?`)) void run(() => api.del<ClassroomDetail>(`/lessons/${lesson.id}`)).catch(() => {});
                    }}
                  />
                ))}
                {adding === m.id ? (
                  <LessonForm onSubmit={(l) => addLesson(m.id, l)} onCancel={() => setAdding(null)} />
                ) : (
                  <button
                    type="button"
                    onClick={() => setAdding(m.id)}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded border border-dashed border-[#4f626e] text-sm font-medium text-auth-navy dark:border-dak-heading dark:text-dak-heading"
                  >
                    <Image src="/icons/plus-small.svg" alt="" width={11} height={11} className="dark:invert" />
                    Add Lesson
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        <Link
          href={`/classrooms/create/module?id=${id}`}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#dcdcdc] px-6 py-6 text-xl font-semibold text-auth-navy shadow-sm dark:bg-dak-border dark:text-dak-heading"
        >
          <Image src="/icons/plus-small.svg" alt="" width={23} height={23} className="dark:invert" />
          Add Module
        </Link>
      </div>

      <div className="flex items-center justify-between border-t border-light-border pt-6 dark:border-[rgba(43,43,49,0.6)]">
        <Link href="/classrooms/manage" className="rounded border border-[#4f626e] px-8 py-4 text-center text-base font-medium text-auth-navy dark:border-dak-body dark:text-dak-body">
          Save &amp; exit
        </Link>
        <Link href={`/classrooms/create/review?id=${id}`} className="rounded bg-dak-cta px-8 py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]">
          Review &amp; Publish
        </Link>
      </div>
    </div>
  );
}
