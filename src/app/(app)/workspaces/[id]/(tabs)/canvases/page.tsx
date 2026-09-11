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
    <div className="flex flex-col gap-8 xl:flex-row">
      <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 xl:flex-[2]">
        {canvases.map((c, i) => (
          <WorkspaceCard key={i} variant="grid" {...c} />
        ))}
      </div>
      <div className="flex w-full flex-col gap-6 xl:w-[360px] xl:shrink-0">
        <MembersPanel />
        <ActivityPanel />
      </div>
    </div>
  );
}
