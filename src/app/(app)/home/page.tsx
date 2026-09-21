import Image from "next/image";
import Link from "next/link";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";

const stats = [
  { label: "ACTIVE WORKSPACES", value: "6", note: "+1 this week", noteClassName: "text-[#34a853]" },
  { label: "CANVASES", value: "24", note: "4 Shared publicly", noteClassName: "text-[#2b2b31] dark:text-dak-muted" },
];

const collaboratorAvatars = ["/avatars/avatar-1.jpg", "/avatars/avatar-2.jpg", "/avatars/avatar-3.jpg"];

const workspaces = [
  {
    href: "/workspaces/1",
    title: "Lorem Ipsum Title",
    workspace: "Lorem Ipsum Workspace",
    editedAgo: "Edited 12min ago",
    updatedTag: "UPDATED 2H AGO",
    collaboratorAvatars,
    collaboratorCount: 2,
    imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
  },
  {
    href: "/workspaces/2",
    title: "Lorem Ipsum Title",
    workspace: "Lorem Ipsum Workspace",
    editedAgo: "Edited 12min ago",
    updatedTag: "UPDATED 2H AGO",
    collaboratorAvatars,
    collaboratorCount: 2,
    imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
  },
];

const classrooms = [
  { name: "Lorem Ipsum Class", sub: "Abc Class", tags: ["10 Enrolled", "Public Preview"] },
  { name: "Lorem Ipsum Class", sub: "Abc Class", tags: ["10 Enrolled", "Public Preview"] },
];

const canvases = [
  { title: "Lorem Ipsum Dor Amous Title", workspace: "Lorem Ipsum Workspace", ago: "12min ago", visibility: "Public" },
  { title: "Lorem Ipsum Dor Amous Title", workspace: "Lorem Ipsum Workspace", ago: "12min ago", visibility: "Private" },
  { title: "Lorem Ipsum Dor Amous Title", workspace: "Lorem Ipsum Workspace", ago: "12min ago", visibility: "Public" },
  { title: "Lorem Ipsum Dor Amous Title", workspace: "Lorem Ipsum Workspace", ago: "12min ago", visibility: "Public" },
];

const businessFollows = [
  { name: "Abc Business", sub: "Distributor. 1,203 products", avatar: "/avatars/avatar-1.jpg" },
  { name: "Abc Business", sub: "Distributor. 1,203 products", avatar: "/avatars/avatar-2.jpg" },
  { name: "Abc Business", sub: "Distributor. 1,203 products", avatar: "/avatars/avatar-3.jpg" },
  { name: "Abc Business", sub: "Distributor. 1,203 products", avatar: "/avatars/avatar-1.jpg" },
];

const myClassrooms = [
  { name: "Advanced Fluid Dynamics", progress: 65, module: "Module 4: Turbulence Modeling" },
  { name: "Advanced Fluid Dynamics", progress: 65, module: "Module 4: Turbulence Modeling" },
];

const communityPosts = [
  {
    href: "/discover/post/1",
    author: "Mark Williams",
    ago: "Posted 4 hours ago",
    title: "Lorem Ipsum",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.....",
    avatar: "/avatars/avatar-2.jpg",
    imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
    likes: 124,
    comments: 18,
  },
  {
    href: "/discover/post/1",
    author: "Mark Williams",
    ago: "Posted 4 hours ago",
    title: "Lorem Ipsum",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.....",
    avatar: "/avatars/avatar-2.jpg",
    imageSrc: "/illustrations/canvas-thumb-moodboard.png",
    likes: 124,
    comments: 18,
  },
];

const tradeProducts = [
  { href: "/business/products/1/edit", name: "Lorem Ipsum Product", by: "By Abc Business", size: "600x1200x9MM" },
  { href: "/business/products/2/edit", name: "Lorem Ipsum Product", by: "By Abc Business", size: "600x1200x9MM" },
  { href: "/business/products/3/edit", name: "Lorem Ipsum Product", by: "By Abc Business", size: "600x1200x9MM" },
];

export default function HomePage() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
            Good morning, Alex.
          </h1>
          <p className="text-base text-auth-slate dark:text-dak-body">
            Here&apos;s what&apos;s happening across your network.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <Link
            href="/canvas/1"
            className="flex h-14 items-center justify-center gap-4 rounded-xl border border-light-border bg-app-dark-surface px-[17px] text-base text-white"
          >
            <Image src="/icons/new-canvas-white.svg" alt="" width={12} height={15} />
            Create Canvas
          </Link>
          <Link
            href="/workspaces/create"
            className="flex h-14 items-center justify-center gap-4 rounded-xl bg-dak-cta px-4 text-base text-white"
          >
            <Image src="/icons/new-workspace.svg" alt="" width={16} height={12} />
            Create Workspace
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-3 rounded-lg border border-dak-cta bg-gradient-to-b from-white to-[#f3e8ff] px-[25px] py-[17px] shadow-[0px_4px_4px_rgba(148,54,251,0.25)] dark:border-dak-cta dark:from-dak-surface dark:to-dak-surface"
          >
            <span className="text-sm font-medium tracking-[0.28px] text-auth-navy dark:text-dak-heading">
              {stat.label}
            </span>
            <p className="text-2xl font-medium text-auth-navy dark:text-dak-heading">
              {stat.value} <span className={`text-sm ${stat.noteClassName}`}>{stat.note}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex min-w-0 flex-col gap-8 lg:flex-[2]">
          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Recent Workspace</h3>
              <Link href="/workspaces" className="text-base font-medium text-dak-cta">
                View All Workspaces
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
              {workspaces.map((ws, i) => (
                <WorkspaceCard key={i} {...ws} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Featured Classrooms</h3>
              <Link href="/classrooms" className="text-base font-medium text-dak-cta">
                Browse Classrooms
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
              {classrooms.map((c, i) => (
                <div
                  key={i}
                  className="flex min-h-[100px] w-full items-center gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white px-6 py-4 shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
                >
                  <div className="relative size-[60px] shrink-0 overflow-hidden rounded-2xl border border-auth-navy dark:border-dak-border">
                    <Image src="/illustrations/classroom-thumb-engineers.jpg" alt="" fill className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="truncate text-sm font-medium tracking-[0.28px] text-auth-navy dark:text-dak-heading">
                        {c.name}
                      </span>
                      <span className="truncate text-xs text-[#45464d] dark:text-dak-muted">{c.sub}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm bg-[rgba(148,54,251,0.1)] px-2 py-1 text-[10px] font-medium text-dak-cta"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Recent Canvases</h3>
              <Link href="/canvas/1" className="text-base font-medium text-dak-cta">
                Open Last Canvas
              </Link>
            </div>
            <div className="w-full overflow-hidden rounded-2xl border border-light-border dark:border-dak-border">
              <div className="flex h-14 items-center gap-4 bg-app-dark-surface px-6 text-base text-white sm:gap-8">
                <span className="min-w-0 flex-[2] truncate">Canvas</span>
                <span className="min-w-0 flex-1 truncate">Workspace</span>
                <span className="w-[90px] shrink-0 whitespace-nowrap">Last Edited</span>
                <span className="shrink-0 whitespace-nowrap">Visibility</span>
              </div>
              <div className="flex flex-col bg-[#f8f9ff] dark:bg-dak-surface">
                {canvases.map((row, i) => (
                  <div
                    key={i}
                    className={`flex h-14 items-center gap-4 px-6 sm:gap-8 ${i !== canvases.length - 1 ? "border-b border-[#c6c6cd]/50 dark:border-dak-border" : ""}`}
                  >
                    <div className="flex min-w-0 flex-[2] items-center gap-4">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                        <Image src="/illustrations/canvas-thumb-mortar-pattern.jpg" alt="" fill className="object-cover" />
                      </div>
                      <span className="min-w-0 truncate text-base text-auth-navy dark:text-dak-heading">{row.title}</span>
                    </div>
                    <span className="min-w-0 flex-1 truncate text-base text-[#929292] dark:text-dak-muted">{row.workspace}</span>
                    <span className="w-[90px] shrink-0 whitespace-nowrap text-base text-[#929292] dark:text-dak-muted">{row.ago}</span>
                    <span className="w-fit shrink-0 whitespace-nowrap rounded-lg border border-light-border bg-auth-navy/10 px-[9px] py-[5px] text-sm font-medium text-auth-navy dark:border-dak-border dark:bg-dak-cta/10 dark:text-dak-heading">
                      {row.visibility}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">From the community</h3>
                <div className="flex gap-2">
                  <button className="rounded-xl border border-auth-navy px-[13px] py-[5px] text-base text-auth-navy dark:border-dak-border dark:text-dak-heading">
                    Trending
                  </button>
                  <button className="rounded-xl bg-[#2b2b31] px-3 py-[5px] text-base font-semibold text-white dark:bg-dak-cta">
                    Following
                  </button>
                </div>
              </div>
              <Link href="/explore" className="text-base font-medium text-dak-cta">
                Explore
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {communityPosts.map((p, i) => (
                <div
                  key={i}
                  className="flex w-full flex-col gap-2 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-[21px] shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                      <Image src={p.avatar} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-auth-navy dark:text-dak-heading">{p.author}</span>
                      <span className="text-sm text-[#9c9c9c] dark:text-dak-muted">{p.ago}</span>
                    </div>
                  </div>
                  <h4 className="pt-1 text-xl font-semibold text-auth-navy dark:text-dak-heading">{p.title}</h4>
                  <p className="text-base text-[#2b2b31] dark:text-dak-body">{p.body}</p>
                  <div className="relative h-[210px] overflow-hidden rounded-2xl bg-auth-navy dark:bg-dak-surface">
                    <Image src={p.imageSrc} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex items-center gap-4 border-t border-[#c793ff] pt-[17px]">
                    <div className="flex items-center gap-1">
                      <Image src="/icons/like.svg" alt="" width={16} height={15} />
                      <span className="text-xs font-semibold text-[#2b2b31] dark:text-dak-body">{p.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image src="/icons/comment.svg" alt="" width={15} height={15} />
                      <span className="text-xs font-semibold text-[#2b2b31] dark:text-dak-body">{p.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">New products near your trade</h3>
              <Link href="/business/dashboard" className="text-base font-medium text-dak-cta">
                Open Catalog
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
              {tradeProducts.map((p, i) => (
                <Link
                  key={i}
                  href={p.href}
                  className="flex w-full flex-col overflow-hidden rounded-lg border border-[rgba(43,43,49,0.4)] bg-white shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
                >
                  <div className="relative h-[130px] w-full overflow-hidden bg-auth-navy dark:bg-dak-surface">
                    <Image src="/illustrations/classroom-thumb-engineers.jpg" alt="" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <h4 className="text-sm font-medium text-auth-navy dark:text-dak-heading">{p.name}</h4>
                    <span className="text-sm text-[#2b2b31] dark:text-dak-muted">{p.by}</span>
                    <span className="w-fit rounded-sm border border-dak-cta bg-[rgba(148,54,251,0.1)] px-2.5 py-1 text-xs font-medium text-dak-cta">
                      {p.size}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="flex w-full flex-col gap-6 lg:sticky lg:top-[116px] lg:flex-1 lg:self-start">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium text-auth-navy dark:text-dak-heading">Notifications</h3>
            <div className="flex items-center gap-4 rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white p-[17px] shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                <Image src="/avatars/avatar-1.jpg" alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-auth-navy dark:text-dak-heading">Abc Workspace Invitation</p>
                <p className="text-sm text-auth-navy dark:text-dak-body">Mark Williams invited you as a collaborator</p>
                <div className="flex gap-2 pt-1">
                  <button className="rounded-lg bg-auth-navy px-3 py-1.5 text-xs font-medium text-white dark:bg-dak-cta">
                    Accept
                  </button>
                  <button className="rounded-lg border border-light-border px-3 py-1.5 text-xs font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading">
                    Decline
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white p-[17px] shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
              <div className="relative size-[60px] shrink-0 overflow-hidden rounded-2xl border border-auth-navy dark:border-dak-border">
                <Image src="/illustrations/canvas-thumb-mortar-pattern.jpg" alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-auth-navy dark:text-dak-heading">Workspace Code Accepted</p>
                <p className="text-sm text-auth-navy dark:text-dak-body">Mark Williams Accepted your request</p>
                <button className="mt-1 w-fit rounded-lg bg-auth-navy px-3 py-1.5 text-xs font-medium text-white dark:bg-dak-cta">
                  Open Classroom
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium text-auth-navy dark:text-dak-heading">Business profiles to follow</h3>
            <div className="flex flex-col gap-6 rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
              {businessFollows.map((biz, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                    <Image src={biz.avatar} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-base font-medium text-auth-navy dark:text-dak-heading">{biz.name}</span>
                    <span className="text-sm text-[#2b2b31] dark:text-dak-muted">{biz.sub}</span>
                  </div>
                  <button className="rounded-lg bg-auth-navy px-3 py-1.5 text-sm font-medium text-white dark:bg-dak-cta">
                    Follow
                  </button>
                </div>
              ))}
              <Link
                href="/explore"
                className="flex items-center justify-center rounded-lg border border-auth-navy py-2 text-base text-auth-navy dark:border-dak-border dark:text-dak-heading"
              >
                See more in Explore
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-auth-navy dark:text-dak-heading">My Classrooms</h3>
            <div className="flex flex-col gap-4 rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
              {myClassrooms.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-2xl bg-[#2b2b31] px-6 py-5 shadow-[0px_8px_4px_rgba(2,2,4,0.3)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base text-[#f3f3f3]">{c.name}</span>
                    <span className="text-base text-white">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#e0e0e0]">
                    <div className="h-full rounded-full bg-dak-cta" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className="text-xs text-white">{c.module}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
