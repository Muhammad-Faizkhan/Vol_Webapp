"use client";

import Link from "next/link";
import { useState } from "react";
import { Chips } from "@/components/ui/Chips";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { caseStats, cases } from "@/lib/mock-data";

const filters = [
  { value: "all", label: "All" },
  { value: "Open", label: "Open" },
  { value: "In review", label: "In Review" },
];

export function CasesList() {
  const [filter, setFilter] = useState("all");
  const visible = cases.filter((c) => filter === "all" || c.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cases"
        subtitle="Only cases beyond moderator authority reach this queue. Decisions here are final."
      />

      <div className="flex flex-wrap gap-[19px]">
        {caseStats.map((s) => (
          <div
            key={s.label}
            className="flex h-[120px] min-w-[180px] flex-col gap-3 rounded-lg border border-dak-cta bg-dak-surface px-10 py-6 drop-shadow-[0px_4px_4px_rgba(148,54,251,0.25)]"
          >
            <p className="text-sm font-medium leading-4 tracking-[0.28px] text-dak-body">{s.label}</p>
            <p className="text-[28px] font-medium leading-6 tracking-[0.28px] text-dak-heading">{s.value}</p>
          </div>
        ))}
      </div>

      <Chips label="Filter cases" items={filters} value={filter} onChange={setFilter} />

      <ul className="flex w-full max-w-[750px] flex-col gap-4">
        {visible.map((c) => {
          const open = c.status === "Open";
          return (
            <li key={c.id}>
              <Link
                href={`/cases/${c.id}`}
                className={`flex items-center justify-between gap-6 rounded-2xl border bg-dak-surface p-6 transition-colors hover:bg-[#161616] ${
                  open ? "border-adm-success/60" : "border-adm-warning/60"
                }`}
              >
                <div className="flex min-w-0 flex-col gap-4 font-medium tracking-[0.28px]">
                  {/* Figma writes the id as "Esc-0001" in the list and "ESC-0001" on the detail page. */}
                  <p className="text-sm leading-4 text-dak-body">{c.id.replace("ESC", "Esc")}</p>
                  <p className="text-lg leading-6 text-dak-heading">{c.title}</p>
                  <p className="text-sm leading-4 text-dak-body">
                    {c.reporter} · opened {c.opened}
                  </p>
                </div>
                <StatusBadge label={c.status} tone={open ? "success" : "warning"} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
