import Image from "next/image";
import Link from "next/link";

type RoleCardProps = {
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
};

export function RoleCard({
  iconSrc,
  iconWidth,
  iconHeight,
  title,
  description,
  buttonLabel,
  href,
}: RoleCardProps) {
  return (
    <div className="relative flex h-[280px] w-full flex-col gap-4 overflow-hidden rounded-2xl border border-light-border bg-white px-[41px] py-[25px]">
      <div className="absolute left-0 right-0 top-0 h-1 bg-auth-navy" />
      <div className="flex size-12 items-center justify-center rounded bg-[rgba(79,98,110,0.2)]">
        <Image src={iconSrc} alt="" width={iconWidth} height={iconHeight} />
      </div>
      <h3 className="text-2xl font-semibold text-auth-navy">{title}</h3>
      <p className="text-base leading-[23px] text-auth-navy">{description}</p>
      <Link
        href={href}
        className="mt-auto flex h-14 w-full items-center justify-center rounded-2xl bg-auth-slate text-base font-medium text-white shadow-[0px_8px_16px_rgba(99,117,139,0.4)]"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
