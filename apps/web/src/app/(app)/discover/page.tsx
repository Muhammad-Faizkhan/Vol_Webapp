"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { compactNumber, type Paged, type Post } from "@vol/api-client";
import { useApiQuery, withQuery } from "@vol/api-client/react";
import { FeedPostCard } from "@/components/cards/FeedPostCard";
import { EmptyState, LoadingGrid, Pager } from "@/components/ui/States";

const tabs = [
  { value: "latest", label: "For You", width: "w-[115px]" },
  { value: "following", label: "Following", width: "w-[147px]" },
] as const;

export default function DiscoverPage() {
  const [feed, setFeed] = useState<"latest" | "following">("latest");
  const [page, setPage] = useState(1);
  const { data: posts } = useApiQuery<Paged<Post>>(withQuery("/posts", { feed, page, limit: 10 }));
  const { data: trending } = useApiQuery<Paged<Post>>("/posts?feed=trending&limit=4");

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px] sm:leading-10">Discover Feeds</h1>
        <p className="text-base leading-6 text-[#2b2b31] dark:text-dak-body">Here&rsquo;s what&rsquo;s happening across your network.</p>
      </div>

      <div className="flex flex-col gap-8 pb-8 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4 border-b border-[#c793ff] pb-[17px] dark:border-dak-border sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3 overflow-auto">
              {tabs.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  aria-pressed={feed === t.value}
                  onClick={() => {
                    setFeed(t.value);
                    setPage(1);
                  }}
                  className={`flex h-12 ${t.width} shrink-0 items-center justify-center rounded-xl text-lg font-medium leading-4 tracking-[0.28px] ${
                    feed === t.value
                      ? "bg-[#2b2b31] text-white dark:bg-dak-cta"
                      : "border border-[#2b2b31] text-[#020204] dark:border-dak-border dark:text-dak-heading"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Link
              href="/discover/create-post"
              className="flex h-12 w-fit shrink-0 items-center gap-2 rounded-md border-t border-white/20 bg-dak-cta px-6 pb-2 pt-[9px] text-sm font-medium leading-4 tracking-[0.28px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
            >
              <Image src="/icons/plus.svg" alt="" width={11} height={11} />
              Create Post
            </Link>
          </div>

          {!posts ? (
            <LoadingGrid count={2} minWidth={500} height={360} />
          ) : posts.items.length === 0 ? (
            <EmptyState
              title={feed === "following" ? "Nothing from people you follow yet" : "No posts yet"}
              body={feed === "following" ? "Follow people and businesses from Explore to fill this feed." : "Be the first to share something with the network."}
              action={feed === "following" ? { label: "Explore", href: "/explore?tab=peoples" } : { label: "Create Post", href: "/discover/create-post" }}
            />
          ) : (
            posts.items.map((post) => <FeedPostCard key={post.id} post={post} />)
          )}
          {posts && <Pager page={posts.page} pages={posts.pages} onPage={setPage} />}
        </div>

        <aside className="w-full shrink-0 xl:sticky xl:top-[116px] xl:w-[320px]">
          <div className="flex min-h-[190px] flex-col gap-2 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-[17px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
            <h3 className="flex items-center gap-2 border-b border-[#c793ff] pb-[9px] text-sm font-bold leading-4 tracking-[0.28px] text-[#020204] dark:border-dak-border dark:text-dak-heading">
              <Image src="/icons/trending-up.svg" alt="" width={15} height={9} className="dark:invert" />
              Trending
            </h3>
            <div className="flex flex-col gap-4">
              {trending?.items.length === 0 && <p className="text-sm text-[#929292] dark:text-dak-muted">Nothing trending this month.</p>}
              {trending?.items.map((item) => (
                <Link key={item.id} href={`/discover/post/${item.id}`} className="flex flex-col gap-[3.5px]">
                  <h4 className="text-sm font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">{item.title}</h4>
                  <span className="flex flex-wrap gap-1 text-sm leading-5 text-[#929292] dark:text-dak-muted">
                    <span>By {item.author.name}</span>
                    <span>•</span>
                    <span>{compactNumber(item.viewCount)} views</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
