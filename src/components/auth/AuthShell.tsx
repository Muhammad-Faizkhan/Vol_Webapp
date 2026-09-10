import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  backHref?: string;
  showBack?: boolean;
  contentWidth?: number;
};

export function AuthShell({
  children,
  backHref = "/login",
  showBack = true,
  contentWidth = 570,
}: AuthShellProps) {
  return (
    <div className="relative h-[1080px] w-[1920px] shrink-0 bg-white">
      <div className="absolute right-0 top-0 h-[1080px] w-[1160px] bg-auth-bg2" />
      <div className="absolute left-0 top-0 h-[1080px] w-[760px] bg-auth-navy" />

      <div className="absolute left-[214px] top-[293.75px] h-[332px] w-[332px] overflow-hidden">
        <Image
          src="/illustrations/auth-placeholder.svg"
          alt=""
          width={332}
          height={332}
        />
      </div>

      <p className="absolute left-[99.1px] top-[671.25px] w-[561.8px] text-center text-base font-medium leading-[23px] text-white">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since 1966, when designers at Letraset and James Mosley, the
        librarian at St Bride Printing Library in London, took a 1914 Cicero
        translation and scrambled it to make dummy text for Letraset&apos;s
        Body Type sheets.
      </p>

      {showBack && (
        <Link
          href={backHref}
          className="absolute left-[810px] top-[60px] flex items-center gap-1.5 text-base font-medium text-auth-navy"
        >
          <Image
            src="/icons/arrow-narrow-right.svg"
            alt=""
            width={24}
            height={24}
            className="-scale-y-100 rotate-180"
          />
          Back
        </Link>
      )}

      <div
        className="absolute left-[1055px] top-[60px] max-h-[960px] overflow-y-auto overflow-x-hidden py-[60px]"
        style={{ width: contentWidth }}
      >
        {children}
      </div>
    </div>
  );
}
