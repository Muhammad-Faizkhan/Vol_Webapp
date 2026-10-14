"use client";

import type { ReactNode } from "react";
import { timeAgo, type CanvasCard } from "@vol/api-client";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";
import { plural } from "@/lib/format";

/** Canvas cards in the workspace "grid" style. `footer` renders under each card (e.g. a folder picker). */
export function CanvasGrid({ canvases, footer }: { canvases: CanvasCard[]; footer?: (c: CanvasCard) => ReactNode }) {
  return (
    <>
      {canvases.map((c) => (
        <div key={c.id} className="flex flex-col gap-2">
          <WorkspaceCard
            variant="grid"
            href={`/canvas/${c.id}`}
            title={c.title}
            meta={c.workspace.name}
            metaSecondary={`Edited ${timeAgo(c.updatedAt)} · ${plural(c.productCount, "Product")}`}
            collaboratorCount={c.collaboratorCount}
            updatedTag={c.visibility === "PUBLIC" ? "PUBLIC" : undefined}
            imageSrc={c.thumbnailUrl ?? undefined}
          />
          {footer?.(c)}
        </div>
      ))}
    </>
  );
}
