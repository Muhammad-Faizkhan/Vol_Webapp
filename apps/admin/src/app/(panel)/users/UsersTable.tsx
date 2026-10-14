"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { errorMessage, formatNumber, initials, timeAgo, type AdminUser, type Paged } from "@vol/api-client";
import { useApiQuery, withQuery } from "@vol/api-client/react";
import { Chips } from "@/components/ui/Chips";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge, accountStatusTone } from "@/components/ui/StatusBadge";
import { accountStatusLabel, accountTypeLabel } from "@/lib/admin";
import { api } from "@/lib/api";

const PAGE_SIZE = 10;

// Each chip maps to the API's status/type filters.
const filters = [
  { value: "all", label: "All" },
  { value: "individual", label: "Individual", params: { type: "INDIVIDUAL" } },
  { value: "business", label: "Business", params: { type: "BUSINESS" } },
  { value: "active", label: "Active", params: { status: "ACTIVE" } },
  { value: "suspended", label: "Suspended", params: { status: "SUSPENDED" } },
  { value: "banned", label: "Banned", params: { status: "BANNED" } },
] as const;

// Column widths measured from Figma 743:251 (341/186/176/191/142/192px of the 1338px row, plus the
// 110px action button), kept proportional so the table fits laptop widths without scrolling.
const columns =
  "grid-cols-[minmax(264px,341fr)_minmax(84px,186fr)_minmax(76px,176fr)_minmax(116px,191fr)_minmax(56px,142fr)_minmax(76px,192fr)_110px]";

export function UsersTable({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const params = { ...(filters.find((f) => f.value === filter) as { params?: Record<string, string> }).params, q: debounced };
  const { data, error } = useApiQuery<Paged<AdminUser>>(withQuery("/admin/users", { ...params, page, limit: PAGE_SIZE }));

  async function exportCsv() {
    setExporting(true);
    setExportError(null);
    try {
      const csv = await api.text(withQuery("/admin/users/export", params));
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "vol-users.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(errorMessage(err));
    } finally {
      setExporting(false);
    }
  }

  const rows = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="User Management"
        subtitle="Every individual and business account."
        actions={
          <button
            type="button"
            onClick={exportCsv}
            disabled={exporting}
            className="flex h-12 w-[123px] items-center justify-center gap-1 rounded-[28px] bg-dak-cta px-4 text-base font-bold tracking-[-0.32px] text-dak-heading disabled:opacity-60"
          >
            <Image src="/icons/export.svg" alt="" width={24} height={24} />
            {exporting ? "…" : "Export"}
          </button>
        }
      />
      {exportError && <p className="text-sm text-adm-danger">{exportError}</p>}

      <div className="flex flex-col gap-8">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, username, email or user ID"
          aria-label="Search users"
          className="h-10 w-full max-w-[500px] rounded-xl border-[0.5px] border-adm-input-border bg-[#0b0f19] pl-[24.5px] pr-4 text-base text-dak-heading placeholder:text-adm-placeholder focus:border-dak-cta focus:outline-none"
        />
        <Chips
          label="Filter users"
          items={filters.map(({ value, label }) => ({ value, label }))}
          value={filter}
          onChange={(v) => {
            setFilter(v as typeof filter);
            setPage(1);
          }}
        />
      </div>

      <section className="flex flex-col gap-8 rounded-2xl border border-dak-border bg-dak-surface p-[clamp(16px,calc(2.1*var(--vw)),40px)]">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[784px]">
            <div className={`grid ${columns} items-center border-b border-dak-muted/50 pb-[23px] text-sm font-medium leading-4 tracking-[0.28px] text-dak-body`}>
              <span>User</span>
              <span>User ID</span>
              <span>Type</span>
              <span>Status</span>
              <span>Reports</span>
              <span>Last Active</span>
              <span>Action</span>
            </div>

            {error ? (
              <p className="py-12 text-center text-base text-adm-danger">{errorMessage(error)}</p>
            ) : !data ? (
              <p className="py-12 text-center text-base text-dak-body">Loading…</p>
            ) : rows.length === 0 ? (
              <p className="py-12 text-center text-base text-dak-body">No users match these filters.</p>
            ) : (
              <ul className="flex flex-col gap-[27px] pt-[32px]">
                {rows.map((u) => {
                  const label = accountStatusLabel[u.status];
                  return (
                    <li key={u.id} className={`grid ${columns} items-center text-sm font-medium leading-4 tracking-[0.28px] text-dak-body`}>
                      <div className="flex min-w-0 items-center gap-[11px] pr-3">
                        <UserAvatar src={u.avatarUrl} name={u.name} />
                        <div className="flex min-w-0 flex-col gap-2">
                          <p className="truncate text-lg font-semibold leading-normal tracking-[-0.2px] text-dak-heading">{u.name}</p>
                          <p className="truncate">{u.email}</p>
                        </div>
                      </div>
                      <span className="truncate pr-3">{u.displayId}</span>
                      <span>{accountTypeLabel(u.accountType)}</span>
                      <span>
                        <StatusBadge label={label} tone={accountStatusTone(label)} />
                      </span>
                      <span>{u.reports}</span>
                      <span className="whitespace-nowrap">{timeAgo(u.lastActiveAt)}</span>
                      <Link
                        href={`/users/${u.id}`}
                        className="flex h-10 w-[110px] items-center justify-center rounded-3xl bg-dak-cta px-2 text-sm font-medium tracking-[0.28px] text-dak-heading"
                      >
                        See Details
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dak-muted/50 pt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium leading-4 tracking-[0.28px] text-dak-body">Total Users:</span>
            <span className="rounded-[30px] border border-dak-muted px-4 py-2 text-sm font-semibold tracking-[-0.2px] text-dak-muted">{formatNumber(data?.total ?? 0)}</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="h-12 rounded-[30px] border border-dak-muted px-6 text-base font-semibold tracking-[-0.2px] text-dak-muted enabled:hover:text-dak-heading"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!data || page >= data.pages}
              onClick={() => setPage(page + 1)}
              className="h-12 w-[116px] rounded-[30px] bg-dak-cta px-6 text-base font-semibold tracking-[-0.2px] text-dak-heading disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function UserAvatar({ src, name, size = 40 }: { src: string | null; name: string; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-dak-cta font-semibold text-white" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}
