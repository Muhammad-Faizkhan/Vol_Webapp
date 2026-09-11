import { ActivityPanel } from "@/components/workspace/ActivityPanel";
import { MembersPanel } from "@/components/workspace/MembersPanel";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";

const folders = [
  { name: "All Canvases", count: 8, active: true },
  { name: "Set-out Plans", count: 3, active: false },
  { name: "Customer-facing", count: 3, active: false },
];

const canvases = Array.from({ length: 8 }).map((_, i) => ({
  href: `/canvas/${i + 1}`,
  title: "Lorem Ipsum Title",
  meta: "Lorem Ipsum Workspace",
  metaSecondary: "Edited 12min ago . 4 Products",
  collaboratorCount: 3,
}));

export default function WorkspaceFilesPage() {
  return (
    <div className="flex flex-col gap-6 2xl:flex-row">
      <div className="w-full shrink-0 overflow-hidden rounded-lg border border-light-border dark:border-dak-border 2xl:w-[233px]">
        <div className="bg-app-dark-surface px-6 py-3 text-sm font-medium tracking-[0.28px] text-white">
          Folders
        </div>
        <div className="flex flex-col bg-white p-2 dark:bg-dak-surface">
          {folders.map((folder) => (
            <div
              key={folder.name}
              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm ${
                folder.active ? "bg-app-dark-surface text-white" : "text-auth-navy dark:text-dak-heading"
              }`}
            >
              <span>{folder.name}</span>
              <span>{folder.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 2xl:flex-[2]">
        {canvases.map((c, i) => (
          <WorkspaceCard key={i} variant="grid" {...c} />
        ))}
      </div>

      <div className="flex w-full flex-col gap-6 2xl:w-[360px] 2xl:shrink-0">
        <MembersPanel showManageRoles={false} />
        <ActivityPanel />
      </div>
    </div>
  );
}
