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
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 dark:border-dak-border dark:bg-dak-surface sm:p-[25px]">
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {avatarSrc ? (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
              <Image src={avatarSrc} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="size-10 shrink-0 rounded-full border border-light-border bg-auth-navy/15 dark:border-dak-border dark:bg-dak-cta/20" />
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">
              {author}
            </span>
            <span className="flex gap-1 whitespace-nowrap text-sm leading-5 text-[#929292] dark:text-dak-muted">
              <span>{role}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </span>
          </div>
        </div>
        <button aria-label="More" className="flex items-center justify-center px-1 pb-2.5 pt-1">
          <Image src="/icons/dots-horizontal.svg" alt="" width={16} height={4} className="dark:invert" />
        </button>
      </div>

      <Link href={href} className="flex flex-col gap-4 pb-4">
        <h2 className="text-xl font-semibold leading-8 text-[#2b2b31] dark:text-dak-heading sm:text-2xl">{title}</h2>
        <p className="text-base leading-6 text-[#2b2b31] dark:text-dak-body">{body}</p>
        <div className="relative h-[220px] w-full overflow-hidden rounded-2xl bg-[#eaeaea] dark:bg-dak-bg sm:h-[400px]">
          {imageSrc ? (
            <Image src={imageSrc} alt="" fill className="object-cover" />
          ) : (
            <Image src="/illustrations/auth-placeholder.svg" alt="" width={73} height={73} />
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-xl border border-dak-cta bg-[rgba(148,54,251,0.1)] px-[9px] py-[5px] text-xs font-semibold leading-3 text-dak-cta"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex items-center gap-6 border-t border-[#c793ff] pt-[17px] text-sm font-medium leading-4 tracking-[0.28px] text-[#2b2b31] dark:border-dak-border dark:text-dak-heading">
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
