"use client";

import Image from "next/image";
import { useState } from "react";
import { errorMessage } from "@vol/api-client";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

export function LikeButton({ postId, liked, count, size = 21 }: { postId: string; liked: boolean; count: number; size?: number }) {
  const toast = useToast();
  const [state, setState] = useState({ liked, count });
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    const next = !state.liked;
    setState((s) => ({ liked: next, count: s.count + (next ? 1 : -1) })); // optimistic
    setBusy(true);
    try {
      const res = next ? await api.post<{ likeCount: number }>(`/posts/${postId}/like`) : await api.del<{ likeCount: number }>(`/posts/${postId}/like`);
      setState({ liked: next, count: res.likeCount });
    } catch (err) {
      setState((s) => ({ liked: !next, count: s.count + (next ? -1 : 1) }));
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={state.liked} aria-label={state.liked ? "Unlike" : "Like"} className="flex items-center gap-2">
      <Image src="/icons/like.svg" alt="" width={size} height={size - 1} className={state.liked ? "" : "opacity-50 grayscale dark:invert"} />
      <span className={state.liked ? "text-dak-cta" : ""}>{state.count}</span>
    </button>
  );
}
