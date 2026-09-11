import Image from "next/image";
import Link from "next/link";

type WorkspaceCardProps = {
  href: string;
  title: string;
  variant?: "wide" | "grid";
  workspace?: string;
  editedAgo?: string;
  updatedTag?: string;
  collaboratorInitials?: string[];
  collaboratorCount?: number;
  meta?: string;
  metaSecondary?: string;
  imageSrc?: string;
};

export function WorkspaceCard({
  href,
  title,
  variant = "wide",
  workspace,
  editedAgo,
  updatedTag,
  collaboratorInitials = [],
  collaboratorCount = 0,
  meta,
  metaSecondary,
  imageSrc,
}: WorkspaceCardProps) {
  const showFooter = collaboratorCount > 0;

  return (
    <Link
      href={href}
      className="flex w-full flex-col overflow-hidden rounded-lg border border-light-border bg-[#f8f9ff] dark:border-dak-border dark:bg-dak-surface"
    >
      <div className="relative flex h-[130px] items-end justify-end overflow-hidden bg-auth-navy p-4 dark:bg-dak-surface">
        {imageSrc ? (
          <Image src={imageSrc} alt="" fill className="object-cover" />
        ) : (
          <Image
            src="/illustrations/auth-placeholder.svg"
            alt=""
            width={variant === "wide" ? 73 : 36}
            height={variant === "wide" ? 73 : 36}
            className="relative z-10"
          />
        )}
        <span className="absolute right-6 top-4 rounded-sm border border-light-border bg-[#f8f9ff] px-[9px] py-[5px] text-[10px] font-medium text-auth-navy dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading">
          {updatedTag ?? `+${collaboratorCount} Collabs`}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h4 className="text-base font-medium tracking-[0.28px] text-auth-navy dark:text-dak-heading">
          {title}
        </h4>
        {variant === "wide" ? (
          <>
            <p className="text-sm text-[#929292] dark:text-dak-muted">{workspace}</p>
            <p className="text-sm text-[#929292] dark:text-dak-muted">{editedAgo}</p>
          </>
        ) : (
          <>
            <p className="text-base text-auth-slate dark:text-dak-body">{meta}</p>
            <p className="text-sm text-[#929292] dark:text-dak-muted">{metaSecondary}</p>
          </>
        )}
      </div>
      {showFooter && (
        <div className="flex items-center gap-2 border-t border-light-border px-4 pt-[13px] dark:border-dak-border">
          <div className="flex items-center">
            {(collaboratorInitials.length > 0
              ? collaboratorInitials
              : Array.from({ length: Math.min(collaboratorCount, 3) }).map(() => "")
            ).map((initial, i) => (
              <span
                key={i}
                style={{ marginLeft: i === 0 ? 0 : -8 }}
                className="flex size-6 items-center justify-center rounded-full border border-[#f8f9ff] bg-auth-navy/10 text-[10px] font-bold text-auth-navy dark:border-dak-surface dark:bg-dak-cta/20 dark:text-dak-heading"
              >
                {initial}
              </span>
            ))}
          </div>
          <span className="pl-2 text-base text-auth-navy dark:text-dak-heading">
            +{collaboratorCount} Collabs
          </span>
        </div>
      )}
    </Link>
  );
}
