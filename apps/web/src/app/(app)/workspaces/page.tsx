"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";

const workspaces = Array.from({ length: 4 }).map((_, i) => ({
  href: `/workspaces/${i + 1}`,
  title: "Abc Workspace",
  meta: "8 canvases · 5 members",
  metaSecondary: "Edited 12min ago . 4 Products",
  collaboratorCount: 3,
  updatedTag: i % 2 === 1 ? "UPDATED 2H AGO" : undefined,
  imageSrc: "/illustrations/canvas-thumb-moodboard.png",
}));

const businessWorkspaceAvatars = ["/avatars/avatar-1.jpg", "/avatars/avatar-2.jpg", "/avatars/avatar-3.jpg"];

const businessWorkspaces = Array.from({ length: 4 }).map((_, i) => ({
  href: `/workspaces/business-${i + 1}`,
  title: "Lorem Ipsum Title",
  workspace: "Lorem Ipsum Workspace",
  editedAgo: "Edited 12min ago",
  updatedTag: "UPDATED 2H AGO",
  collaboratorAvatars: businessWorkspaceAvatars,
  collaboratorCount: 2,
  imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
}));

export default function WorkspacesPage() {
  const [tab, setTab] = useState<"business" | "mine">("mine");

  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-auth-navy dark:border-dak-border sm:size-20">
            <Image src="/illustrations/classroom-thumb-engineers.jpg" alt="" fill className="object-cover" />
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
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <Link
            href="/canvas/1"
            className="flex h-14 items-center justify-center gap-4 rounded-xl border border-light-border bg-app-dark-surface px-[17px] text-base text-white"
          >
            <Image src="/icons/new-canvas-white.svg" alt="" width={12} height={15} />
            Create Canvas
          </Link>
          <Link
            href="/workspaces/create"
            className="flex h-14 items-center justify-center gap-4 rounded-xl bg-dak-cta px-4 text-base text-white"
          >
            <Image src="/icons/new-workspace.svg" alt="" width={16} height={12} />
            Create Workspace
          </Link>
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
            <WorkspaceCard key={i} variant="grid" showCollaboratorFooter={false} {...ws} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {businessWorkspaces.map((ws, i) => (
            <WorkspaceCard key={i} {...ws} />
          ))}
        </div>
      )}
    </div>
  );
}
