"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeToggleButton({ className = "" }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`flex size-11 items-center justify-center rounded-full border border-light-border text-[#020204] dark:border-dak-border dark:text-dak-heading ${className}`}
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
  );
}
