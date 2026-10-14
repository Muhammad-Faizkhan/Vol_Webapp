"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { errorMessage, timeAgo, titleCase, type Post } from "@vol/api-client";
import { useAuth, useInvalidate } from "@vol/api-client/react";
import { LikeButton } from "@/components/social/LikeButton";
import { ReportButton } from "@/components/social/ReportButton";
import { RichText } from "@/components/social/RichText";
import { useToast } from "@/components/ui/Toast";
import { Avatar, UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

export const profileHref = (u: { id: string; accountType: string }) => (u.accountType === "BUSINESS" ? `/business/${u.id}` : `/profile/${u.id}`);

export function FeedPostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const toast = useToast();
  const invalidate = useInvalidate();
  const [menu, setMenu] = useState(false);
  const mine = post.author.id === user?.id;
  const href = `/discover/post/${post.id}`;

  async function remove() {
    setMenu(false);
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.del(`/posts/${post.id}`);
      await invalidate("/posts");
      toast("Post deleted");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 dark:border-dak-border dark:bg-dak-surface sm:p-[25px]">
      <div className="flex items-start justify-between">
        <Link href={profileHref(post.author)} className="flex min-w-0 items-center gap-3">
          <Avatar src={post.author.avatarUrl} name={post.author.name} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">{post.author.name}</span>
            <span className="flex gap-1 whitespace-nowrap text-sm leading-5 text-[#929292] dark:text-dak-muted">
              <span>{post.author.specialty ?? titleCase(post.author.accountType)}</span>
              <span>•</span>
              <span>{timeAgo(post.createdAt)}</span>
              {post.visibility === "PRIVATE" && (
                <>
                  <span>•</span>
                  <span>Private</span>
                </>
              )}
            </span>
          </div>
        </Link>
        <div className="relative">
          <button type="button" aria-label="More" onClick={() => setMenu((v) => !v)} className="flex items-center justify-center px-1 pb-2.5 pt-1">
            <Image src="/icons/dots-horizontal.svg" alt="" width={16} height={4} className="dark:invert" />
          </button>
          {menu && (
            <>
              <button type="button" aria-label="Close menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenu(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-light-border bg-white py-1 shadow-lg dark:border-dak-border dark:bg-dak-surface">
                {mine ? (
                  <button type="button" onClick={remove} className="flex min-h-10 w-full items-center px-4 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                    Delete post
                  </button>
                ) : (
                  <ReportButton targetType="POST" targetId={post.id} label="Report post" className="flex min-h-10 w-full items-center px-4 text-sm text-auth-navy hover:bg-auth-navy/5 dark:text-dak-heading" />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Link href={href} className="flex flex-col gap-4 pb-4">
        <h2 className="text-xl font-semibold leading-8 text-[#2b2b31] dark:text-dak-heading sm:text-2xl">{post.title}</h2>
        <RichText text={post.body} className="text-base leading-6 text-[#2b2b31] dark:text-dak-body" />
        {post.imageUrl && (
          <div className="relative h-[220px] w-full overflow-hidden rounded-2xl bg-[#eaeaea] dark:bg-dak-bg sm:h-[400px]">
            <UserImage src={post.imageUrl} />
          </div>
        )}
        {post.canvas && !post.imageUrl && (
          <div className="flex h-[120px] w-full items-center justify-center rounded-2xl border border-dashed border-dak-cta bg-[rgba(148,54,251,0.06)] text-sm font-medium text-dak-cta">
            Shared canvas: {post.canvas.title}
          </div>
        )}
        {(post.tags.length > 0 || post.category) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.category && (
              <span className="rounded-xl bg-[#2b2b31] px-[9px] py-[5px] text-xs font-semibold leading-3 text-white dark:bg-dak-cta">{post.category}</span>
            )}
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-xl border border-dak-cta bg-[rgba(148,54,251,0.1)] px-[9px] py-[5px] text-xs font-semibold leading-3 text-dak-cta">
                #{tag.replace(/\s+/g, "").toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="flex items-center gap-6 border-t border-[#c793ff] pt-[17px] text-sm font-medium leading-4 tracking-[0.28px] text-[#2b2b31] dark:border-dak-border dark:text-dak-heading">
        <LikeButton postId={post.id} liked={post.liked} count={post.likeCount} />
        <Link href={`${href}#comments`} className="flex items-center gap-2">
          <Image src="/icons/comment.svg" alt="" width={20} height={20} className="dark:invert" />
          {post.commentCount}
        </Link>
      </div>
    </div>
  );
}
