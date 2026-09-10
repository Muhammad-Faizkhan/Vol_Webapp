import Image from "next/image";
import Link from "next/link";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";

const workspaces = Array.from({ length: 6 }).map((_, i) => ({
  href: `/workspaces/${i + 1}`,
  title: "Abc Workspace",
  meta: "8 canvases · 5 members",
  metaSecondary: "Edited 12min ago . 4 Products",
  collaboratorCount: 3,
}));

export default function WorkspacesPage() {
  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex items-center gap-6">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-auth-navy">
          <Image src="/illustrations/auth-placeholder.svg" alt="" width={24} height={24} />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
            Workspaces
          </h1>
          <p className="text-base text-auth-slate">
            8 Lorem Ipsum is simply dummy text of the printing and typesetting
          </p>
        </div>
      </div>

      <div className="flex gap-6 border-b border-light-border">
        <button className="flex flex-col items-center gap-2 pb-2 text-lg font-medium text-auth-navy">
          Add by Business Profiles
          <span className="h-1 w-full rounded-full bg-auth-navy" />
        </button>
        <button className="flex flex-col items-center gap-2 pb-2 text-lg font-medium text-[#929292]">
          My Workspaces
          <span className="h-1 w-full rounded-full bg-transparent" />
        </button>
      </div>

      <div className="flex flex-wrap gap-6">
        {workspaces.map((ws, i) => (
          <WorkspaceCard key={i} variant="grid" {...ws} />
        ))}
      </div>
    </div>
  );
}
