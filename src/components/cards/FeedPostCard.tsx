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
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-[25px] dark:border-dak-border dark:bg-dak-surface">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {avatarSrc ? (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
              <Image src={avatarSrc} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="size-10 rounded-full border border-light-border bg-auth-navy/15 dark:border-dak-border dark:bg-dak-cta/20" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#020204] dark:text-dak-heading">{author}</span>
            <span className="text-sm text-[#929292] dark:text-dak-muted">
              {role} <span className="mx-0.5">·</span> {timeAgo}
            </span>
          </div>
        </div>
        <button aria-label="More" className="flex items-center justify-center px-1 py-2.5">
          <Image src="/icons/dots-horizontal.svg" alt="" width={16} height={4} className="dark:invert" />
        </button>
      </div>

      <Link href={href}>
        <h2 className="mb-4 text-2xl font-semibold text-[#2b2b31] dark:text-dak-heading">{title}</h2>
        <p className="mb-4 text-base text-[#2b2b31] dark:text-dak-body">{body}</p>
        <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-[#eaeaea] dark:bg-dak-bg">
          {imageSrc ? (
            <Image src={imageSrc} alt="" fill className="object-cover" />
          ) : (
            <Image src="/illustrations/auth-placeholder.svg" alt="" width={73} height={73} />
          )}
        </div>
      </Link>

      <div className="mb-4 flex gap-2 pt-2">
        {tags.map((tag, i) => (
          <span
            key={tag}
            className={`rounded-xl bg-[rgba(148,54,251,0.1)] px-2.5 py-1 text-xs font-semibold text-dak-cta ${
              i !== tags.length - 1 ? "border border-dak-cta" : ""
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-6 border-t border-[#c793ff] pt-[17px] text-sm font-medium text-[#2b2b31] dark:border-dak-border dark:text-dak-heading">
        <span className="flex items-center gap-2">
          <Image src="/icons/like.svg" alt="" width={21} height={20} className="dark:invert" />
          {likes}
        </span>
        <span className="flex items-center gap-2">
          <Image src="/icons/comment.svg" alt="" width={20} height={20} className="dark:invert" />
          {comments}
        </span>
      </div>
    </div>
  );
}
