"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { errorMessage, type CanvasDetail, type Post } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { FullPageSpinner } from "@/components/auth/RequireAuth";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { Avatar } from "@/components/ui/UserImage";
import { CanvasMissing } from "@/components/canvas/CanvasMissing";

/** Read-only view of the canvas a Discover post shares. */
export default function CanvasFromPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { data: post, error: postError } = useApiQuery<Post>(`/posts/${postId}`);
  const { data: canvas, error } = useApiQuery<CanvasDetail>(post?.canvas ? `/canvases/${post.canvas.id}` : null);

  if (postError || error) return <CanvasMissing message={errorMessage(postError ?? error)} />;
  if (post && !post.canvas) return <CanvasMissing message="This post doesn't share a canvas." />;
  if (!post || !canvas) return <FullPageSpinner />;

  return (
    <div className="flex h-dvh w-full flex-col bg-white dark:bg-dak-bg">
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-light-border bg-white px-4 py-2 dark:border-dak-border dark:bg-dak-surface sm:flex-nowrap sm:px-6 sm:py-0">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={`/discover/post/${post.id}`}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#f2f2f3] px-4 py-2 text-sm font-medium text-auth-navy dark:bg-dak-bg dark:text-dak-heading"
          >
            <Image src="/icons/arrow-narrow-right.svg" alt="" width={16} height={16} className="-scale-y-100 rotate-180 dark:hidden" />
            <Image src="/icons/arrow-narrow-right-light.svg" alt="" width={16} height={16} className="hidden -scale-y-100 rotate-180 dark:block" />
            Back to post
          </Link>
          <span className="truncate text-base font-medium text-auth-navy dark:text-dak-heading">/ {canvas.title}</span>
        </div>

        <div className="hidden items-center gap-2 text-base font-medium text-auth-navy dark:text-dak-heading md:flex">
          <Avatar src={post.author.avatarUrl} name={post.author.name} size={32} />
          Shared by {post.author.name}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {canvas.canEdit ? (
            <Link href={`/canvas/${canvas.id}`} className="rounded-lg bg-dak-cta px-3 py-1.5 text-sm font-semibold text-white">
              Open in editor
            </Link>
          ) : (
            <span className="rounded-lg bg-[#efefef] px-3 py-1.5 text-sm font-semibold text-auth-navy dark:bg-dak-bg dark:text-dak-heading">View only</span>
          )}
        </div>
      </header>
      <div className="relative min-h-0 flex-1">
        <CanvasEditor doc={canvas.data?.objects ? canvas.data : { objects: [] }} readOnly authorName="" onChange={() => {}} />
      </div>
    </div>
  );
}
