import Link from "next/link";
import type { ReactNode } from "react";
import { errorMessage } from "@vol/api-client";

/** Placeholder cards while a grid loads. */
export function LoadingGrid({ count = 4, height = 220, minWidth = 260 }: { count?: number; height?: number; minWidth?: number }) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))` }} aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-[#e9e6f0] dark:bg-dak-surface" style={{ height }} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: { label: string; href: string } | ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[rgba(43,43,49,0.3)] px-6 py-12 text-center dark:border-dak-border">
      <p className="text-lg font-semibold text-[#020204] dark:text-dak-heading">{title}</p>
      {body && <p className="max-w-md text-sm text-[#2b2b31] dark:text-dak-body">{body}</p>}
      {action &&
        (typeof action === "object" && action !== null && "href" in action ? (
          <Link href={action.href} className="mt-2 rounded-xl bg-dak-cta px-5 py-3 text-sm font-medium text-white">
            {action.label}
          </Link>
        ) : (
          action
        ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-500/30 dark:bg-red-500/10">
      <p className="text-sm font-medium text-red-600 dark:text-red-300">{errorMessage(error)}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 dark:text-red-300">
          Try again
        </button>
      )}
    </div>
  );
}

/** Previous / Next pager for paged lists. */
export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  if (pages <= 1) return null;
  const btn = "rounded-lg border border-light-border px-4 py-2 text-sm text-auth-navy disabled:opacity-40 dark:border-dak-border dark:text-dak-heading";
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button type="button" className={btn} disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </button>
      <span className="text-sm text-[#2b2b31] dark:text-dak-body">
        Page {page} of {pages}
      </span>
      <button type="button" className={btn} disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
