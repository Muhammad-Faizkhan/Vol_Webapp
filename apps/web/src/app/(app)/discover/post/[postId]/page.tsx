"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { compactNumber, errorMessage, timeAgo, titleCase, type Post } from "@vol/api-client";
import { useApiQuery, useAuth, useInvalidate } from "@vol/api-client/react";
import { profileHref } from "@/components/cards/FeedPostCard";
import { CommentThread } from "@/components/social/CommentThread";
import { LikeButton } from "@/components/social/LikeButton";
import { ReportButton } from "@/components/social/ReportButton";
import { RichText } from "@/components/social/RichText";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { Avatar, UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const { user } = useAuth();
  // Views are counted when the post is fetched, so don't refetch on every focus.
  const { data: post, error } = useApiQuery<Post>(`/posts/${postId}`, { revalidateOnMount: true });

  if (error) return <ErrorState error={error} />;
  if (!post) return null;
  const mine = post.author.id === user?.id;
  const image = post.imageUrl ?? post.canvas?.thumbnailUrl;

  async function remove() {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.del(`/posts/${post!.id}`);
      await invalidate("/posts");
      toast("Post deleted");
      router.push("/discover");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Link href="/discover" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:hidden" />
        <Image src="/icons/arrow-narrow-right-light.svg" alt="" width={20} height={20} className="hidden -scale-y-100 rotate-180 dark:block" />
        Back to feed
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">{post.title}</h1>
        <RichText text={post.body} className="text-base text-auth-navy dark:text-dak-body" />
      </div>

      {post.canvas && (
        <Link
          href={`/discover-canvas/${post.id}`}
          className="flex w-fit items-center gap-2 rounded-lg bg-auth-navy px-4 py-2.5 text-base font-medium text-white dark:bg-dak-cta"
        >
          ⧉ Open Canvas
        </Link>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-col gap-6 lg:flex-[2]">
          <div className="flex flex-col">
            {image && (
              <div className="relative h-[380px] w-full overflow-hidden rounded-t-md border border-b-0 border-light-border dark:border-dak-border">
                <UserImage src={image} />
              </div>
            )}
            <div
              className={`flex gap-6 border border-light-border bg-white px-4 py-3 text-sm font-medium text-auth-navy dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading ${image ? "rounded-b-md border-t-0" : "rounded-md"}`}
            >
              <LikeButton postId={post.id} liked={post.liked} count={post.likeCount} size={18} />
              <a href="#comments" className="flex items-center gap-1.5">
                💬 {post.commentCount} Comments
              </a>
              <span className="ml-auto flex items-center gap-4">
                {mine ? (
                  <button type="button" onClick={remove} className="text-sm text-[#929292] hover:text-red-500">
                    Delete
                  </button>
                ) : (
                  <ReportButton targetType="POST" targetId={post.id} />
                )}
              </span>
            </div>
          </div>
          <CommentThread postId={post.id} postAuthorId={post.author.id} />
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[360px]">
          <div className="rounded-lg border border-light-border bg-white p-5 dark:border-dak-border dark:bg-dak-surface">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-[#929292] dark:text-dak-muted">Author</h3>
            <div className="flex items-center gap-3">
              <Avatar src={post.author.avatarUrl} name={post.author.name} />
              <div className="flex flex-col">
                <span className="text-base font-semibold text-auth-navy dark:text-dak-heading">{post.author.name}</span>
                <span className="text-sm text-[#929292] dark:text-dak-muted">{post.author.specialty ?? titleCase(post.author.accountType)}</span>
              </div>
            </div>
            <Link href={mine ? "/profile" : profileHref(post.author)} className="mt-3 block text-sm font-medium text-dak-cta">
              View Profile →
            </Link>
          </div>

          <div className="rounded-lg border border-light-border bg-white p-5 dark:border-dak-border dark:bg-dak-surface">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#929292] dark:text-dak-muted">Details</h3>
            <div className="flex flex-col">
              {(
                [
                  ["Posted", timeAgo(post.createdAt)],
                  ["Views", compactNumber(post.viewCount)],
                  ["Category", post.category ?? "—"],
                  ["Visibility", titleCase(post.visibility)],
                  ...(post.canvas ? [["Canvas", post.canvas.title]] : []),
                ] as [string, string][]
              ).map(([label, value], i) => (
                <div key={label} className={`flex justify-between gap-3 py-2.5 text-sm text-auth-navy dark:text-dak-body ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}>
                  <span>{label}</span>
                  <span className="truncate font-medium text-auth-navy dark:text-dak-heading">{value}</span>
                </div>
              ))}
            </div>
            {post.tags.length > 0 && (
              <>
                <h3 className="mb-3 mt-4 text-xs font-medium uppercase tracking-wide text-[#929292] dark:text-dak-muted">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-xl border border-light-border bg-[#f2f2f3] px-3 py-1 text-sm text-auth-navy dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
