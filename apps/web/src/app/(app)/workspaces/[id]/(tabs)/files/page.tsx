"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { errorMessage, type CanvasCard, type Folder, type Paged, type WorkspaceDetail } from "@vol/api-client";
import { useApiQuery, useInvalidate, withQuery } from "@vol/api-client/react";
import { EmptyState, LoadingGrid } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { ActivityPanel } from "@/components/workspace/ActivityPanel";
import { CanvasGrid } from "@/components/workspace/CanvasGrid";
import { MembersPanel } from "@/components/workspace/MembersPanel";
import { api } from "@/lib/api";

export default function WorkspaceFilesPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const invalidate = useInvalidate();
  const [folderId, setFolderId] = useState<string | null>(null);
  const [newFolder, setNewFolder] = useState<string | null>(null);
  const { data: ws } = useApiQuery<WorkspaceDetail>(`/workspaces/${id}`);
  const { data: folders } = useApiQuery<{ total: number; folders: Folder[] }>(`/workspaces/${id}/folders`);
  const { data } = useApiQuery<Paged<CanvasCard>>(withQuery(`/workspaces/${id}/canvases`, { folderId, limit: 100 }));
  const canEdit = ws?.myRole && ws.myRole !== "VIEWER";

  const refresh = () => invalidate(`/workspaces/${id}/folders`, `/workspaces/${id}/canvases`);

  async function createFolder() {
    const name = newFolder?.trim();
    setNewFolder(null);
    if (!name) return;
    try {
      await api.post(`/workspaces/${id}/folders`, { name });
      await refresh();
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  async function deleteFolder(folder: Folder) {
    if (!window.confirm(`Delete the folder "${folder.name}"? Its canvases stay in the workspace.`)) return;
    try {
      await api.del(`/workspaces/${id}/folders/${folder.id}`);
      if (folderId === folder.id) setFolderId(null);
      await refresh();
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  async function moveCanvas(canvasId: string, target: string) {
    try {
      await api.patch(`/canvases/${canvasId}`, { folderId: target || null });
      await refresh();
      toast("Canvas moved");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  const rows: { id: string | null; name: string; count: number; folder?: Folder }[] = [
    { id: null, name: "All Canvases", count: folders?.total ?? 0 },
    ...(folders?.folders ?? []).map((f) => ({ id: f.id, name: f.name, count: f.canvasCount, folder: f })),
  ];

  return (
    <div className="flex flex-col gap-6 2xl:flex-row">
      <div className="w-full shrink-0 self-start overflow-hidden rounded-lg border border-light-border dark:border-dak-border 2xl:w-[233px]">
        <div className="bg-app-dark-surface px-6 py-3 text-sm font-medium tracking-[0.28px] text-white">Folders</div>
        <div className="flex flex-col bg-white p-2 dark:bg-dak-surface">
          {rows.map((row) => (
            <div key={row.id ?? "all"} className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFolderId(row.id)}
                className={`flex flex-1 items-center justify-between rounded-lg px-4 py-3 text-sm ${
                  folderId === row.id ? "bg-app-dark-surface text-white" : "text-auth-navy dark:text-dak-heading"
                }`}
              >
                <span className="truncate">{row.name}</span>
                <span>{row.count}</span>
              </button>
              {canEdit && row.folder && (
                <button
                  type="button"
                  aria-label={`Delete folder ${row.name}`}
                  onClick={() => deleteFolder(row.folder!)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#929292] opacity-0 hover:bg-red-50 hover:text-red-500 focus:opacity-100 group-hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {canEdit &&
            (newFolder === null ? (
              <button type="button" onClick={() => setNewFolder("")} className="rounded-lg px-4 py-3 text-left text-sm font-medium text-dak-cta">
                + New folder
              </button>
            ) : (
              <input
                autoFocus
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                onBlur={createFolder}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void createFolder();
                  if (e.key === "Escape") setNewFolder(null);
                }}
                placeholder="Folder name"
                className="m-2 h-10 rounded-lg border border-dak-cta bg-transparent px-3 text-sm text-auth-navy focus:outline-none dark:text-dak-heading"
              />
            ))}
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-[repeat(auto-fill,minmax(260px,1fr))] content-start gap-6 2xl:flex-[2]">
        {!data ? (
          <div className="col-span-full">
            <LoadingGrid count={4} />
          </div>
        ) : data.items.length === 0 ? (
          <div className="col-span-full">
            <EmptyState title="This folder is empty" body={canEdit ? "Move canvases here from All Canvases." : undefined} />
          </div>
        ) : (
          <CanvasGrid
            canvases={data.items}
            footer={
              canEdit && folders
                ? (c) => (
                    <select
                      aria-label={`Move ${c.title} to folder`}
                      value={c.folderId ?? ""}
                      onChange={(e) => moveCanvas(c.id, e.target.value)}
                      className="h-9 rounded-lg border border-light-border bg-white px-2 text-sm text-auth-navy dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading"
                    >
                      <option value="">No folder</option>
                      {folders.folders.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  )
                : undefined
            }
          />
        )}
      </div>

      {ws?.myRole && (
        <div className="flex w-full flex-col gap-6 2xl:w-[360px] 2xl:shrink-0">
          <MembersPanel workspaceId={id} myRole={ws.myRole} showManageRoles={false} />
          <ActivityPanel workspaceId={id} />
        </div>
      )}
    </div>
  );
}
