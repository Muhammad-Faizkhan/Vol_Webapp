"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Notification, Paged, SearchResults } from "@vol/api-client";
import { useApiQuery, useAuth, useInvalidate, withQuery } from "@vol/api-client/react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Avatar } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

type AppHeaderProps = {
  onMenuClick?: () => void;
};

const menuItem =
  "flex min-h-11 items-center px-4 text-base text-auth-navy hover:bg-auth-navy/5 dark:text-dak-heading dark:hover:bg-white/5";

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const [open, setOpen] = useState<"account" | "notifications" | "search" | null>(null);
  const { toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const invalidate = useInvalidate();
  const close = () => setOpen(null);

  // Notifications: polled every minute so new invites show up without a reload.
  const { data: notes } = useApiQuery<Paged<Notification> & { unread: number }>("/notifications?limit=15", {
    refreshInterval: 60_000,
  });

  async function openNotifications() {
    setOpen(open === "notifications" ? null : "notifications");
    if (notes?.unread) {
      await api.post("/notifications/read");
      await invalidate("/notifications");
    }
  }

  // Search: debounced as-you-type preview; Enter opens the full results in Explore.
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);
  const { data: results } = useApiQuery<SearchResults>(debounced.length >= 2 ? withQuery("/search", { q: debounced }) : null);
  const hasResults = results && Object.values(results).some((list) => list.length > 0);

  const name = user?.name ?? "";

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

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            close();
            if (query.trim()) router.push(withQuery("/explore", { q: query.trim() }));
          }}
          className="relative h-12 w-full min-w-0 max-w-[448px] flex-1"
        >
          <Image
            src="/icons/search.svg"
            alt=""
            width={15}
            height={15}
            className="absolute left-[17px] top-1/2 -translate-y-1/2 dark:invert"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen("search");
            }}
            onFocus={() => setOpen("search")}
            placeholder="Search workspaces, classrooms, peers..."
            aria-label="Search"
            className="h-12 w-full rounded-xl border border-light-border bg-[#fdfdfd] pl-[41px] pr-[17px] text-base text-auth-navy placeholder:text-[#6b7280] focus:outline-none dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
          {open === "search" && debounced.length >= 2 && results && (
            <>
              <button type="button" aria-label="Close search" className="fixed inset-0 z-10 cursor-default" onClick={close} />
              <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[70dvh] overflow-y-auto rounded-xl border border-light-border bg-white py-2 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] dark:border-dak-border dark:bg-dak-surface">
                {!hasResults && <p className="px-4 py-3 text-sm text-[#6b7280] dark:text-dak-muted">No matches for “{debounced}”.</p>}
                <SearchGroup title="People" items={results.people.map((p) => ({ href: p.accountType === "BUSINESS" ? `/business/${p.id}` : `/profile/${p.id}`, label: p.name }))} onPick={close} />
                <SearchGroup title="Workspaces" items={results.workspaces.map((w) => ({ href: `/workspaces/${w.id}`, label: w.name }))} onPick={close} />
                <SearchGroup title="Classrooms" items={results.classrooms.map((c) => ({ href: `/classrooms/${c.id}`, label: c.title }))} onPick={close} />
                <SearchGroup title="Posts" items={results.posts.map((p) => ({ href: `/discover/post/${p.id}`, label: p.title }))} onPick={close} />
                <SearchGroup title="Products" items={results.products.map((p) => ({ href: `/products/${p.id}`, label: p.name }))} onPick={close} />
              </div>
            </>
          )}
        </form>
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
          onClick={openNotifications}
          aria-label={notes?.unread ? `Notifications (${notes.unread} unread)` : "Notifications"}
          aria-expanded={open === "notifications"}
          className="relative flex size-11 items-center justify-center rounded-xl text-auth-navy dark:text-dak-heading"
        >
          <Image src="/icons/bell.svg" alt="" width={16} height={20} className="dark:invert" />
          {!!notes?.unread && (
            <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-dak-cta px-1 text-[10px] font-bold leading-4 text-white">
              {notes.unread > 9 ? "9+" : notes.unread}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setOpen(open === "account" ? null : "account")}
          aria-label="Account menu"
          aria-expanded={open === "account"}
          className="relative flex size-10 items-center justify-center overflow-hidden rounded-full"
        >
          <Avatar src={user?.avatarUrl} name={name} size={40} />
        </button>

        {(open === "account" || open === "notifications") && (
          <button type="button" aria-label="Close menu" className="fixed inset-0 z-10 cursor-default" onClick={close} />
        )}

        {open === "notifications" && (
          <div className="absolute right-0 top-full z-20 mt-2 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-light-border bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)] dark:border-dak-border dark:bg-dak-surface">
            <p className="border-b border-light-border px-4 py-3 text-base font-semibold text-auth-navy dark:border-dak-border dark:text-dak-heading">
              Notifications
            </p>
            <div className="max-h-[60dvh] divide-y divide-light-border overflow-y-auto dark:divide-dak-border">
              {notes?.items.length ? (
                notes.items.map((n) => <NotificationItem key={n.id} n={n} variant="compact" onDone={close} />)
              ) : (
                <p className="px-4 py-6 text-center text-sm text-[#6b7280] dark:text-dak-muted">You&apos;re all caught up.</p>
              )}
            </div>
          </div>
        )}

        {open === "account" && (
          <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-light-border bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)] dark:border-dak-border dark:bg-dak-surface">
            <div className="border-b border-light-border px-4 py-3 dark:border-dak-border">
              <p className="truncate text-sm font-semibold text-auth-navy dark:text-dak-heading">{name}</p>
              <p className="truncate text-xs text-[#6b7280] dark:text-dak-muted">{user?.email}</p>
            </div>
            <Link href="/profile" onClick={close} className={menuItem}>
              Profile
            </Link>
            <Link href="/settings" onClick={close} className={menuItem}>
              Settings
            </Link>
            <button
              type="button"
              onClick={async () => {
                close();
                await logout();
                router.push("/");
              }}
              className="flex min-h-11 w-full items-center border-t border-light-border px-4 text-base font-medium text-red-500 hover:bg-red-50 dark:border-dak-border dark:hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function SearchGroup({ title, items, onPick }: { title: string; items: { href: string; label: string }[]; onPick: () => void }) {
  if (!items.length) return null;
  return (
    <div className="py-1">
      <p className="px-4 py-1 text-xs font-semibold uppercase tracking-[0.7px] text-[#6b7280] dark:text-dak-muted">{title}</p>
      {items.map((item) => (
        <Link key={item.href} href={item.href} onClick={onPick} className="block truncate px-4 py-2 text-sm text-auth-navy hover:bg-auth-navy/5 dark:text-dak-heading dark:hover:bg-white/5">
          {item.label}
        </Link>
      ))}
    </div>
  );
}
