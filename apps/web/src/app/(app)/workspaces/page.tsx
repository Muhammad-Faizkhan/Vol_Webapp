"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { timeAgo, type Paged, type WorkspaceCard as WorkspaceCardData } from "@vol/api-client";
import { useApiQuery, withQuery } from "@vol/api-client/react";
import { CreateCanvasButton } from "@/components/canvas/CreateCanvasButton";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";
import { EmptyState, ErrorState, LoadingGrid, Pager } from "@/components/ui/States";
import { updatedTag } from "@/lib/format";

export default function WorkspacesPage() {
  const [tab, setTab] = useState<"business" | "mine">("mine");
  const [page, setPage] = useState(1);
  const { data, error, isLoading, mutate } = useApiQuery<Paged<WorkspaceCardData>>(
    withQuery("/workspaces", { scope: tab, page, limit: 12 }),
  );
  const total = data?.total;

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
              {total === undefined
                ? "Your projects, canvases and collaborators."
                : `${total} ${tab === "mine" ? "workspace" : "shared workspace"}${total === 1 ? "" : "s"} · projects, canvases and collaborators in one place.`}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <CreateCanvasButton className="flex h-14 items-center justify-center gap-4 rounded-xl border border-light-border bg-app-dark-surface px-[17px] text-base text-white">
            <Image src="/icons/new-canvas-white.svg" alt="" width={12} height={15} />
            Create Canvas
          </CreateCanvasButton>
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
          onClick={() => {
            setTab("business");
            setPage(1);
          }}
          className={`flex shrink-0 flex-col items-center gap-2 pb-2 text-lg font-medium ${
            tab === "business" ? "text-auth-navy dark:text-dak-heading" : "text-[#929292] dark:text-dak-muted"
          }`}
        >
          Add by Business Profiles
          <span className={`h-1 w-full rounded-full ${tab === "business" ? "bg-auth-navy dark:bg-dak-cta" : "bg-transparent"}`} />
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("mine");
            setPage(1);
          }}
          className={`flex shrink-0 flex-col items-center gap-2 pb-2 text-lg font-medium ${
            tab === "mine" ? "text-auth-navy dark:text-dak-heading" : "text-[#929292] dark:text-dak-muted"
          }`}
        >
          My Workspaces
          <span className={`h-1 w-full rounded-full ${tab === "mine" ? "bg-auth-navy dark:bg-dak-cta" : "bg-transparent"}`} />
        </button>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={() => mutate()} />
      ) : isLoading || !data ? (
        <LoadingGrid />
      ) : data.items.length === 0 ? (
        tab === "mine" ? (
          <EmptyState
            title="No workspaces yet"
            body="Create a workspace to organise canvases and invite collaborators."
            action={{ label: "Create Workspace", href: "/workspaces/create" }}
          />
        ) : (
          <EmptyState title="Nothing shared yet" body="Workspaces that businesses invite you to will appear here." />
        )
      ) : tab === "mine" ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {data.items.map((ws) => (
            <WorkspaceCard
              key={ws.id}
              variant="grid"
              showCollaboratorFooter={false}
              href={`/workspaces/${ws.id}`}
              title={ws.name}
              meta={`${ws.canvasCount} canvas${ws.canvasCount === 1 ? "" : "es"} · ${ws.memberCount} member${ws.memberCount === 1 ? "" : "s"}`}
              metaSecondary={`Edited ${timeAgo(ws.lastActivityAt)} · ${ws.productCount} Product${ws.productCount === 1 ? "" : "s"}`}
              collaboratorCount={ws.memberCount}
              updatedTag={updatedTag(ws.lastActivityAt)}
              imageSrc={ws.imageUrl ?? undefined}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {data.items.map((ws) => (
            <WorkspaceCard
              key={ws.id}
              href={`/workspaces/${ws.id}`}
              title={ws.name}
              workspace={`By ${ws.owner.name}`}
              editedAgo={`Edited ${timeAgo(ws.lastActivityAt)}`}
              updatedTag={updatedTag(ws.lastActivityAt)}
              collaborators={ws.members}
              collaboratorCount={ws.memberCount}
              imageSrc={ws.imageUrl ?? undefined}
            />
          ))}
        </div>
      )}
      {data && <Pager page={data.page} pages={data.pages} onPage={setPage} />}
    </div>
  );
}

