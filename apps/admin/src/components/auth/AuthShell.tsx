import Image from "next/image";
import type { ReactNode } from "react";

// Figma frames 705:3646 / 705:4534: black canvas with the purple swirl spilling past every edge,
// the VÔL hero image filling the left 868/1920 of the screen, and the form centered on the right.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100*var(--vh))] w-full overflow-hidden bg-dak-bg">
      <div className="pointer-events-none absolute inset-[-55.06%_-35.93%_-79.91%_-27.19%]">
        <Image src="/illustrations/swirl-bg.svg" alt="" fill className="object-fill" priority />
      </div>

      <div className="relative hidden w-[45.2%] shrink-0 lg:block">
        <Image src="/illustrations/auth-hero.png" alt="" fill sizes="45vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-[linear-gradient(231.26deg,rgba(148,54,251,0.156)_5.52%,rgba(148,54,251,0.2)_98.82%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(152.54deg,rgba(18,18,18,0.18)_1.52%,rgba(5,5,5,0.17)_100%)]" />
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="flex w-full max-w-[570px] flex-col items-center gap-10">{children}</div>
      </div>
    </div>
  );
}

export function AuthHeading({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative h-[clamp(110px,calc(14*var(--vh)),150px)] w-[clamp(73px,calc(9.3*var(--vh)),100px)]">
        <Image src="/brand/admin-logo.png" alt="VÔL" fill sizes="100px" className="object-cover" priority />
      </div>
      <div className="flex w-full max-w-[498px] flex-col gap-4 px-2.5 text-center">
        <h1 className="text-[clamp(26px,calc(2.4*var(--vw)),32px)] font-bold text-dak-heading">{title}</h1>
        <p className="text-base font-medium leading-[23px] text-dak-body">{children}</p>
      </div>
    </div>
  );
}
