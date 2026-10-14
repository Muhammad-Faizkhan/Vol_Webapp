"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { errorMessage, type CanvasCard } from "@vol/api-client";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

/**
 * Creates a canvas and opens it in the editor. Without a workspace it lands in the user's most
 * recently used workspace (or a new personal one).
 */
export function CreateCanvasButton({
  workspaceId,
  folderId,
  className,
  children,
}: {
  workspaceId?: string;
  folderId?: string;
  className: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    try {
      const canvas = await api.post<CanvasCard>("/canvases", { workspaceId, folderId });
      router.push(`/canvas/${canvas.id}`);
    } catch (err) {
      toast(errorMessage(err), "error");
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={create} disabled={busy} className={`${className} disabled:opacity-60`}>
      {children}
    </button>
  );
}
