"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

type AppHeaderProps = {
  onMenuClick?: () => void;
};

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const { toggleTheme } = useTheme();

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-light-border bg-app-bg px-4 dark:border-dak-border dark:bg-dak-bg sm:px-6 lg:left-[calc(var(--app-sidebar-w)+var(--app-wide-gutter))] lg:right-[var(--app-wide-gutter)] lg:h-[100px] lg:px-10">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl lg:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-auth-navy dark:bg-dak-heading" />
            <span className="block h-0.5 w-5 bg-auth-navy dark:bg-dak-heading" />
            <span className="block h-0.5 w-5 bg-auth-navy dark:bg-dak-heading" />
          </span>
        </button>

        <div className="relative h-12 w-full min-w-0 max-w-[448px] flex-1">
          <Image
            src="/icons/search.svg"
            alt=""
            width={15}
            height={15}
            className="absolute left-[17px] top-1/2 -translate-y-1/2 dark:invert"
          />
          <input
            type="search"
            placeholder="Search workspaces, classrooms, peers..."
            className="h-12 w-full rounded-xl border border-light-border bg-[#fdfdfd] pl-[41px] pr-[17px] text-base text-auth-navy placeholder:text-[#6b7280] focus:outline-none dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
        </div>
      </div>

      <div className="relative flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex size-11 items-center justify-center rounded-full border border-light-border text-auth-navy dark:border-dak-border dark:text-dak-heading"
        >
          {/* Both icons always render; CSS (not React state) picks which one shows,
              so there is no server/client branch here to cause a hydration mismatch. */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="hidden dark:block">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="block dark:hidden">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-xl text-auth-navy dark:text-dak-heading"
        >
          <Image src="/icons/bell.svg" alt="" width={16} height={20} className="dark:invert" />
        </button>

        <button
          type="button"
          onClick={() => setAccountOpen((v) => !v)}
          aria-label="Account menu"
          aria-expanded={accountOpen}
          className="relative flex size-10 items-center justify-center overflow-hidden rounded-full"
        >
          <Image src="/avatars/avatar-3.jpg" alt="" fill className="object-cover" />
        </button>

        {accountOpen && (
          <>
            <button
              type="button"
              aria-label="Close account menu"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setAccountOpen(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-light-border bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)] dark:border-dak-border dark:bg-dak-surface">
              <Link
                href="/profile"
                onClick={() => setAccountOpen(false)}
                className="flex min-h-11 items-center px-4 text-base text-auth-navy hover:bg-auth-navy/5 dark:text-dak-heading dark:hover:bg-white/5"
              >
                Profile
              </Link>
              <Link
                href="/"
                onClick={() => setAccountOpen(false)}
                className="flex min-h-11 items-center border-t border-light-border px-4 text-base font-medium text-red-500 hover:bg-red-50 dark:border-dak-border dark:hover:bg-red-500/10"
              >
                Logout
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
