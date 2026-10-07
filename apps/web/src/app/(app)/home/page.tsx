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

// Figma's Recent Canvases table: 290 / 193 / 94 / 81px columns with 62px gaps
// at the full 935px width (workspace widened to 200px so its text is not clipped by
// browser font metrics); the two text columns shrink (and truncate) below that.
const canvasTableCols =
  "grid grid-cols-[minmax(0,290px)_minmax(0,200px)_94px_81px] items-center gap-x-[clamp(16px,3.3vw,62px)]";

const sectionHeading = "text-xl font-semibold leading-8 sm:text-2xl text-[#020204] dark:text-dak-heading";
const sectionLink = "shrink-0 whitespace-nowrap text-sm font-medium leading-3 text-dak-cta sm:text-base";
const sidePanel =
  "rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface";
const darkPill =
  "flex h-8 shrink-0 items-center justify-center rounded-lg bg-[#2b2b31] px-2 text-sm font-medium text-white dark:bg-dak-cta";

export default function HomePage() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px] sm:leading-10">
            Good morning, Alex.
          </h1>
          <p className="text-base leading-6 text-[#2b2b31] dark:text-dak-body">
            Here&apos;s what&apos;s happening across your network.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <Link
            href="/canvas/1"
            className="flex h-14 items-center justify-center gap-4 rounded-xl border border-light-border bg-app-dark-surface px-[17px] text-base text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:w-[185px]"
          >
            <Image src="/icons/new-canvas-white.svg" alt="" width={12} height={15} />
            Create Canvas
          </Link>
          <Link
            href="/workspaces/create"
            className="flex h-14 items-center justify-center gap-4 rounded-xl bg-dak-cta px-4 text-base text-white sm:w-[209px]"
          >
            <Image src="/icons/new-workspace.svg" alt="" width={16} height={12} />
            Create Workspace
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex h-[88px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dak-cta bg-gradient-to-b from-white to-[#f3e8ff] px-[41px] drop-shadow-[0px_4px_4px_rgba(148,54,251,0.25)] dark:border-dak-cta dark:from-dak-surface dark:to-dak-surface sm:w-[240px]"
          >
            <span className="whitespace-nowrap text-sm font-medium leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-heading">
              {stat.label}
            </span>
            <p className="whitespace-nowrap font-medium leading-4 tracking-[0.28px]">
              <span className="text-[28px] text-[#020204] dark:text-dak-heading">{stat.value}</span>{" "}
              <span className={`text-sm ${stat.noteClassName}`}>{stat.note}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex min-w-0 flex-col gap-8 lg:flex-[935]">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className={sectionHeading}>Recent Workspace</h3>
              <Link href="/workspaces" className={sectionLink}>
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
            <div className="flex items-end justify-between gap-4">
              <h3 className={sectionHeading}>Featured Classrooms</h3>
              <Link href="/classrooms" className={sectionLink}>
                Browse Classrooms
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[15px]">
              {classrooms.map((c, i) => (
                <div
                  key={i}
                  className="flex min-h-[100px] w-full items-center gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white py-[9px] pl-6 pr-[25px] shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
                >
                  <div className="relative size-[60px] shrink-0 overflow-hidden rounded-2xl border-[0.5px] border-[#020204] dark:border-dak-border">
                    <Image src="/illustrations/classroom-thumb-laptop.jpg" alt="" fill className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="truncate py-1 pr-4 text-sm font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">
                        {c.name}
                      </span>
                      <span className="truncate py-1 text-xs leading-4 tracking-[0.28px] text-[#45464d] dark:text-dak-muted">
                        {c.sub}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex h-6 items-center rounded-[2px] bg-[rgba(148,54,251,0.1)] px-2 text-[10px] font-medium leading-[15px] text-dak-cta"
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
            <div className="flex items-end justify-between gap-4">
              <h3 className={sectionHeading}>Recent Canvases</h3>
              <Link href="/canvas/1" className={sectionLink}>
                Open Last Canvas
              </Link>
            </div>
            <div className="w-full overflow-x-auto rounded-2xl drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)]">
              <div className="min-w-[600px]">
                <div
                  className={`${canvasTableCols} h-20 rounded-t-2xl bg-[#2b2b31] px-6 text-base leading-10 tracking-[-0.32px] text-white dark:bg-app-dark-surface`}
                >
                  <span className="truncate pl-2">Canvas</span>
                  <span className="truncate">Workspace</span>
                  <span className="whitespace-nowrap">Last Edited</span>
                  <span className="whitespace-nowrap pl-3">Visibility</span>
                </div>
                <div className="flex flex-col gap-4 rounded-b-2xl border-x border-b border-[rgba(43,43,49,0.4)] bg-white py-6 dark:border-dak-border dark:bg-dak-surface">
                  {canvases.map((row, i) => (
                    <div
                      key={i}
                      className={`${canvasTableCols} h-14 px-6 ${i !== canvases.length - 1 ? "border-b-[0.5px] border-[#c793ff] dark:border-dak-border" : ""}`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-[#191919] dark:border-dak-border">
                          <Image src="/illustrations/canvas-thumb-mortar-pattern.jpg" alt="" fill className="object-cover" />
                        </div>
                        <span className="min-w-0 truncate text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">
                          {row.title}
                        </span>
                      </div>
                      <span className="truncate text-base leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-muted">
                        {row.workspace}
                      </span>
                      <span className="whitespace-nowrap text-base leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-muted">
                        {row.ago}
                      </span>
                      <span
                        className={`flex h-8 w-[81px] items-center justify-center rounded-lg border-[0.5px] text-sm font-medium leading-[15px] ${
                          row.visibility === "Public"
                            ? "border-[rgba(52,168,83,0.15)] bg-[rgba(52,168,83,0.15)] text-[#34a853]"
                            : "border-[rgba(2,2,4,0.15)] bg-[rgba(2,2,4,0.1)] text-[#020204] dark:border-dak-border dark:bg-dak-cta/10 dark:text-dak-heading"
                        }`}
                      >
                        {row.visibility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <h3 className={sectionHeading}>From the community</h3>
                <div className="flex gap-2">
                  <button className="flex h-10 w-[120px] items-center justify-center rounded-xl border border-[#020204] text-base text-[#020204] dark:border-dak-border dark:text-dak-heading">
                    Trending
                  </button>
                  <button className="flex h-10 w-[120px] items-center justify-center rounded-xl bg-[#2b2b31] text-base font-semibold text-white dark:bg-dak-cta">
                    Following
                  </button>
                </div>
              </div>
              <Link href="/explore" className={sectionLink}>
                Explore
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {communityPosts.map((p, i) => (
                <div
                  key={i}
                  className="flex w-full flex-col gap-2 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-[21px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                      <Image src={p.avatar} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">
                        {p.author}
                      </span>
                      <span className="text-sm leading-3 text-[#9c9c9c] dark:text-dak-muted">{p.ago}</span>
                    </div>
                  </div>
                  <h4 className="pt-1 text-xl font-semibold leading-8 text-[#020204] dark:text-dak-heading">{p.title}</h4>
                  <p className="text-base leading-6 text-[#2b2b31] dark:text-dak-body">{p.body}</p>
                  <div className="relative h-[210px] overflow-hidden rounded-2xl bg-[#2b2b31] dark:bg-dak-surface">
                    <Image src={p.imageSrc} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex items-center gap-4 border-t border-[#c793ff] pt-[17px]">
                    <div className="flex items-center gap-1">
                      <Image src="/icons/like.svg" alt="" width={16} height={15} />
                      <span className="text-xs font-semibold leading-3 text-[#2b2b31] dark:text-dak-body">{p.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image src="/icons/comment.svg" alt="" width={15} height={15} />
                      <span className="text-xs font-semibold leading-3 text-[#2b2b31] dark:text-dak-body">{p.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className={sectionHeading}>New products near your trade</h3>
              <Link href="/business/dashboard" className={sectionLink}>
                Open Catalog
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 xl:gap-[33px]">
              {tradeProducts.map((p, i) => (
                <Link
                  key={i}
                  href={p.href}
                  className="flex w-full flex-col gap-2 overflow-hidden rounded-lg border border-[rgba(43,43,49,0.4)] bg-white shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
                >
                  <div className="relative h-[130px] w-full overflow-hidden rounded-t-lg bg-[#2b2b31] dark:bg-dak-surface">
                    <Image src="/illustrations/classroom-thumb-engineers.jpg" alt="" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
                    <h4 className="text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">
                      {p.name}
                    </h4>
                    <span className="text-sm leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-muted">{p.by}</span>
                    <span className="flex h-6 w-fit items-center rounded-[2px] border border-dak-cta bg-[rgba(148,54,251,0.1)] px-[9px] text-[10px] font-medium leading-[15px] text-dak-cta">
                      {p.size}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="flex w-full flex-col gap-6 lg:sticky lg:top-[116px] lg:min-w-0 lg:flex-[452] lg:self-start">
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium leading-8 text-[#020204] dark:text-dak-heading">Notifications</h3>
            <div className="flex flex-col gap-4">
              <div className="flex min-h-[120px] items-center gap-4 rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white p-[17px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                  <Image src="/avatars/avatar-1.jpg" alt="" fill className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="text-sm leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-body">Abc Workspace Invitation</p>
                  <p className="text-sm font-medium leading-5 text-[#020204] dark:text-dak-heading">
                    Mark Williams invited you as a collaborator
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button className={`${darkPill} w-20`}>Accept</button>
                    <button className="flex h-8 w-20 shrink-0 items-center justify-center rounded-lg border border-[#020204] px-2 text-sm font-medium text-[#020204] dark:border-dak-border dark:text-dak-heading">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex min-h-[120px] items-center gap-4 rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white p-[17px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
                <div className="relative size-[60px] shrink-0 overflow-hidden rounded-2xl border-[0.5px] border-[#020204] dark:border-dak-border">
                  <Image src="/illustrations/classroom-thumb-laptop.jpg" alt="" fill className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="text-sm leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-body">Workspace Code Accepted</p>
                  <p className="text-sm font-semibold leading-5 text-[#020204] dark:text-dak-heading">
                    Mark Williams Accepted your request
                  </p>
                  <div className="flex pt-1">
                    <Link href="/classrooms" className={`${darkPill} w-[132px]`}>
                      Open Classroom
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold leading-8 text-[#020204] dark:text-dak-heading">Business profiles to follow</h3>
            <div className={`flex flex-col gap-8 ${sidePanel}`}>
              <div className="flex flex-col gap-6">
                {businessFollows.map((biz, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                      <Image src={biz.avatar} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">
                        {biz.name}
                      </span>
                      <span className="truncate text-sm leading-5 text-[#2b2b31] dark:text-dak-muted">{biz.sub}</span>
                    </div>
                    <button className={`${darkPill} w-20`}>Follow</button>
                  </div>
                ))}
              </div>
              <Link
                href="/explore"
                className="flex items-center justify-center rounded-lg border border-[#2b2b31] py-[9px] text-base leading-6 text-[#020204] dark:border-dak-border dark:text-dak-heading"
              >
                See more in Explore
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold leading-8 text-[#020204] dark:text-dak-heading">My Classrooms</h3>
            <div className={`flex flex-col gap-4 ${sidePanel}`}>
              {myClassrooms.map((c, i) => (
                <div
                  key={i}
                  className="flex min-h-[105px] flex-col justify-center gap-2 rounded-2xl bg-[#2b2b31] px-6 py-4 drop-shadow-[0px_8px_4px_rgba(2,2,4,0.3)]"
                >
                  <div className="flex items-end justify-between gap-2">
                    <span className="truncate text-base leading-6 text-[#f3f3f3]">{c.name}</span>
                    <span className="text-base leading-6 text-white">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-xl bg-[#e0e0e0]">
                    <div className="h-full rounded-xl bg-dak-cta" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className="text-xs leading-[18px] text-white">{c.module}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
