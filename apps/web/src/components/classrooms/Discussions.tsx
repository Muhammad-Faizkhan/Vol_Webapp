"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { errorMessage, timeAgo, type Paged, type Post } from "@vol/api-client";
import { useApiQuery, useAuth, useInvalidate } from "@vol/api-client/react";
import { CommentThread } from "@/components/social/CommentThread";
import { LikeButton } from "@/components/social/LikeButton";
import { applyFormat, RichText, type Format } from "@/components/social/RichText";
import { useToast } from "@/components/ui/Toast";
import { Avatar, UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";
import { useUpload } from "@/lib/useUpload";

/** Classroom discussion threads: start a thread, like it, reply under it. */
export function Discussions({ classroomId }: { classroomId: string }) {
  const { data } = useApiQuery<Paged<Post>>(`/classrooms/${classroomId}/posts?limit=50`);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <Composer classroomId={classroomId} />
      {data?.items.length === 0 && <p className="text-sm text-[#45464d] dark:text-dak-muted">No discussions yet — start the first one.</p>}
      {data?.items.map((post) => {
        const expanded = openId === post.id || (openId === null && data.items[0].id === post.id);
        return <Thread key={post.id} post={post} expanded={expanded} onToggle={() => setOpenId(expanded ? "" : post.id)} />;
      })}
    </div>
  );
}

function Thread({ post, expanded, onToggle }: { post: Post; expanded: boolean; onToggle: () => void }) {
  const { user } = useAuth();
  const toast = useToast();
  const invalidate = useInvalidate();

  async function remove() {
    if (!window.confirm("Delete this discussion?")) return;
    try {
      await api.del(`/posts/${post.id}`);
      await invalidate("/classrooms");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  return (
    <div className="rounded border border-[#c6c6cd] bg-white dark:border-dak-border dark:bg-dak-surface">
      <div className="flex flex-col gap-4 border-b border-[#c6c6cd] px-6 py-6 dark:border-dak-border">
        <div className="flex items-start gap-4">
          <Avatar src={post.author.avatarUrl} name={post.author.name} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{post.title}</h2>
                <div className="flex items-center gap-1.5 text-sm text-[#45464d] dark:text-dak-muted">
                  <span className="font-medium">{post.author.name}</span>
                  <span>• {timeAgo(post.createdAt)}</span>
                </div>
              </div>
              {post.author.id === user?.id && (
                <button type="button" onClick={remove} className="shrink-0 pt-1.5 text-sm text-[#929292] hover:text-red-500">
                  Delete
                </button>
              )}
            </div>
            <RichText text={post.body} className="text-base text-[#2b2b31] dark:text-dak-body" />
            {post.imageUrl && (
              <div className="relative h-[260px] w-full overflow-hidden rounded-lg">
                <UserImage src={post.imageUrl} />
              </div>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-sm bg-[#f4f4f4] px-2 py-1 text-xs font-semibold text-[#2b2b31] dark:bg-dak-bg dark:text-dak-heading">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-6 pt-1 text-sm font-medium text-[#020204] dark:text-dak-heading">
              <LikeButton postId={post.id} liked={post.liked} count={post.likeCount} size={17} />
              <button type="button" onClick={onToggle} className="flex items-center gap-1">
                <Image src="/icons/comment-bubble.svg" alt="" width={16.667} height={16.667} className="dark:invert" />
                {post.commentCount} {post.commentCount === 1 ? "Reply" : "Replies"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {expanded && <CommentThread postId={post.id} postAuthorId={post.author.id} className="bg-[#f8f8f8] p-6 dark:bg-dak-bg" />}
    </div>
  );
}

function Composer({ classroomId }: { classroomId: string }) {
  const { user } = useAuth();
  const toast = useToast();
  const invalidate = useInvalidate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload((m) => toast(m, "error"));

  function format(kind: Format) {
    const el = textRef.current;
    if (!el) return;
    const next = applyFormat(body, el.selectionStart, el.selectionEnd, kind);
    setBody(next.value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(next.selectionStart, next.selectionEnd);
    });
  }

  function insertLink() {
    const url = window.prompt("Link URL (https://…)")?.trim();
    if (url) setBody((b) => `${b}${b && !b.endsWith(" ") ? " " : ""}${url}`);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return toast("Add a title and a message.", "error");
    setBusy(true);
    try {
      await api.post(`/classrooms/${classroomId}/posts`, { title: title.trim(), body: body.trim(), imageUrl });
      setTitle("");
      setBody("");
      setImageUrl(null);
      await invalidate(`/classrooms/${classroomId}`);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  const tool = "p-1";
  return (
    <form onSubmit={submit} className="flex items-start gap-4">
      <Avatar src={user?.avatarUrl} name={user?.name ?? ""} />
      <div className="flex flex-1 flex-col overflow-hidden rounded border border-[#c6c6cd] bg-[#eaeaea] dark:border-dak-border">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Discussion title"
          aria-label="Discussion title"
          className="border-b border-[rgba(43,43,49,0.4)] bg-white px-4 py-3 text-base font-medium text-[#020204] focus:outline-none dark:bg-dak-surface dark:text-dak-heading"
        />
        <div className="flex items-center gap-2 border-b border-[rgba(43,43,49,0.4)] bg-white px-2 py-2 dark:bg-dak-surface">
          <button type="button" aria-label="Bold" onClick={() => format("bold")} className={tool}>
            <Image src="/icons/format-bold.svg" alt="" width={7.8} height={10.5} className="dark:invert" />
          </button>
          <button type="button" aria-label="Italic" onClick={() => format("italic")} className={tool}>
            <Image src="/icons/format-italic.svg" alt="" width={9.75} height={10.5} className="dark:invert" />
          </button>
          <span className="h-4 w-px bg-[#2b2b31] dark:bg-dak-border" />
          <button type="button" aria-label="Bulleted list" onClick={() => format("bulleted")} className={tool}>
            <Image src="/icons/format-list-bulleted.svg" alt="" width={13.5} height={12} className="dark:invert" />
          </button>
          <button type="button" aria-label="Numbered list" onClick={() => format("numbered")} className={tool}>
            <Image src="/icons/format-list-numbered.svg" alt="" width={13.5} height={15} className="dark:invert" />
          </button>
          <span className="h-4 w-px bg-[#2b2b31] dark:bg-dak-border" />
          <button type="button" aria-label="Insert link" onClick={insertLink} className={tool}>
            <Image src="/icons/link.svg" alt="" width={16.667} height={8.333} className="dark:invert" />
          </button>
          <button type="button" aria-label="Insert image" onClick={() => fileRef.current?.click()} disabled={uploading} className={tool}>
            <Image src="/icons/image-insert.svg" alt="" width={15} height={15} className="dark:invert" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const url = await upload(e.target.files?.[0]);
              if (url) setImageUrl(url);
              e.target.value = "";
            }}
          />
          {imageUrl && (
            <span className="ml-auto flex items-center gap-2 text-xs text-[#45464d] dark:text-dak-muted">
              Image attached
              <button type="button" onClick={() => setImageUrl(null)} aria-label="Remove image">
                ✕
              </button>
            </span>
          )}
        </div>
        <textarea
          ref={textRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start a discussion with your class..."
          rows={4}
          className="min-h-[120px] w-full bg-[#eaeaea] px-4 py-4 text-base text-[#020204] placeholder:text-[rgba(69,70,77,0.5)] focus:outline-none dark:bg-dak-bg dark:text-dak-heading"
        />
        <div className="flex items-center justify-end border-t border-[rgba(43,43,49,0.4)] bg-white px-3 py-3 dark:bg-dak-surface">
          <button
            type="submit"
            disabled={busy || !title.trim() || !body.trim()}
            className="rounded bg-[#020204] px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-dak-cta"
          >
            {busy ? "Posting…" : "Post Discussion"}
          </button>
        </div>
      </div>
    </form>
  );
}
