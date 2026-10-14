"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { errorMessage, timeAgo, type Comment, type Paged } from "@vol/api-client";
import { useApiQuery, useAuth, useInvalidate } from "@vol/api-client/react";
import { profileHref } from "@/components/cards/FeedPostCard";
import { ReportButton } from "@/components/social/ReportButton";
import { useToast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

/** Comments under a post (Discover posts and classroom discussions). */
export function CommentThread({ postId, postAuthorId, className = "" }: { postId: string; postAuthorId: string; className?: string }) {
  const { user } = useAuth();
  const toast = useToast();
  const invalidate = useInvalidate();
  const key = `/posts/${postId}/comments?limit=100`;
  const { data, mutate } = useApiQuery<Paged<Comment>>(key);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setBusy(true);
    try {
      const comment = await api.post<Comment>(`/posts/${postId}/comments`, { body });
      setText("");
      await mutate(data ? { ...data, items: [...data.items, comment], total: data.total + 1 } : undefined, { revalidate: false });
      await invalidate(`/posts/${postId}`, "/classrooms");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      await api.del(`/comments/${id}`);
      await mutate();
      await invalidate(`/posts/${postId}`);
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  return (
    <div id="comments" className={`flex flex-col gap-4 ${className}`}>
      {data?.items.map((c) => (
        <div key={c.id} className="flex gap-3">
          <Link href={profileHref(c.author)}>
            <Avatar src={c.author.avatarUrl} name={c.author.name} size={36} />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-xl bg-[#f2f2f3] px-4 py-3 dark:bg-dak-bg">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href={profileHref(c.author)} className="font-semibold text-auth-navy dark:text-dak-heading">
                {c.author.name}
              </Link>
              <span className="text-xs text-[#929292] dark:text-dak-muted">• {timeAgo(c.createdAt)}</span>
              <span className="ml-auto flex gap-3">
                {(c.isMine || postAuthorId === user?.id) && (
                  <button type="button" onClick={() => remove(c.id)} className="text-xs text-[#929292] hover:text-red-500">
                    Delete
                  </button>
                )}
                {!c.isMine && <ReportButton targetType="COMMENT" targetId={c.id} className="text-xs text-[#929292] hover:text-red-500" />}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-auth-navy dark:text-dak-body">{c.body}</p>
          </div>
        </div>
      ))}
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={5000}
          placeholder="Add a comment..."
          aria-label="Add a comment"
          className="h-14 min-w-0 flex-1 rounded-lg border border-light-border bg-white px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading dark:placeholder:text-dak-muted"
        />
        <button type="submit" disabled={busy || !text.trim()} className="h-14 shrink-0 rounded-lg bg-dak-cta px-5 text-base font-medium text-white disabled:opacity-50">
          Post
        </button>
      </form>
    </div>
  );
}
