"use client";

import { useState } from "react";
import { timeAgo, type CanvasCard, type Paged } from "@vol/api-client";
import { useApiQuery, withQuery } from "@vol/api-client/react";
import { Modal } from "@/components/ui/Modal";
import { UserImage } from "@/components/ui/UserImage";

/** Modal list of the user's canvases (search + pick). */
export function CanvasPicker({ title, onPick, onClose }: { title: string; onPick: (c: CanvasCard) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const { data } = useApiQuery<Paged<CanvasCard>>(withQuery("/canvases/recent", { q: q.trim(), limit: 20 }));
  return (
    <Modal maxWidth={560}>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-auth-navy dark:text-dak-heading">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-xl text-auth-navy dark:text-dak-heading">
            ✕
          </button>
        </div>
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search canvases by name…"
          className="h-11 rounded-lg border border-light-border bg-white px-3 text-sm text-auth-navy focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
        />
        <div className="flex max-h-[50dvh] flex-col gap-2 overflow-y-auto">
          {data?.items.length === 0 && <p className="py-6 text-center text-sm text-[#929292] dark:text-dak-muted">No canvases found. Create one from a workspace first.</p>}
          {data?.items.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c)}
              className="flex items-center gap-3 rounded-xl border border-light-border p-3 text-left hover:border-dak-cta dark:border-dak-border"
            >
              <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-auth-navy dark:bg-dak-cta">
                <UserImage src={c.thumbnailUrl} fallback="/illustrations/canvas-thumb-mortar-pattern.jpg" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{c.title}</span>
                <span className="truncate text-xs text-[#929292] dark:text-dak-muted">
                  {c.workspace.name} · edited {timeAgo(c.updatedAt)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
