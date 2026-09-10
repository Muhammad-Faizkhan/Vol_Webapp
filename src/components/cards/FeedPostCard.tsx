import Image from "next/image";
import Link from "next/link";

type FeedPostCardProps = {
  href: string;
  author: string;
  role: string;
  timeAgo: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
};

export function FeedPostCard({
  href,
  author,
  role,
  timeAgo,
  title,
  body,
  tags,
  likes,
  comments,
}: FeedPostCardProps) {
  return (
    <div className="rounded border border-[#e2e8f0] bg-white p-6">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl border border-light-border bg-auth-navy/15" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-auth-navy">{author}</span>
            <span className="text-sm text-auth-navy">
              {role} <span className="mx-0.5">·</span> {timeAgo}
            </span>
          </div>
        </div>
        <button aria-label="More" className="text-auth-navy">
          ⋯
        </button>
      </div>

      <Link href={href}>
        <h2 className="my-2 text-2xl font-semibold text-auth-navy">{title}</h2>
        <p className="mb-3 text-base text-auth-navy">{body}</p>
        <div className="mb-2 flex h-[408px] items-center justify-center rounded-md border border-light-border bg-[#eaeaea]">
          <Image src="/illustrations/auth-placeholder.svg" alt="" width={73} height={73} />
        </div>
      </Link>

      <div className="mb-4 flex gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-xl border border-auth-navy/20 bg-auth-navy/10 px-2 py-1 text-xs font-semibold text-auth-navy"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-6 border-t border-light-border pt-[17px] text-sm font-medium text-auth-navy">
        <span className="flex items-center gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 22H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3m4-8-1 4h6.5a2 2 0 0 1 1.94 2.5l-1.86 7A2 2 0 0 1 15.7 18H7V9l4-7a2 2 0 0 1 3 2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {likes}
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {comments}
        </span>
      </div>
    </div>
  );
}
