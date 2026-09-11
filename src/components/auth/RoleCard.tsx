import Image from "next/image";
import Link from "next/link";

type RoleCardProps = {
  iconSrc: string;
  iconClassName?: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  /** "cta" (bright purple) for the primary/individual card, "muted" (black button, neutral border) for the secondary/business card — same in both themes. */
  accent?: "cta" | "muted";
};

export function RoleCard({
  iconSrc,
  iconClassName = "rounded-full object-cover",
  title,
  description,
  buttonLabel,
  href,
  accent = "cta",
}: RoleCardProps) {
  const isCta = accent === "cta";

  return (
    <div
      className={`relative flex min-h-[clamp(120px,17dvh,280px)] w-full flex-col gap-1.5 overflow-hidden rounded-2xl border bg-white px-6 py-[clamp(0.625rem,1.6dvh,1.5625rem)] dark:bg-[#1e1e22] sm:px-[41px] ${
        isCta
          ? "border-dak-cta dark:border-dak-cta"
          : "border-light-border dark:border-dak-border dark:bg-dak-surface"
      }`}
    >
      <div className={`absolute left-0 right-0 top-0 h-1 ${isCta ? "bg-dak-cta" : "bg-auth-navy dark:bg-dak-body"}`} />
      <Image src={iconSrc} alt="" width={60} height={60} className={iconClassName} />
      <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">{title}</h3>
      <p className="text-base leading-[23px] text-auth-navy dark:text-dak-body">{description}</p>
      <Link
        href={href}
        className={`mt-auto flex h-14 w-full items-center justify-center rounded-2xl text-base font-medium text-white ${
          isCta
            ? "bg-dak-cta shadow-[0px_8px_16px_rgba(148,54,251,0.4)] dark:shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
            : "bg-[#020202] shadow-[0px_8px_16px_rgba(2,2,2,0.4)]"
        }`}
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
