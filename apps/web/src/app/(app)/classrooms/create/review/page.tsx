"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { errorMessage, formatMinutes, type ClassroomDetail, type SkillLevel } from "@vol/api-client";
import { useApiQuery, useInvalidate } from "@vol/api-client/react";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Stepper } from "@/components/ui/Stepper";
import { useToast } from "@/components/ui/Toast";
import { UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

const AUDIENCE: Record<SkillLevel, string> = { BEGINNER: "Apprentice / New", INTERMEDIATE: "Practising Trade", ADVANCED: "Senior / Grad" };

export default function ReviewAndPublishPage() {
  return (
    <Suspense fallback={null}>
      <Review />
    </Suspense>
  );
}

function Review() {
  const id = useSearchParams().get("id");
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const { data: c, error } = useApiQuery<ClassroomDetail>(id ? `/classrooms/${id}` : null);
  const [open, setOpen] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  if (!id) return <EmptyState title="Start with the course identity" action={{ label: "Create a classroom", href: "/classrooms/create" }} />;
  if (error) return <ErrorState error={error} />;
  if (!c) return null;

  const totalMinutes = c.modules.reduce((sum, m) => sum + (m.durationMinutes ?? m.lessons.reduce((s, l) => s + (l.durationMinutes ?? 0), 0)), 0);
  const published = c.status === "PUBLISHED";

  async function publish() {
    setPublishing(true);
    try {
      await api.post(`/classrooms/${id}/publish`);
      await invalidate("/classrooms");
      toast(published ? "Classroom updated" : "Course published");
      router.push(`/classrooms/${id}`);
    } catch (err) {
      toast(errorMessage(err), "error");
      setPublishing(false);
    }
  }

  return (
    <div className="flex w-full max-w-[929px] flex-col gap-6">
      <Link href={`/classrooms/create/curriculum?id=${id}`} className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">Review &amp; Publish</h1>
        <p className="text-base text-[#4f626e] dark:text-dak-body">
          Final structural overview before deployment to the student portal. Verify all components and technical requirements.
        </p>
      </div>

      <Stepper steps={["Identity", "Curriculum", "Publish"]} currentStep={2} />

      <div className="flex flex-col gap-6 rounded-lg border border-light-border bg-white p-6 dark:border-0 dark:bg-dak-surface">
        <div className="flex items-center justify-between gap-1 border-b border-light-border pb-4 dark:border-[rgba(43,43,49,0.6)]">
          <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Course Identity</h3>
          <Link href={`/classrooms/create?id=${id}`} className="text-sm font-semibold text-dak-cta">
            Edit
          </Link>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex h-[179px] w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-light-border bg-[#eaeaea] dark:border-[rgba(198,198,205,0.2)] dark:bg-[rgba(244,244,246,0.06)] sm:w-[154px]">
            {c.imageUrl ? <UserImage src={c.imageUrl} /> : <Image src="/icons/image-insert.svg" alt="" width={40} height={40} className="opacity-60 dark:invert" />}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h4 className="text-2xl font-normal text-auth-navy dark:text-dak-heading">{c.title}</h4>
            <p className="whitespace-pre-wrap text-sm text-[#4f626e] dark:text-dak-body">{c.description}</p>
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#4f626e] dark:text-dak-body">Target Audience</span>
                <span className="flex items-center gap-1.5 text-sm text-auth-navy dark:text-dak-heading">
                  <span className="size-2 rounded-full bg-auth-navy dark:bg-white" />
                  {c.targetAudience ?? (c.skillLevel ? AUDIENCE[c.skillLevel] : "Everyone")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#4f626e] dark:text-dak-body">Est. Duration</span>
                <span className="flex items-center gap-1.5 text-sm text-auth-navy dark:text-dak-heading">
                  <Image src="/icons/clock-small.svg" alt="" width={13} height={13} />
                  {c.durationLabel ?? formatMinutes(totalMinutes) ?? "Not set"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#4f626e] dark:text-dak-body">Category</span>
                <span className="text-sm text-auth-navy dark:text-dak-heading">{c.category ?? "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-lg border border-light-border bg-white p-6 dark:border-0 dark:bg-dak-surface">
        <div className="flex items-center justify-between gap-4 border-b border-light-border pb-4 dark:border-[rgba(43,43,49,0.6)]">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-normal text-auth-navy dark:text-dak-heading">Curriculum Topology</h3>
            <p className="text-sm text-[#4f626e] dark:text-dak-body">Structural hierarchy of modules and lessons.</p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">{c.modules.length}</span>
              <span className="text-xs font-semibold uppercase text-[#4f626e] dark:text-dak-body">Modules</span>
            </div>
            <div className="h-8 w-px bg-[rgba(43,43,49,0.4)]" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">{c.lessonCount}</span>
              <span className="text-xs font-semibold uppercase text-[#4f626e] dark:text-dak-body">Lessons</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {c.modules.length === 0 && (
            <p className="text-sm text-red-500">
              Add at least one module with a lesson before publishing.{" "}
              <Link href={`/classrooms/create/curriculum?id=${id}`} className="font-medium underline">
                Build curriculum
              </Link>
            </p>
          )}
          {c.modules.map((m, i) => {
            const isOpen = open === m.id || (open === null && i === 0);
            return (
              <div key={m.id} className="overflow-hidden rounded border border-light-border dark:border-[rgba(244,244,246,0.15)]">
                <button type="button" onClick={() => setOpen(isOpen ? "" : m.id)} className="flex w-full items-center justify-between gap-4 bg-[#f8f9ff] px-4 py-3 text-left dark:bg-dak-border">
                  <div className="flex items-center gap-3">
                    <Image src="/icons/chevron-down-small.svg" alt="" width={12} height={12} className={`dark:invert ${isOpen ? "" : "-rotate-90"}`} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#4f626e] dark:text-dak-body">Module {i + 1}</span>
                      <span className="text-sm font-semibold text-auth-navy dark:text-dak-heading">{m.title}</span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded bg-[#dcdcdc] px-2 py-1 text-xs font-semibold text-auth-navy dark:bg-[#45464d] dark:text-dak-heading">
                    {m.lessons.length} Lessons
                  </span>
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-2 bg-white px-6 py-3 dark:bg-dak-border">
                    {m.lessons.length === 0 && <span className="text-sm italic text-[#4f626e] dark:text-dak-body">No lessons yet</span>}
                    {m.lessons.map((l, j) => (
                      <span key={l.id} className="text-sm text-[#4f626e] dark:text-dak-body">
                        {i + 1}.{j + 1} {l.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={publish}
        disabled={publishing || c.lessonCount === 0}
        className="flex items-center justify-center rounded-lg bg-dak-cta px-8 py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)] disabled:opacity-50"
      >
        {publishing ? "Publishing…" : published ? "Save & View Course" : "Publish Course"}
      </button>
    </div>
  );
}
