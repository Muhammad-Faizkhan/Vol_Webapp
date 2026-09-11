"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Toggle } from "@/components/ui/Toggle";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Settings
        </h1>
        <p className="text-base text-auth-slate dark:text-dak-body">
          Manage your app preferences
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
        <h2 className="text-lg font-semibold text-auth-navy dark:text-dak-heading">
          Appearance
        </h2>
        <div className="flex items-center justify-between gap-4 border-t border-light-border pt-4 dark:border-dak-border">
          <div className="flex flex-col gap-1">
            <span className="text-base font-medium text-auth-navy dark:text-dak-heading">
              Dark Mode
            </span>
            <span className="text-sm text-auth-slate dark:text-dak-body">
              Switch between light and dark theme across the app.
            </span>
          </div>
          <Toggle checked={theme === "dark"} onChange={toggleTheme} suppressHydrationWarning />
        </div>
      </div>
    </div>
  );
}
