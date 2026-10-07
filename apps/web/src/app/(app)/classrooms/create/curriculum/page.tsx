"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Stepper } from "@/components/ui/Stepper";

type LessonKind = "video" | "document" | "canvas";

const LESSONS: { title: string; meta: string; kind: LessonKind }[] = [
  { title: "Welcome & Overview", meta: "12 mins", kind: "video" },
  { title: "Syllabus & Core Texts", meta: "PDF attached", kind: "document" },
  {
    title: "Truss Bridge Load Simulation",
    meta: "Canvas Template Linked: 'Standard Truss Setup A'",
    kind: "canvas",
  },
];

const lessonIcon: Record<LessonKind, string> = {
  video: "/icons/play.svg",
  document: "/icons/document.svg",
  canvas: "/icons/new-canvas.svg",
};

export default function CurriculumBuilderPage() {
  const [module1Open, setModule1Open] = useState(true);

  return (
    <div className="flex w-full max-w-[929px] flex-col gap-6">
      <Link
        href="/classrooms/create"
        className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading"
      >
        <Image
          src="/icons/arrow-narrow-right.svg"
          alt=""
          width={20}
          height={20}
          className="-scale-y-100 rotate-180 dark:invert"
        />
        Back
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Curriculum Builder
        </h1>
        <p className="text-base text-[#4f626e] dark:text-dak-body">
          Drag and drop modules and lessons to arrange your syllabus. Link Engineering Canvases to interactive
          lessons to provide students with hands-on drafting tools.
        </p>
      </div>

      <Stepper steps={["Identity", "Curriculum", "Publish"]} currentStep={1} />

      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-lg border border-light-border shadow-sm dark:border-[rgba(244,244,246,0.15)]">
          <button
            type="button"
            onClick={() => setModule1Open((v) => !v)}
            className="flex w-full items-center justify-between gap-4 border-b border-[rgba(198,198,205,0.4)] bg-[#f8f9ff] px-4 py-4 text-left dark:border-[rgba(43,43,49,0.6)] dark:bg-dak-border"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#4f626e] dark:text-dak-body">
                Module 1
              </span>
              <span className="text-xl font-semibold text-auth-navy dark:text-dak-heading sm:text-2xl">
                Foundations of Structural Analysis
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Image src="/icons/dots-horizontal.svg" alt="" width={16} height={16} className="rotate-90 dark:invert" />
              <Image
                src="/icons/chevron-down-small.svg"
                alt=""
                width={12}
                height={12}
                className={`dark:invert ${module1Open ? "rotate-180" : ""}`}
              />
            </div>
          </button>
          {module1Open && (
            <div className="flex flex-col gap-3 bg-white p-4 dark:bg-dak-surface">
              {LESSONS.map((lesson) => (
                <div
                  key={lesson.title}
                  className="flex items-center gap-4 rounded border border-light-border bg-[#f8f9ff] p-3 dark:border-[rgba(198,198,205,0.2)] dark:bg-dak-border"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded bg-[rgba(79,98,110,0.1)] dark:bg-[rgba(244,244,246,0.1)]">
                    <Image src={lessonIcon[lesson.kind]} alt="" width={20} height={20} className="dark:invert" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">
                      {lesson.title}
                    </span>
                    <span className="truncate text-xs text-[#4f626e] dark:text-dak-body">{lesson.meta}</span>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2 rounded border border-dashed border-[#4f626e] text-sm font-medium text-auth-navy dark:border-dak-heading dark:text-dak-heading"
              >
                <Image src="/icons/plus-small.svg" alt="" width={11} height={11} className="dark:invert" />
                Add Lesson
              </button>
            </div>
          )}
        </div>

        <Link
          href="/classrooms/create/module"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#dcdcdc] px-6 py-6 text-xl font-semibold text-auth-navy shadow-sm dark:bg-dak-border dark:text-dak-heading"
        >
          <Image src="/icons/plus-small.svg" alt="" width={23} height={23} className="dark:invert" />
          Add Module
        </Link>
      </div>

      <div className="flex items-center justify-between border-t border-light-border pt-6 dark:border-[rgba(43,43,49,0.6)]">
        <Link
          href="/classrooms/create"
          className="rounded border border-[#4f626e] px-8 py-4 text-center text-base font-medium text-auth-navy dark:border-dak-body dark:text-dak-body"
        >
          Cancel
        </Link>
        <Link
          href="/classrooms/create/review"
          className="rounded bg-dak-cta px-8 py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]"
        >
          Review &amp; Publish
        </Link>
      </div>
    </div>
  );
}
