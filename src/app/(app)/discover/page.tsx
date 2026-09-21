import Image from "next/image";
import Link from "next/link";
import { FeedPostCard } from "@/components/cards/FeedPostCard";

const trending = [
  { title: "Structural Load Distribution Model", by: "By Elena Rostova", stat: "2.4k views" },
  { title: "HVAC Ducting Efficiency Analysis", by: "By David Kim", stat: "1.8k views" },
];

const posts = [
  {
    href: "/discover/post/1",
    author: "Mark Williams",
    role: "Instructor",
    timeAgo: "2h ago",
    title: "Abc Title",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and Ja.",
    tags: ["#tiling", "#engineering", "#materials"],
    likes: 124,
    comments: 18,
    avatarSrc: "/avatars/avatar-3.jpg",
    imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
  },
  {
    href: "/discover/post/1",
    author: "Mark Williams",
    role: "Instructor",
    timeAgo: "2h ago",
    title: "Abc Title",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and Ja.",
    tags: ["#tiling", "#engineering", "#materials"],
    likes: 124,
    comments: 18,
    avatarSrc: "/avatars/avatar-3.jpg",
    imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
  },
  {
    href: "/discover/post/1",
    author: "Mark Williams",
    role: "Instructor",
    timeAgo: "2h ago",
    title: "Abc Title",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and Ja.",
    tags: ["#tiling", "#engineering", "#materials"],
    likes: 124,
    comments: 18,
    avatarSrc: "/avatars/avatar-3.jpg",
    imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
  },
];

export default function DiscoverPage() {
  return (
    <div className="flex w-full flex-col gap-8 xl:flex-row">
      <div className="flex min-w-0 flex-col gap-6 xl:flex-[2]">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
            Discover Feeds
          </h1>
          <p className="text-base text-auth-slate dark:text-dak-body">
            Here&rsquo;s what&rsquo;s happening across your network.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-b border-[#c793ff] pb-4 dark:border-dak-border sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3 overflow-auto">
            <button className="h-12 shrink-0 rounded-xl bg-[#2b2b31] px-4 text-lg font-medium text-white dark:bg-dak-cta">
              For You
            </button>
            <button className="h-12 shrink-0 rounded-xl border border-[#2b2b31] px-[17px] text-lg font-medium text-[#020204] dark:border-dak-border dark:text-dak-heading">
              Following
            </button>
          </div>
          <Link
            href="/discover/create-post"
            className="flex h-12 w-fit shrink-0 items-center gap-2 rounded-md bg-dak-cta px-6 text-sm font-medium text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
          >
            <Image src="/icons/plus.svg" alt="" width={11} height={11} />
            Create Post
          </Link>
        </div>

        {posts.map((post, i) => (
          <FeedPostCard key={i} {...post} />
        ))}
      </div>

      <div className="w-full shrink-0 xl:w-[320px]">
        <div className="rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-[17px] shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
          <h3 className="mb-4 flex items-center gap-2 border-b border-[#c793ff] pb-[9px] text-sm font-bold text-[#020204] dark:text-dak-heading">
            <Image src="/icons/trending-up.svg" alt="" width={15} height={9} className="dark:invert" />
            Trending Canvases
          </h3>
          <div className="flex flex-col gap-4">
            {trending.map((item) => (
              <div key={item.title} className="flex flex-col gap-1">
                <h4 className="text-sm font-medium text-[#020204] dark:text-dak-heading">{item.title}</h4>
                <span className="text-sm text-[#929292] dark:text-dak-muted">
                  {item.by} <span className="mx-0.5">·</span> {item.stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
