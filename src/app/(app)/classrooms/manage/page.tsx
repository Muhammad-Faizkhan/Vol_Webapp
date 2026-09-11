import Link from "next/link";
import { ClassCard } from "@/components/cards/ClassCard";

const classrooms = Array.from({ length: 8 }).map((_, i) => ({
  href: `/classrooms/${i + 1}`,
  title: "Lorem Ipsum Classroom",
  subtitle: "Master Tile. Inc",
  modules: "4modules",
  tag: "50+ Enrolled",
}));

export default function ManageClassroomsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Classrooms
        </h1>
        <Link
          href="/classrooms/create"
          className="flex w-fit items-center gap-2 rounded-lg bg-auth-navy px-4 py-2.5 text-base font-medium text-white dark:bg-dak-cta"
        >
          + Create Classroom
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        {classrooms.map((c, i) => (
          <ClassCard key={i} {...c} />
        ))}
      </div>
    </div>
  );
}
