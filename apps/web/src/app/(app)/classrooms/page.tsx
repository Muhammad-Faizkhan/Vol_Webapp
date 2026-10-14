"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ClassroomCard, Paged } from "@vol/api-client";
import { useApiQuery, withQuery } from "@vol/api-client/react";
import { ClassCard } from "@/components/cards/ClassCard";
import { EmptyState, LoadingGrid, Pager } from "@/components/ui/States";
import { plural } from "@/lib/format";

const tabs = [
  { id: "enrolled", label: "Classrooms", width: "sm:w-[160px]" },
  { id: "active", label: "Active Classroom", width: "sm:w-[161px]" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function MyClassroomsPage() {
  const [tab, setTab] = useState<TabId>("enrolled");
  const [page, setPage] = useState(1);
  const { data } = useApiQuery<Paged<ClassroomCard>>(withQuery("/classrooms", { scope: tab, page, limit: 12 }));

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px] sm:leading-10">Classrooms</h1>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/classrooms/manage"
            className="flex w-fit items-center justify-center gap-2 rounded border border-[#2b2b31] px-6 pb-3 pt-[13px] text-sm font-medium leading-4 tracking-[0.28px] text-[#020204] dark:border-dak-border dark:text-dak-heading"
          >
            Teaching
          </Link>
          <Link
            href="/classrooms/join"
            className="flex w-fit items-center justify-center gap-2 rounded border-t border-white/20 bg-dak-cta px-6 pb-3 pt-[13px] text-sm font-medium leading-4 tracking-[0.28px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
          >
            <Image src="/icons/plus.svg" alt="" width={14} height={14} />
            Join Classroom
          </Link>
        </div>
      </div>

      <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-[#c793ff] dark:border-dak-border">
        {tabs.map((t) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setTab(t.id);
                setPage(1);
              }}
              className={`flex shrink-0 flex-col items-center gap-2 ${t.width}`}
            >
              <span
                className={`whitespace-nowrap text-lg leading-4 tracking-[0.28px] ${
                  selected ? "font-semibold text-[#020204] dark:text-dak-heading" : "font-medium text-[#2b2b31] dark:text-dak-muted"
                }`}
              >
                {t.label}
              </span>
              <span className={`h-1 w-full rounded-full ${selected ? "bg-[#020204] dark:bg-dak-cta" : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>

      {!data ? (
        <LoadingGrid minWidth={300} />
      ) : data.items.length === 0 ? (
        tab === "enrolled" ? (
          <EmptyState
            title="You haven't joined a classroom yet"
            body="Ask your instructor for a 6-character code, or browse public classrooms."
            action={{ label: "Browse classrooms", href: "/explore?tab=classrooms" }}
          />
        ) : (
          <EmptyState title="Nothing in progress" body="Classes you've started but not finished appear here." />
        )
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-5 gap-y-4">
          {data.items.map((c) => (
            <ClassCard
              key={c.id}
              href={`/classrooms/${c.id}`}
              title={c.title}
              subtitle={c.instructor.name}
              modules={plural(c.moduleCount, "module")}
              badge={tab === "active" ? `${c.completedLessons}/${c.lessonCount} lessons` : undefined}
              progress={tab === "active" ? (c.progress ?? 0) : undefined}
              imageSrc={c.imageUrl ?? undefined}
            />
          ))}
        </div>
      )}
      {data && <Pager page={data.page} pages={data.pages} onPage={setPage} />}
    </div>
  );
}
