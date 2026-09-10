import Image from "next/image";
import Link from "next/link";
import { ClassCard } from "@/components/cards/ClassCard";

const tabs = ["Latest", "Canvases", "Discussions", "Classrooms", "Peoples & Business"];

const classrooms = Array.from({ length: 4 }).map((_, i) => ({
  href: `/classrooms/${i + 1}`,
  title: "Lorem Ipsum Classroom",
  subtitle: "Master Tile. Inc",
  modules: "4modules",
}));

const posts = Array.from({ length: 3 }).map(() => ({
  author: "Mark Williams",
  ago: "Posted 4 hours ago",
  title: "Lorem Ipsum",
  body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.....",
}));

export default function ExploreHubPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
          Explore what the trades are building
        </h1>
        <p className="text-base text-auth-slate">
          Public canvases, classrooms, profiles, Newest first.
        </p>
      </div>

      <div className="flex gap-8 border-b border-light-border">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`pb-3 text-lg font-medium ${
              i === 0 ? "border-b-4 border-auth-navy text-auth-navy" : "text-[#929292]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-medium text-auth-navy">Classrooms</h3>
          <Link href="/classrooms" className="text-base font-medium text-auth-navy">
            See All
          </Link>
        </div>
        <div className="flex gap-6">
          {classrooms.map((c, i) => (
            <ClassCard key={i} {...c} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h3 className="text-2xl font-medium text-auth-navy">From the community</h3>
            <div className="flex gap-2">
              <button className="rounded-xl border border-light-border bg-auth-navy/10 px-4 py-2 text-base font-semibold text-auth-navy">
                Trending
              </button>
              <button className="rounded-xl bg-auth-navy px-4 py-2 text-base font-semibold text-white">
                Following
              </button>
            </div>
          </div>
          <Link href="/discover" className="text-base font-medium text-auth-navy">
            See All
          </Link>
        </div>
        <div className="flex gap-4">
          {posts.map((p, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col gap-2 rounded-lg border border-light-border bg-[#f8f9ff] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-auth-navy/15">
                  <Image src="/icons/user-rounded-small.svg" alt="" width={18} height={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-auth-navy">{p.author}</span>
                  <span className="text-xs text-[#9c9c9c]">{p.ago}</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-auth-navy">{p.title}</h4>
              <p className="text-sm text-auth-navy">{p.body}</p>
              <div className="flex h-[210px] items-center justify-center rounded-lg bg-auth-navy">
                <Image src="/illustrations/auth-placeholder.svg" alt="" width={40} height={40} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
