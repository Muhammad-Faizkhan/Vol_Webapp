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
    <div className="flex gap-6">
      <div className="w-[233px] shrink-0 overflow-hidden rounded-lg border border-light-border">
        <div className="bg-[#e7e8e9] px-6 py-3 text-sm font-medium tracking-[0.28px] text-auth-navy">
          Folders
        </div>
        <div className="flex flex-col bg-white p-2">
          {folders.map((folder) => (
            <div
              key={folder.name}
              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm ${
                folder.active ? "bg-auth-navy text-white" : "text-auth-navy"
              }`}
            >
              <span>{folder.name}</span>
              <span>{folder.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-[2] flex-wrap gap-6">
        {canvases.map((c, i) => (
          <WorkspaceCard key={i} variant="grid" {...c} />
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <MembersPanel showManageRoles={false} />
        <ActivityPanel />
      </div>
    </div>
  );
}
