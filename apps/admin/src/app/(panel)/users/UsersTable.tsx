"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Chips } from "@/components/ui/Chips";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge, accountStatusTone } from "@/components/ui/StatusBadge";
import { type AdminUser, totalUsers, users } from "@/lib/mock-data";

const PAGE_SIZE = 6;

const filters = [
  { value: "all", label: "All" },
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "banned", label: "Banned" },
];

function matchesFilter(user: AdminUser, filter: string) {
  switch (filter) {
    case "individual":
      return user.type === "Individual";
    case "business":
      return user.type === "Business";
    case "active":
      return user.status === "Active";
    case "suspended":
      return user.status === "Suspended";
    case "banned":
      return user.status === "Ban";
    default:
      return true;
  }
}

function exportCsv(rows: AdminUser[]) {
  const header = ["User ID", "Name", "Email", "Type", "Status", "Reports", "Last Active"];
  const lines = rows.map((u) => [u.id, u.name, u.email, u.type, u.status, u.reports, u.lastActive].map(String));
  const csv = [header, ...lines].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "vol-users.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Column widths measured from Figma 743:251 (341/186/176/191/142/192px of the 1338px row, plus the
// 110px action button), kept proportional so the table fits laptop widths without scrolling.
const columns =
  "grid-cols-[minmax(264px,341fr)_minmax(84px,186fr)_minmax(76px,176fr)_minmax(116px,191fr)_minmax(56px,142fr)_minmax(76px,192fr)_110px]";

export function UsersTable({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        matchesFilter(u, filter) &&
        (!q || [u.name, u.username, u.email, u.id].some((field) => field.toLowerCase().includes(q))),
    );
  }, [query, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="User Management"
        subtitle="Every individual and business account."
        actions={
          <button
            type="button"
            onClick={() => exportCsv(filtered)}
            className="flex h-12 w-[123px] items-center justify-center gap-1 rounded-[28px] bg-dak-cta px-4 text-base font-bold tracking-[-0.32px] text-dak-heading"
          >
            <Image src="/icons/export.svg" alt="" width={24} height={24} />
            Export
          </button>
        }
      />

      <div className="flex flex-col gap-8">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Search by name, username, email or user ID"
          aria-label="Search users"
          className="h-10 w-full max-w-[500px] rounded-xl border-[0.5px] border-adm-input-border bg-[#0b0f19] pl-[24.5px] pr-4 text-base text-dak-heading placeholder:text-adm-placeholder focus:border-dak-cta focus:outline-none"
        />
        <Chips
          label="Filter users"
          items={filters}
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(0);
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

            {rows.length === 0 ? (
              <p className="py-12 text-center text-base text-dak-body">No users match these filters.</p>
            ) : (
              <ul className="flex flex-col gap-[27px] pt-[32px]">
                {rows.map((u) => (
                  <li key={u.id} className={`grid ${columns} items-center text-sm font-medium leading-4 tracking-[0.28px] text-dak-body`}>
                    <div className="flex min-w-0 items-center gap-[11px] pr-3">
                      <Image src={u.avatar} alt="" width={40} height={40} className="size-10 shrink-0 rounded-full" />
                      <div className="flex min-w-0 flex-col gap-2">
                        <p className="truncate text-lg font-semibold leading-normal tracking-[-0.2px] text-dak-heading">{u.name}</p>
                        <p className="truncate">{u.email}</p>
                      </div>
                    </div>
                    <span className="truncate pr-3">{u.id}</span>
                    <span>{u.type}</span>
                    <span>
                      <StatusBadge label={u.status} tone={accountStatusTone(u.status)} />
                    </span>
                    <span>{u.reports}</span>
                    <span className="whitespace-nowrap">{u.lastActive}</span>
                    <Link
                      href={`/users/${u.id}`}
                      className="flex h-10 w-[110px] items-center justify-center rounded-3xl bg-dak-cta px-2 text-sm font-medium tracking-[0.28px] text-dak-heading"
                    >
                      See Details
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dak-muted/50 pt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium leading-4 tracking-[0.28px] text-dak-body">Total Users:</span>
            <span className="rounded-[30px] border border-dak-muted px-4 py-2 text-sm font-semibold tracking-[-0.2px] text-dak-muted">
              {totalUsers}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
              className="h-12 rounded-[30px] border border-dak-muted px-6 text-base font-semibold tracking-[-0.2px] text-dak-muted enabled:hover:text-dak-heading"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={current >= pageCount - 1}
              onClick={() => setPage(current + 1)}
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
