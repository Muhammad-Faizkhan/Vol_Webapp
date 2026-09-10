import Link from "next/link";
import { FeedPostCard } from "@/components/cards/FeedPostCard";

const trending = [
  { title: "Structural Load Distribution Model", by: "By Elena Rostova", stat: "2.4k views" },
  { title: "HVAC Ducting Efficiency Analysis", by: "By David Kim", stat: "1.8k views" },
];

export default function DiscoverPage() {
  return (
    <div className="flex w-full gap-8">
      <div className="flex flex-[2] flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
            Discover Feeds
          </h1>
          <p className="text-base text-auth-slate">
            Here&rsquo;s what&rsquo;s happening across your network.
          </p>
        </div>

        <div className="flex items-center justify-between border-b border-light-border pb-4">
          <div className="flex gap-3">
            <button className="rounded-xl bg-auth-navy px-[17px] py-2 text-lg font-medium text-white">
              For You
            </button>
            <button className="rounded-xl border border-light-border bg-[#efefef] px-[17px] py-2 text-lg font-medium text-auth-navy">
              Following
            </button>
          </div>
          <Link
            href="/discover/create-post"
            className="flex items-center gap-2 rounded-xl bg-auth-navy px-4 py-2.5 text-base font-medium text-white"
          >
            + Create Post
          </Link>
        </div>

        <FeedPostCard
          href="/discover/post/1"
          author="Mark Williams"
          role="Instructor"
          timeAgo="2h ago"
          title="Abc Title"
          body="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and Ja."
          tags={["#tiling", "#engineering", "#materials"]}
          likes={124}
          comments={18}
        />
      </div>

      <div className="w-[280px] shrink-0 rounded-lg border border-light-border bg-white p-5">
        <h3 className="mb-4 flex items-center gap-1.5 border-b border-light-border pb-3 text-sm font-bold text-auth-navy">
          ↗ Trending Canvases
        </h3>
        <div className="flex flex-col gap-4">
          {trending.map((item) => (
            <div key={item.title}>
              <h4 className="text-sm font-medium text-auth-navy">{item.title}</h4>
              <span className="text-sm text-auth-navy">
                {item.by} <span className="mx-0.5">·</span> {item.stat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
