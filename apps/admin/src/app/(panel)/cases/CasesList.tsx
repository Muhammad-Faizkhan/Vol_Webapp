"use client";

import Link from "next/link";
import { useState } from "react";
import { errorMessage, formatDate, type AdminCaseList, type CaseStatus } from "@vol/api-client";
import { useApiQuery, withQuery } from "@vol/api-client/react";
import { Chips } from "@/components/ui/Chips";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge, type BadgeTone } from "@/components/ui/StatusBadge";
import { caseStatusLabel } from "@/lib/admin";

const filters = [
  { value: "", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "DISMISSED", label: "Dismissed" },
];

const tone: Record<CaseStatus, BadgeTone> = { OPEN: "success", IN_REVIEW: "warning", RESOLVED: "info", DISMISSED: "neutral" };
const border: Record<CaseStatus, string> = {
  OPEN: "border-adm-success/60",
  IN_REVIEW: "border-adm-warning/60",
  RESOLVED: "border-adm-blue/60",
  DISMISSED: "border-dak-muted/60",
};

export function CasesList() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const { data, error } = useApiQuery<AdminCaseList>(withQuery("/admin/cases", { status: filter || undefined, q: q.trim(), page, limit: 10 }));

  const stats = data
    ? [
        { label: "Open escalations", value: data.stats.open },
        { label: "In review", value: data.stats.inReview },
        { label: "Reopened this month", value: data.stats.reopenedThisMonth },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Cases" subtitle="Reports from members are grouped into one case per account. Decisions here are final and audit-logged." />

      <div className="flex flex-wrap gap-[19px]">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex h-[120px] min-w-[180px] flex-col gap-3 rounded-lg border border-dak-cta bg-dak-surface px-10 py-6 drop-shadow-[0px_4px_4px_rgba(148,54,251,0.25)]"
          >
            <p className="text-sm font-medium leading-4 tracking-[0.28px] text-dak-body">{s.label}</p>
            <p className="text-[28px] font-medium leading-6 tracking-[0.28px] text-dak-heading">{String(s.value).padStart(2, "0")}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Chips
          label="Filter cases"
          items={filters}
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
        />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search by title, violation or ESC id"
          aria-label="Search cases"
          className="h-10 w-full max-w-[320px] rounded-xl border-[0.5px] border-adm-input-border bg-[#0b0f19] px-4 text-base text-dak-heading placeholder:text-adm-placeholder focus:border-dak-cta focus:outline-none"
        />
      </div>

      {error && <p className="text-adm-danger">{errorMessage(error)}</p>}
      {data?.items.length === 0 && <p className="text-dak-body">No cases here. 🎉</p>}

      <ul className="flex w-full max-w-[750px] flex-col gap-4">
        {data?.items.map((c) => (
          <li key={c.id}>
            <Link
              href={`/cases/${c.displayId}`}
              className={`flex items-center justify-between gap-6 rounded-2xl border bg-dak-surface p-6 transition-colors hover:bg-[#161616] ${border[c.status]}`}
            >
              <div className="flex min-w-0 flex-col gap-4 font-medium tracking-[0.28px]">
                {/* Figma writes the id as "Esc-0001" in the list and "ESC-0001" on the detail page. */}
                <p className="text-sm leading-4 text-dak-body">{c.displayId.replace("ESC", "Esc")}</p>
                <p className="text-lg leading-6 text-dak-heading">{c.title}</p>
                <p className="text-sm leading-4 text-dak-body">
                  {c.reporter?.name ?? "Member report"} · opened {formatDate(c.createdAt)} · {c.reportCount} report{c.reportCount === 1 ? "" : "s"}
                </p>
              </div>
              <StatusBadge label={caseStatusLabel[c.status]} tone={tone[c.status]} />
            </Link>
          </li>
        ))}
      </ul>

      {data && data.pages > 1 && (
        <div className="flex max-w-[750px] items-center justify-between">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="h-12 rounded-[30px] border border-dak-muted px-6 text-base font-semibold text-dak-muted disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-dak-body">
            Page {page} of {data.pages}
          </span>
          <button type="button" disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="h-12 rounded-[30px] bg-dak-cta px-6 text-base font-semibold text-dak-heading disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
