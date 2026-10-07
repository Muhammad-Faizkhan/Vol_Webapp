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
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px] sm:leading-10">
          Discover Feeds
        </h1>
        <p className="text-base leading-6 text-[#2b2b31] dark:text-dak-body">
          Here&rsquo;s what&rsquo;s happening across your network.
        </p>
      </div>

      <div className="flex flex-col gap-8 pb-8 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4 border-b border-[#c793ff] pb-[17px] dark:border-dak-border sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3 overflow-auto">
              <button className="flex h-12 w-[115px] shrink-0 items-center justify-center rounded-xl bg-[#2b2b31] text-lg font-medium leading-4 tracking-[0.28px] text-white dark:bg-dak-cta">
                For You
              </button>
              <button className="flex h-12 w-[147px] shrink-0 items-center justify-center rounded-xl border border-[#2b2b31] text-lg font-medium leading-4 tracking-[0.28px] text-[#020204] dark:border-dak-border dark:text-dak-heading">
                Following
              </button>
            </div>
            <Link
              href="/discover/create-post"
              className="flex h-12 w-fit shrink-0 items-center gap-2 rounded-md border-t border-white/20 bg-dak-cta px-6 pb-2 pt-[9px] text-sm font-medium leading-4 tracking-[0.28px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
            >
              <Image src="/icons/plus.svg" alt="" width={11} height={11} />
              Create Post
            </Link>
          </div>

          {posts.map((post, i) => (
            <FeedPostCard key={i} {...post} />
          ))}
        </div>

        <aside className="w-full shrink-0 xl:sticky xl:top-[116px] xl:w-[320px]">
          <div className="flex min-h-[190px] flex-col gap-2 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-[17px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
            <h3 className="flex items-center gap-2 border-b border-[#c793ff] pb-[9px] text-sm font-bold leading-4 tracking-[0.28px] text-[#020204] dark:border-dak-border dark:text-dak-heading">
              <Image src="/icons/trending-up.svg" alt="" width={15} height={9} className="dark:invert" />
              Trending Canvases
            </h3>
            <div className="flex flex-col gap-4">
              {trending.map((item) => (
                <div key={item.title} className="flex flex-col gap-[3.5px]">
                  <h4 className="text-sm font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">{item.title}</h4>
                  <span className="flex flex-wrap gap-1 text-sm leading-5 text-[#929292] dark:text-dak-muted">
                    <span>{item.by}</span>
                    <span>•</span>
                    <span>{item.stat}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
