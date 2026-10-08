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
  collaboratorAvatars?: string[];
  collaboratorCount?: number;
  meta?: string;
  metaSecondary?: string;
  imageSrc?: string;
  showCollaboratorFooter?: boolean;
};

export function WorkspaceCard({
  href,
  title,
  variant = "wide",
  workspace,
  editedAgo,
  updatedTag,
  collaboratorInitials = [],
  collaboratorAvatars = [],
  collaboratorCount = 0,
  meta,
  metaSecondary,
  imageSrc,
  showCollaboratorFooter = true,
}: WorkspaceCardProps) {
  const showFooter = showCollaboratorFooter && collaboratorCount > 0;

  return (
    <Link
      href={href}
      className="flex w-full flex-col overflow-hidden rounded-lg border border-[rgba(43,43,49,0.4)] bg-white shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
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
        <span className="absolute right-6 top-4 rounded-lg bg-[#45464d] px-2 py-1 text-[10px] font-medium text-white">
          {updatedTag ?? `+${collaboratorCount} Collabs`}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h4 className="text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">
          {title}
        </h4>
        {variant === "wide" ? (
          <>
            <p className="text-sm leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-body">{workspace}</p>
            <p className="text-sm leading-5 text-[#45464d] dark:text-dak-muted">{editedAgo}</p>
          </>
        ) : (
          <>
            <p className="text-base text-auth-slate dark:text-dak-body">{meta}</p>
            <p className="text-sm text-[#929292] dark:text-dak-muted">{metaSecondary}</p>
          </>
        )}
      </div>
      {showFooter && (
        <div className="flex items-center gap-2 border-t border-[#c793ff] px-4 pb-[14px] pt-[13px] dark:border-dak-border">
          <div className="flex items-center">
            {collaboratorAvatars.length > 0
              ? collaboratorAvatars.map((avatar, i) => (
                  <span
                    key={i}
                    style={{ marginLeft: i === 0 ? 0 : -8 }}
                    className="relative size-6 shrink-0 overflow-hidden rounded-full border-2 border-white dark:border-dak-surface"
                  >
                    <Image src={avatar} alt="" fill className="object-cover" />
                  </span>
                ))
              : (collaboratorInitials.length > 0
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
          <span className="pl-2 text-base text-[#2b2b31] dark:text-dak-heading">
            +{collaboratorCount} Collabs
          </span>
        </div>
      )}
    </Link>
  );
}
