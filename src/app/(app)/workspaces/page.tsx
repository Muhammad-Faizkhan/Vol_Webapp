"use client";

import Image from "next/image";
import { useState } from "react";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";

const workspaces = Array.from({ length: 6 }).map((_, i) => ({
  href: `/workspaces/${i + 1}`,
  title: "Abc Workspace",
  meta: "8 canvases · 5 members",
  metaSecondary: "Edited 12min ago . 4 Products",
  collaboratorCount: 3,
  imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
}));

const businessProfiles = [
  { name: "Abc Business", sub: "Distributor. 1,203 products", avatar: "/avatars/avatar-1.jpg" },
  { name: "Abc Business", sub: "Distributor. 1,203 products", avatar: "/avatars/avatar-2.jpg" },
  { name: "Abc Business", sub: "Distributor. 1,203 products", avatar: "/avatars/avatar-3.jpg" },
  { name: "Abc Business", sub: "Distributor. 1,203 products", avatar: "/avatars/avatar-1.jpg" },
];

export default function WorkspacesPage() {
  const [tab, setTab] = useState<"business" | "mine">("mine");

  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-light-border dark:border-dak-border sm:size-20">
          <Image src="/illustrations/canvas-thumb-mortar-pattern.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="flex flex-col gap-2 sm:gap-4">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy sm:text-[32px] dark:text-dak-heading">
            Workspaces
          </h1>
          <p className="text-base text-auth-slate dark:text-dak-body">
            8 Lorem Ipsum is simply dummy text of the printing and typesetting
          </p>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto border-b border-light-border dark:border-dak-border">
        <button
          type="button"
          onClick={() => setTab("business")}
          className={`flex shrink-0 flex-col items-center gap-2 pb-2 text-lg font-medium ${
            tab === "business" ? "text-auth-navy dark:text-dak-heading" : "text-[#929292] dark:text-dak-muted"
          }`}
        >
          Add by Business Profiles
          <span className={`h-1 w-full rounded-full ${tab === "business" ? "bg-auth-navy dark:bg-dak-cta" : "bg-transparent"}`} />
        </button>
        <button
          type="button"
          onClick={() => setTab("mine")}
          className={`flex shrink-0 flex-col items-center gap-2 pb-2 text-lg font-medium ${
            tab === "mine" ? "text-auth-navy dark:text-dak-heading" : "text-[#929292] dark:text-dak-muted"
          }`}
        >
          My Workspaces
          <span className={`h-1 w-full rounded-full ${tab === "mine" ? "bg-auth-navy dark:bg-dak-cta" : "bg-transparent"}`} />
        </button>
      </div>

      {tab === "mine" ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {workspaces.map((ws, i) => (
            <WorkspaceCard key={i} variant="grid" {...ws} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {businessProfiles.map((biz, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-light-border bg-[#f8f9ff] p-4 dark:border-dak-border dark:bg-dak-surface"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                <Image src={biz.avatar} alt="" fill className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{biz.name}</span>
                <span className="truncate text-xs text-[#929292] dark:text-dak-muted">{biz.sub}</span>
              </div>
              <button className="shrink-0 rounded-lg bg-auth-navy px-3 py-1.5 text-xs font-medium text-white dark:bg-dak-cta">
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
