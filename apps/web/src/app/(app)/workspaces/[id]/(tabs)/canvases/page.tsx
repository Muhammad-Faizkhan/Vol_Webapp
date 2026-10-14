"use client";

import { useParams } from "next/navigation";
import type { CanvasCard, Paged, WorkspaceDetail } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { CreateCanvasButton } from "@/components/canvas/CreateCanvasButton";
import { EmptyState, LoadingGrid } from "@/components/ui/States";
import { ActivityPanel } from "@/components/workspace/ActivityPanel";
import { CanvasGrid } from "@/components/workspace/CanvasGrid";
import { MembersPanel } from "@/components/workspace/MembersPanel";

export default function WorkspaceCanvasesPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ws } = useApiQuery<WorkspaceDetail>(`/workspaces/${id}`);
  const { data } = useApiQuery<Paged<CanvasCard>>(`/workspaces/${id}/canvases?limit=100`);
  const canEdit = ws?.myRole && ws.myRole !== "VIEWER";

  return (
    <div className="flex flex-col gap-8 xl:flex-row">
      <div className="grid min-w-0 grid-cols-[repeat(auto-fill,minmax(260px,1fr))] content-start gap-6 xl:flex-[2]">
        {!data ? (
          <div className="col-span-full">
            <LoadingGrid count={4} />
          </div>
        ) : data.items.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No canvases yet"
              body={canEdit ? "Create the first canvas for this workspace." : "Canvases shared here will appear in this list."}
              action={
                canEdit ? (
                  <CreateCanvasButton workspaceId={id} className="mt-2 rounded-xl bg-dak-cta px-5 py-3 text-sm font-medium text-white">
                    Create Canvas
                  </CreateCanvasButton>
                ) : undefined
              }
            />
          </div>
        ) : (
          <CanvasGrid canvases={data.items} />
        )}
      </div>
      {ws?.myRole && (
        <div className="flex w-full flex-col gap-6 xl:w-[360px] xl:shrink-0">
          <MembersPanel workspaceId={id} myRole={ws.myRole} />
          <ActivityPanel workspaceId={id} />
        </div>
      )}
    </div>
  );
}
