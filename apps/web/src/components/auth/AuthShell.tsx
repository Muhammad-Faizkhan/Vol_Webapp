import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";

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
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-app-bg dark:bg-dak-bg lg:flex-row">
      <div className="pointer-events-none absolute inset-0">
        <Image src="/illustrations/light-swirl-bg.png" alt="" fill className="block object-cover dark:hidden" />
        <Image src="/illustrations/dark-swirl-bg.svg" alt="" fill className="hidden object-cover dark:block" />
      </div>

      {showBack && (
        <Link
          href={backHref}
          className="relative z-10 m-4 flex w-fit items-center gap-1.5 text-base font-medium text-[#020204] dark:text-dak-heading sm:m-6 lg:absolute lg:left-10 lg:top-[clamp(1rem,3dvh,2.5rem)] lg:m-0"
        >
          <Image
            src="/icons/arrow-narrow-right.svg"
            alt=""
            width={24}
            height={24}
            className="-scale-y-100 rotate-180 block dark:hidden"
          />
          <Image
            src="/icons/arrow-narrow-right-light.svg"
            alt=""
            width={24}
            height={24}
            className="-scale-y-100 rotate-180 hidden dark:block"
          />
          Back
        </Link>
      )}

      <ThemeToggleButton className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6 lg:right-10 lg:top-[clamp(1rem,3dvh,2.5rem)]" />

      <div className="relative hidden shrink-0 items-center justify-center lg:flex lg:w-[42%]">
        <div className="relative aspect-[773/918] h-[clamp(280px,62dvh,620px)] w-auto max-w-[480px]">
          <Image
            src="/illustrations/auth-hero.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center overflow-y-auto px-4 py-[clamp(0.75rem,4dvh,3.75rem)] sm:px-10 lg:px-[clamp(1.5rem,4vw,60px)]">
        <div className="w-full lg:mx-auto" style={{ maxWidth: contentWidth }}>
          {children}
        </div>
      </div>
    </div>
  );
}
