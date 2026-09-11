import Link from "next/link";
import { ClassCard } from "@/components/cards/ClassCard";

const classrooms = Array.from({ length: 12 }).map((_, i) => ({
  href: `/classrooms/${i + 1}`,
  title: "Lorem Ipsum Classroom",
  subtitle: "Master Tile. Inc",
  modules: "4modules",
  imageSrc: "/illustrations/classroom-thumb-engineers.jpg",
}));

export default function MyClassroomsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Classrooms
        </h1>
        <Link
          href="/classrooms/join"
          className="flex w-fit items-center gap-2 rounded-lg bg-auth-navy px-4 py-2.5 text-base font-medium text-white dark:bg-dak-cta"
        >
          + Join Classroom
        </Link>
      </div>

      <div className="flex gap-8 overflow-x-auto border-b border-light-border dark:border-dak-border">
        <button className="shrink-0 whitespace-nowrap border-b-4 border-auth-navy pb-3 text-lg font-medium text-auth-navy dark:border-dak-cta dark:text-dak-heading">
          Classrooms
        </button>
        <button className="shrink-0 whitespace-nowrap pb-3 text-lg font-medium text-[#929292] dark:text-dak-muted">
          Active Classroom
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        {classrooms.map((c, i) => (
          <ClassCard key={i} {...c} />
        ))}
      </div>
    </div>
  );
}
