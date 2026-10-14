"use client";

import Image from "next/image";
import Link from "next/link";
import { timeAgo, type Post } from "@vol/api-client";
import { Avatar, UserImage } from "@/components/ui/UserImage";

export function FeedToggle({ value, onChange }: { value: "trending" | "following"; onChange: (v: "trending" | "following") => void }) {
  const on = "flex h-10 w-[120px] items-center justify-center rounded-xl bg-[#2b2b31] text-base font-semibold text-white dark:bg-dak-cta";
  const off = "flex h-10 w-[120px] items-center justify-center rounded-xl border border-[#020204] text-base text-[#020204] dark:border-dak-border dark:text-dak-heading";
  return (
    <div className="flex gap-2">
      <button type="button" aria-pressed={value === "trending"} onClick={() => onChange("trending")} className={value === "trending" ? on : off}>
        Trending
      </button>
      <button type="button" aria-pressed={value === "following"} onClick={() => onChange("following")} className={value === "following" ? on : off}>
        Following
      </button>
    </div>
  );
}

export function CommunityPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/discover/post/${post.id}`}
      className="flex w-full flex-col gap-2 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-[21px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
    >
      <div className="flex items-center gap-3">
        <Avatar src={post.author.avatarUrl} name={post.author.name} />
        <div className="flex flex-col gap-2">
          <span className="text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">{post.author.name}</span>
          <span className="text-sm leading-3 text-[#9c9c9c] dark:text-dak-muted">Posted {timeAgo(post.createdAt)}</span>
        </div>
      </div>
      <h4 className="pt-1 text-xl font-semibold leading-8 text-[#020204] dark:text-dak-heading">{post.title}</h4>
      <p className="line-clamp-3 text-base leading-6 text-[#2b2b31] dark:text-dak-body">{post.body}</p>
      {post.imageUrl && (
        <div className="relative h-[210px] overflow-hidden rounded-2xl bg-[#2b2b31] dark:bg-dak-surface">
          <UserImage src={post.imageUrl} />
        </div>
      )}
      <div className="flex items-center gap-4 border-t border-[#c793ff] pt-[17px]">
        <div className="flex items-center gap-1">
          <Image src="/icons/like.svg" alt="" width={16} height={15} />
          <span className="text-xs font-semibold leading-3 text-[#2b2b31] dark:text-dak-body">{post.likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Image src="/icons/comment.svg" alt="" width={15} height={15} />
          <span className="text-xs font-semibold leading-3 text-[#2b2b31] dark:text-dak-body">{post.commentCount}</span>
        </div>
      </div>
    </Link>
  );
}
