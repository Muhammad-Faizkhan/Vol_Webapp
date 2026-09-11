import Image from "next/image";
import Link from "next/link";
import { ClassCard } from "@/components/cards/ClassCard";

const tabs = ["Latest", "Canvases", "Discussions", "Classrooms", "Peoples & Business"];

const classrooms = Array.from({ length: 4 }).map((_, i) => ({
  href: `/classrooms/${i + 1}`,
  title: "Lorem Ipsum Classroom",
  subtitle: "Master Tile. Inc",
  modules: "4modules",
  imageSrc: "/illustrations/classroom-thumb-engineers.jpg",
}));

const posts = Array.from({ length: 3 }).map((_, i) => ({
  author: "Mark Williams",
  ago: "Posted 4 hours ago",
  title: "Lorem Ipsum",
  body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.....",
  avatar: `/avatars/avatar-${(i % 3) + 1}.jpg`,
  imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
}));

export default function ExploreHubPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Explore what the trades are building
        </h1>
        <p className="text-base text-auth-slate dark:text-dak-body">
          Public canvases, classrooms, profiles, Newest first.
        </p>
      </div>

      <div className="flex gap-8 overflow-x-auto border-b border-light-border dark:border-dak-border">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`shrink-0 whitespace-nowrap pb-3 text-lg font-medium ${
              i === 0
                ? "border-b-4 border-auth-navy text-auth-navy dark:border-dak-cta dark:text-dak-heading"
                : "text-[#929292] dark:text-dak-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Classrooms</h3>
          <Link href="/classrooms" className="text-base font-medium text-dak-cta">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          {classrooms.map((c, i) => (
            <ClassCard key={i} {...c} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">From the community</h3>
            <div className="flex gap-2">
              <button className="rounded-xl border border-light-border bg-auth-navy/10 px-4 py-2 text-base font-semibold text-auth-navy dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading">
                Trending
              </button>
              <button className="rounded-xl bg-auth-navy px-4 py-2 text-base font-semibold text-white dark:bg-dak-cta">
                Following
              </button>
            </div>
          </div>
          <Link href="/discover" className="text-base font-medium text-dak-cta">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {posts.map((p, i) => (
            <div
              key={i}
              className="flex w-full flex-col gap-2 rounded-lg border border-light-border bg-[#f8f9ff] p-5 dark:border-dak-border dark:bg-dak-surface"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                  <Image src={p.avatar} alt="" fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">{p.author}</span>
                  <span className="text-xs text-[#9c9c9c] dark:text-dak-muted">{p.ago}</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-auth-navy dark:text-dak-heading">{p.title}</h4>
              <p className="text-sm text-auth-navy dark:text-dak-body">{p.body}</p>
              <div className="relative h-[210px] overflow-hidden rounded-lg bg-auth-navy dark:bg-dak-surface">
                <Image src={p.imageSrc} alt="" fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
