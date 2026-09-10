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
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
          Classrooms
        </h1>
        <Link
          href="/classrooms/create"
          className="flex items-center gap-2 rounded-lg bg-auth-navy px-4 py-2.5 text-base font-medium text-white"
        >
          + Create Classroom
        </Link>
      </div>

      <div className="flex flex-wrap gap-6">
        {classrooms.map((c, i) => (
          <div key={i} className="w-[300px]">
            <ClassCard {...c} />
          </div>
        ))}
      </div>
    </div>
  );
}
