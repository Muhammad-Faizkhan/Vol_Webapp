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
  avatarSrc?: string;
  imageSrc?: string;
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
  avatarSrc,
  imageSrc,
}: FeedPostCardProps) {
  return (
    <div className="rounded border border-[#e2e8f0] bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {avatarSrc ? (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-xl">
              <Image src={avatarSrc} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="size-10 rounded-xl border border-light-border bg-auth-navy/15 dark:border-dak-border dark:bg-dak-cta/20" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">{author}</span>
            <span className="text-sm text-auth-navy dark:text-dak-body">
              {role} <span className="mx-0.5">·</span> {timeAgo}
            </span>
          </div>
        </div>
        <button aria-label="More" className="text-auth-navy dark:text-dak-heading">
          ⋯
        </button>
      </div>

      <Link href={href}>
        <h2 className="my-2 text-2xl font-semibold text-auth-navy dark:text-dak-heading">{title}</h2>
        <p className="mb-3 text-base text-auth-navy dark:text-dak-body">{body}</p>
        <div className="mb-2 overflow-hidden rounded-md border border-light-border dark:border-dak-border">
          <div className="flex items-center justify-between border-b border-light-border bg-[#f3f4f6] px-4 py-2 text-xs font-medium text-auth-navy dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading">
            <span>Technical Detail</span>
            <span className="flex items-center gap-2 text-auth-navy/60 dark:text-dak-body">
              <span>&lt;</span>
              <span>&gt;</span>
            </span>
          </div>
          <div className="relative flex h-[380px] items-center justify-center bg-[#eaeaea] dark:bg-dak-bg">
            {imageSrc ? (
              <Image src={imageSrc} alt="" fill className="object-cover" />
            ) : (
              <Image src="/illustrations/auth-placeholder.svg" alt="" width={73} height={73} />
            )}
          </div>
        </div>
      </Link>

      <div className="mb-4 flex gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-xl border border-dak-cta/15 bg-dak-cta/10 px-2 py-1 text-xs font-semibold text-dak-cta dark:border-dak-border dark:bg-dak-border dark:text-dak-heading"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-6 border-t border-light-border pt-[17px] text-sm font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading">
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
