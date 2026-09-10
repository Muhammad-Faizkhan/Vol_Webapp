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
}: WorkspaceCardProps) {
  const width = variant === "wide" ? "w-[460px]" : "w-[300px]";

  return (
    <Link
      href={href}
      className={`flex ${width} flex-col overflow-hidden rounded-lg border border-light-border bg-[#f8f9ff]`}
    >
      <div className="relative flex h-[130px] items-end justify-end bg-auth-navy p-4">
        <Image
          src="/illustrations/auth-placeholder.svg"
          alt=""
          width={variant === "wide" ? 73 : 36}
          height={variant === "wide" ? 73 : 36}
        />
        <span className="absolute right-6 top-4 rounded-sm border border-light-border bg-[#f8f9ff] px-[9px] py-[5px] text-[10px] font-medium text-auth-navy">
          {updatedTag ?? `+${collaboratorCount} Collabs`}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h4 className="text-base font-medium tracking-[0.28px] text-auth-navy">
          {title}
        </h4>
        {variant === "wide" ? (
          <>
            <p className="text-sm text-[#929292]">{workspace}</p>
            <p className="text-sm text-[#929292]">{editedAgo}</p>
          </>
        ) : (
          <>
            <p className="text-base text-auth-slate">{meta}</p>
            <p className="text-sm text-[#929292]">{metaSecondary}</p>
          </>
        )}
      </div>
      {variant === "wide" && (
        <div className="flex items-center gap-2 border-t border-light-border px-4 pt-[13px]">
          <div className="flex items-center">
            {collaboratorInitials.map((initial, i) => (
              <span
                key={initial}
                style={{ marginLeft: i === 0 ? 0 : -8 }}
                className="flex size-6 items-center justify-center rounded-full border border-[#f8f9ff] bg-auth-navy/10 text-[10px] font-bold text-auth-navy"
              >
                {initial}
              </span>
            ))}
          </div>
          <span className="pl-2 text-base text-auth-navy">
            +{collaboratorCount} Collabs
          </span>
        </div>
      )}
    </Link>
  );
}
