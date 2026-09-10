import Image from "next/image";
import Link from "next/link";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";

const stats = [
  { label: "ACTIVE WORKSPACES", value: "6", note: "+1 this week" },
  { label: "CANVASES", value: "24", note: "4 shared publicly" },
];

const workspaces = [
  {
    href: "/workspaces/1",
    title: "Lorem Ipsum Title",
    workspace: "Lorem Ipsum Workspace",
    editedAgo: "Edited 12min ago",
    updatedTag: "UPDATED 2H AGO",
    collaboratorInitials: ["A", "J"],
    collaboratorCount: 2,
  },
  {
    href: "/workspaces/2",
    title: "Lorem Ipsum Title",
    workspace: "Lorem Ipsum Workspace",
    editedAgo: "Edited 12min ago",
    updatedTag: "UPDATED 2H AGO",
    collaboratorInitials: ["A", "J"],
    collaboratorCount: 2,
  },
];

const classrooms = [
  { name: "Lorem Ipsum Class", sub: "Abc Class", tags: ["10 Enrolled", "Public Preview"] },
  { name: "Lorem Ipsum Class", sub: "Abc Class", tags: ["10 Enrolled", "Code Required"] },
];

const canvases = [
  { title: "Lorem Ipsum Dor Amous Title", workspace: "Lorem Ipsum Workspace", ago: "12min ago", visibility: "Public" },
  { title: "Lorem Ipsum Dor Amous Title", workspace: "Lorem Ipsum Workspace", ago: "12min ago", visibility: "Private" },
  { title: "Lorem Ipsum Dor Amous Title", workspace: "Lorem Ipsum Workspace", ago: "12min ago", visibility: "Public" },
  { title: "Lorem Ipsum Dor Amous Title", workspace: "Lorem Ipsum Workspace", ago: "12min ago", visibility: "Public" },
];

const businessFollows = [
  { name: "Abc Business", sub: "Distributor. 1,203 products" },
  { name: "Abc Business", sub: "Distributor. 1,203 products" },
  { name: "Abc Business", sub: "Distributor. 1,203 products" },
  { name: "Abc Business", sub: "Distributor. 1,203 products" },
];

export default function HomePage() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
            Good morning, Alex.
          </h1>
          <p className="text-base text-auth-slate">
            Here&apos;s what&apos;s happening across your network.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <button className="flex h-14 items-center gap-4 rounded-xl border border-light-border bg-[#f8f9ff] px-[17px] text-base text-auth-navy shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            Create Canvas
          </button>
          <Link
            href="/workspaces/create"
            className="flex h-14 items-center gap-4 rounded-xl bg-auth-navy px-4 text-base text-white"
          >
            Create Workspace
          </Link>
        </div>
      </div>

      <div className="flex gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex w-60 flex-col items-center gap-4 rounded-lg border border-light-border bg-[#f8f9ff] px-[25px] py-[17px]"
          >
            <span className="text-sm font-medium tracking-[0.28px] text-auth-navy">
              {stat.label}
            </span>
            <p className="text-2xl font-medium text-auth-navy">
              {stat.value} <span className="text-sm text-[#889298]">{stat.note}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-8">
        <div className="flex flex-[2] flex-col gap-8">
          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-medium text-auth-navy">Recent Workspace</h3>
              <Link href="/workspaces" className="text-base font-medium text-auth-navy">
                View All Workspaces
              </Link>
            </div>
            <div className="flex gap-4">
              {workspaces.map((ws, i) => (
                <WorkspaceCard key={i} {...ws} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-medium text-auth-navy">Featured Classrooms</h3>
              <Link href="/classrooms" className="text-base font-medium text-auth-navy">
                Browse Classrooms
              </Link>
            </div>
            <div className="flex gap-4">
              {classrooms.map((c, i) => (
                <div
                  key={i}
                  className="flex h-[100px] w-[460px] items-center gap-4 rounded-2xl border border-light-border bg-[#f8f9ff] px-6"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-auth-navy">
                    <Image src="/illustrations/auth-placeholder.svg" alt="" width={20} height={20} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium tracking-[0.28px] text-auth-navy">
                        {c.name}
                      </span>
                      <span className="text-xs text-[#929292]">{c.sub}</span>
                    </div>
                    <div className="flex gap-2">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm border border-light-border bg-[#f8f9ff] px-[9px] py-[5px] text-[10px] font-medium text-auth-navy"
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
              <h3 className="text-2xl font-medium text-auth-navy">Recent Canvases</h3>
              <Link href="/canvas/1" className="text-base font-medium text-auth-navy">
                Open Last Canvas
              </Link>
            </div>
            <div className="w-full overflow-hidden rounded-2xl border border-light-border">
              <div className="flex h-14 items-center gap-[62px] border border-auth-navy bg-[#e7e8e9] px-6 text-base text-auth-navy">
                <span className="w-[230px]">Canvas</span>
                <span className="w-[193px]">Workspace</span>
                <span className="w-[74px]">Last Edited</span>
                <span>Visibility</span>
              </div>
              <div className="flex flex-col bg-[#f8f9ff]">
                {canvases.map((row, i) => (
                  <div
                    key={i}
                    className={`flex h-14 items-center gap-[62px] px-6 ${i !== canvases.length - 1 ? "border-b border-[#c6c6cd]/50" : ""}`}
                  >
                    <div className="flex w-[230px] items-center gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-auth-navy">
                        <Image src="/illustrations/auth-placeholder.svg" alt="" width={16} height={16} />
                      </div>
                      <span className="text-base text-auth-navy">{row.title}</span>
                    </div>
                    <span className="w-[193px] text-base text-[#929292]">{row.workspace}</span>
                    <span className="w-[74px] text-base text-[#929292]">{row.ago}</span>
                    <span className="rounded-lg border border-light-border bg-auth-navy/10 px-[9px] py-[5px] text-sm font-medium text-auth-navy">
                      {row.visibility}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-medium text-auth-navy">Notifications</h3>
            <div className="flex items-start gap-4 rounded-lg border border-light-border bg-[#f8f9ff] p-[17px]">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-auth-navy/15">
                <Image src="/icons/user-rounded-small.svg" alt="" width={20} height={20} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-auth-navy">Abc Workspace Invitation</p>
                <p className="text-sm text-auth-navy">Mark Williams invited you as a collaborator</p>
                <div className="flex gap-2 pt-1">
                  <button className="rounded-lg bg-auth-navy px-3 py-1.5 text-xs font-medium text-white">
                    Accept
                  </button>
                  <button className="rounded-lg border border-light-border px-3 py-1.5 text-xs font-medium text-auth-navy">
                    Decline
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-light-border bg-[#f8f9ff] p-[17px]">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-auth-navy">
                <Image src="/illustrations/auth-placeholder.svg" alt="" width={20} height={20} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-auth-navy">Workspace Code Accepted</p>
                <p className="text-sm text-auth-navy">Mark Williams Accepted your request</p>
                <button className="mt-1 w-fit rounded-lg bg-auth-navy px-3 py-1.5 text-xs font-medium text-white">
                  Open Classroom
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-medium text-auth-navy">Business profiles to follow</h3>
            <div className="flex flex-col rounded-lg border border-light-border bg-white">
              {businessFollows.map((biz, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-4 ${i !== 0 ? "border-t border-light-border" : ""}`}
                >
                  <div className="size-10 shrink-0 rounded-full bg-auth-navy/15" />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-auth-navy">{biz.name}</span>
                    <span className="text-xs text-[#929292]">{biz.sub}</span>
                  </div>
                  <button className="rounded-lg bg-auth-navy px-3 py-1.5 text-xs font-medium text-white">
                    Follow
                  </button>
                </div>
              ))}
              <Link
                href="/explore"
                className="flex items-center justify-center bg-[#f2f2f3] py-3 text-sm font-medium text-auth-navy"
              >
                See more in Explore
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
