"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClassCard } from "@/components/cards/ClassCard";

const classrooms = Array.from({ length: 12 }).map((_, i) => ({
  href: `/classrooms/${i + 1}`,
  title: "Lorem Ipsum Classroom",
  subtitle: "Master Tile. Inc",
  modules: "4modules",
  imageSrc: "/illustrations/canvas-thumb-moodboard.png",
}));

const activeClassrooms = Array.from({ length: 4 }).map((_, i) => ({
  href: `/classrooms/${i + 1}`,
  title: "Lorem Ipsum Classroom",
  subtitle: "Master Tile. Inc",
  modules: "5modules",
  badge: "3/5 modules",
  progress: 65,
  imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
}));

const tabs = [
  { id: "all", label: "Classrooms", width: "sm:w-[160px]" },
  { id: "active", label: "Active Classroom", width: "sm:w-[161px]" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function MyClassroomsPage() {
  const [tab, setTab] = useState<TabId>("all");

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px] sm:leading-10">
          Classrooms
        </h1>
        <Link
          href="/classrooms/join"
          className="flex w-fit items-center justify-center gap-2 rounded border-t border-white/20 bg-dak-cta px-6 pb-3 pt-[13px] text-sm font-medium leading-4 tracking-[0.28px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
        >
          <Image src="/icons/plus.svg" alt="" width={14} height={14} />
          Join Classroom
        </Link>
      </div>

      <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-[#c793ff] dark:border-dak-border">
        {tabs.map((t) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 flex-col items-center gap-2 ${t.width}`}
            >
              <span
                className={`whitespace-nowrap text-lg leading-4 tracking-[0.28px] ${
                  selected
                    ? "font-semibold text-[#020204] dark:text-dak-heading"
                    : "font-medium text-[#2b2b31] dark:text-dak-muted"
                }`}
              >
                {t.label}
              </span>
              <span
                className={`h-1 w-full rounded-full ${selected ? "bg-[#020204] dark:bg-dak-cta" : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>

      {tab === "all" ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-5 gap-y-4">
          {classrooms.map((c, i) => (
            <ClassCard key={i} {...c} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {activeClassrooms.map((c, i) => (
            <ClassCard key={i} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
