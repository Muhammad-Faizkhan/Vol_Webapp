import Link from "next/link";
import { ClassCard } from "@/components/cards/ClassCard";

const classrooms = Array.from({ length: 3 }).map((_, i) => ({
  href: `/classrooms/${i + 1}`,
  title: "Lorem Ipsum Classroom",
  subtitle: "Master Tile. Inc",
  modules: "",
  tag: "3/5 modules",
  progress: 65,
}));

export default function MyClassroomsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
          Classrooms
        </h1>
        <Link
          href="/classrooms/join"
          className="flex items-center gap-2 rounded-lg bg-auth-navy px-4 py-2.5 text-base font-medium text-white"
        >
          + Join Classroom
        </Link>
      </div>

      <div className="flex gap-8 border-b border-light-border">
        <button className="pb-3 text-lg font-medium text-[#929292]">Classrooms</button>
        <button className="border-b-4 border-auth-navy pb-3 text-lg font-medium text-auth-navy">
          Active Classroom
        </button>
      </div>

      <div className="flex gap-6">
        {classrooms.map((c, i) => (
          <ClassCard key={i} {...c} />
        ))}
      </div>
    </div>
  );
}
