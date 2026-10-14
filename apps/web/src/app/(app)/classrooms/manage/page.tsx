"use client";

import Link from "next/link";
import type { ClassroomCard, Paged } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { ClassCard } from "@/components/cards/ClassCard";
import { EmptyState, LoadingGrid } from "@/components/ui/States";
import { plural } from "@/lib/format";

export default function ManageClassroomsPage() {
  const { data } = useApiQuery<Paged<ClassroomCard>>("/classrooms?scope=teaching&limit=100");

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px] sm:leading-10">Classrooms</h1>
        <Link
          href="/classrooms/create"
          className="flex w-fit items-center justify-center gap-2 rounded border-t border-white/20 bg-dak-cta px-6 pb-3 pt-[13px] text-sm font-medium leading-4 tracking-[0.28px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
        >
          + Create Classroom
        </Link>
      </div>

      {!data ? (
        <LoadingGrid minWidth={300} />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="You aren't teaching any classrooms yet"
          body="Create a course, build its curriculum and share the join code with your students."
          action={{ label: "+ Create Classroom", href: "/classrooms/create" }}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-5 gap-y-4">
          {data.items.map((c) => (
            <ClassCard
              key={c.id}
              href={c.status === "DRAFT" ? `/classrooms/create/curriculum?id=${c.id}` : `/classrooms/${c.id}`}
              title={c.title}
              subtitle={c.category ?? c.instructor.name}
              modules={plural(c.moduleCount, "module")}
              tag={c.status === "DRAFT" ? "Draft" : `${c.enrolledCount} Enrolled`}
              imageSrc={c.imageUrl ?? undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
