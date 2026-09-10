import { ActivityPanel } from "@/components/workspace/ActivityPanel";
import { MembersPanel } from "@/components/workspace/MembersPanel";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";

const canvases = Array.from({ length: 8 }).map((_, i) => ({
  href: `/canvas/${i + 1}`,
  title: "Lorem Ipsum Title",
  meta: "Lorem Ipsum Workspace",
  metaSecondary: "Edited 12min ago . 4 Products",
  collaboratorCount: 3,
}));

export default function WorkspaceCanvasesPage() {
  return (
    <div className="flex gap-8">
      <div className="flex flex-[2] flex-wrap gap-6">
        {canvases.map((c, i) => (
          <WorkspaceCard key={i} variant="grid" {...c} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <MembersPanel />
        <ActivityPanel />
      </div>
    </div>
  );
}
