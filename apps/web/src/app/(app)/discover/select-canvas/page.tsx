"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessage, timeAgo, type CanvasCard, type Paged, type Post } from "@vol/api-client";
import { useApiQuery, useInvalidate, withQuery } from "@vol/api-client/react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";
import { plural, POST_DRAFT_KEY } from "@/lib/format";
import DiscoverPage from "../page";

type Draft = { title: string; category: string; description: string; tags: string[]; visibility: "public" | "private" };

export default function SelectCanvasModalPage() {
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const { data } = useApiQuery<Paged<CanvasCard>>(withQuery("/canvases/recent", { q: q.trim(), limit: 24 }));

  useEffect(() => {
    const saved = sessionStorage.getItem(POST_DRAFT_KEY);
    if (!saved) {
      router.replace("/discover/create-post");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(JSON.parse(saved));
  }, [router]);

  async function publish(canvasId: string | null) {
    if (!draft) return;
    setPosting(true);
    try {
      const post = await api.post<Post>("/posts", {
        title: draft.title,
        body: draft.description,
        category: draft.category || undefined,
        tags: draft.tags,
        visibility: draft.visibility === "private" ? "PRIVATE" : "PUBLIC",
        canvasId,
      });
      sessionStorage.removeItem(POST_DRAFT_KEY);
      await invalidate("/posts");
      toast("Posted to the feed");
      router.push(`/discover/post/${post.id}`);
    } catch (err) {
      toast(errorMessage(err), "error");
      setPosting(false);
    }
  }

  return (
    <>
      <DiscoverPage />
      <Modal maxWidth={1420}>
        <div className="flex items-center justify-between gap-3 border-b border-light-border px-4 py-4 dark:border-dak-border sm:px-[50px] sm:py-6">
          <Link href="/discover/create-post" className="flex items-center gap-2 text-lg text-auth-navy dark:text-dak-heading">
            ✕ Cancel
          </Link>
          <h2 className="text-xl font-semibold text-auth-navy dark:text-dak-heading sm:text-2xl">Select a Canvas</h2>
          <div className="w-[60px] sm:w-[80px]" />
        </div>

        <div className="border-b border-light-border/50 bg-[#f4f4f4] px-4 py-4 dark:border-dak-border dark:bg-dak-bg sm:px-10 sm:py-6 lg:px-[120px]">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search canvases by name or project..."
            className="h-11 w-full rounded border border-light-border bg-white px-4 text-sm text-[#45464d] focus:outline-none dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
        </div>

        <div className="grid max-h-[55dvh] grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 overflow-y-auto px-4 py-4 dark:bg-dak-surface sm:px-10 sm:py-6 lg:px-[100px]">
          {data?.items.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-[#929292] dark:text-dak-muted">No canvases to attach — you can skip and post without one.</p>
          )}
          {data?.items.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={selected === c.id}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              className={`flex flex-col overflow-hidden rounded-lg border-2 bg-white text-left dark:bg-dak-surface ${selected === c.id ? "border-dak-cta" : "border-transparent shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)]"}`}
            >
              <span className="relative block h-[130px] bg-auth-navy dark:bg-dak-bg">
                <UserImage src={c.thumbnailUrl} fallback="/illustrations/canvas-thumb-moodboard.png" />
                {selected === c.id && <span className="absolute right-3 top-3 rounded-full bg-dak-cta px-2 py-0.5 text-xs font-semibold text-white">Selected</span>}
              </span>
              <span className="flex flex-col gap-1 p-4">
                <span className="truncate text-base font-medium text-[#020204] dark:text-dak-heading">{c.title}</span>
                <span className="truncate text-sm text-auth-slate dark:text-dak-body">{c.workspace.name}</span>
                <span className="text-xs text-[#929292] dark:text-dak-muted">
                  Edited {timeAgo(c.updatedAt)} · {plural(c.productCount, "Product")}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-light-border px-4 py-4 dark:border-dak-border sm:flex-row sm:justify-between sm:px-8 sm:py-5">
          <button
            type="button"
            onClick={() => publish(null)}
            disabled={posting || !draft}
            className="rounded-lg bg-[#f2f2f3] px-6 py-3 text-center text-base font-medium text-auth-navy disabled:opacity-60 dark:bg-dak-bg dark:text-dak-heading"
          >
            Skip &amp; Post
          </button>
          <button
            type="button"
            onClick={() => publish(selected)}
            disabled={posting || !draft || !selected}
            className="flex items-center justify-center gap-2 rounded-lg bg-auth-navy px-6 py-3 text-base font-medium text-white disabled:opacity-60 dark:bg-dak-cta"
          >
            {posting ? "Posting…" : "Continue →"}
          </button>
        </div>
      </Modal>
    </>
  );
}
