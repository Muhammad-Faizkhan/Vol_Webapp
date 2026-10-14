"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  timeAgo,
  type BusinessSuggestion,
  type CanvasCard,
  type ClassroomCard,
  type MyStats,
  type Notification,
  type Paged,
  type Post,
  type Product,
  type WorkspaceCard as WorkspaceCardData,
} from "@vol/api-client";
import { useApiQuery, useAuth } from "@vol/api-client/react";
import { CreateCanvasButton } from "@/components/canvas/CreateCanvasButton";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";
import { FollowButton } from "@/components/social/FollowButton";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Avatar, UserImage } from "@/components/ui/UserImage";
import { CommunityPostCard, FeedToggle } from "@/components/social/CommunityPostCard";
import { greeting, plural, updatedTag } from "@/lib/format";

// Figma's Recent Canvases table: 290 / 193 / 94 / 81px columns with 62px gaps
// at the full 935px width (workspace widened to 200px so its text is not clipped by
// browser font metrics); the two text columns shrink (and truncate) below that.
const canvasTableCols =
  "grid grid-cols-[minmax(0,290px)_minmax(0,200px)_94px_81px] items-center gap-x-[clamp(16px,3.3vw,62px)]";

const sectionHeading = "text-xl font-semibold leading-8 sm:text-2xl text-[#020204] dark:text-dak-heading";
const sectionLink = "shrink-0 whitespace-nowrap text-sm font-medium leading-3 text-dak-cta sm:text-base";
const sidePanel =
  "rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface";
const emptyText = "text-sm text-[#45464d] dark:text-dak-muted";

export default function HomePage() {
  const { user } = useAuth();
  const [feed, setFeed] = useState<"trending" | "following">("following");

  const { data: stats } = useApiQuery<MyStats>("/users/me/stats");
  const { data: workspaces } = useApiQuery<Paged<WorkspaceCardData>>("/workspaces?limit=2");
  const { data: classrooms } = useApiQuery<Paged<ClassroomCard>>("/classrooms?scope=explore&limit=2");
  const { data: canvases } = useApiQuery<Paged<CanvasCard>>("/canvases/recent?limit=4");
  const { data: posts } = useApiQuery<Paged<Post>>(`/posts?feed=${feed}&limit=2`);
  const { data: products } = useApiQuery<Paged<Product>>("/products?sort=newest&limit=3");
  const { data: notes } = useApiQuery<Paged<Notification>>("/notifications?limit=15");
  const { data: suggestions } = useApiQuery<BusinessSuggestion[]>("/users/suggestions?limit=4");
  const { data: active } = useApiQuery<Paged<ClassroomCard>>("/classrooms?scope=active&limit=2");

  // Actionable notifications first, then the newest.
  const sideNotes = (notes?.items ?? [])
    .slice()
    .sort((a, b) => Number(!a.resolved && a.type.startsWith("WORKSPACE_")) - Number(!b.resolved && b.type.startsWith("WORKSPACE_")))
    .reverse()
    .slice(0, 2);

  const statCards = [
    { label: "ACTIVE WORKSPACES", value: stats?.workspaces.total, note: `+${stats?.workspaces.newThisWeek ?? 0} this week`, noteClassName: "text-[#34a853]" },
    { label: "CANVASES", value: stats?.canvases.total, note: `${stats?.canvases.public ?? 0} Shared publicly`, noteClassName: "text-[#2b2b31] dark:text-dak-muted" },
  ];
  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px] sm:leading-10">
            {greeting()}, {firstName}.
          </h1>
          <p className="text-base leading-6 text-[#2b2b31] dark:text-dak-body">Here&apos;s what&apos;s happening across your network.</p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <CreateCanvasButton className="flex h-14 items-center justify-center gap-4 rounded-xl border border-light-border bg-app-dark-surface px-[17px] text-base text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:w-[185px]">
            <Image src="/icons/new-canvas-white.svg" alt="" width={12} height={15} />
            Create Canvas
          </CreateCanvasButton>
          <Link
            href="/workspaces/create"
            className="flex h-14 items-center justify-center gap-4 rounded-xl bg-dak-cta px-4 text-base text-white sm:w-[209px]"
          >
            <Image src="/icons/new-workspace.svg" alt="" width={16} height={12} />
            Create Workspace
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex h-[88px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dak-cta bg-gradient-to-b from-white to-[#f3e8ff] px-[41px] drop-shadow-[0px_4px_4px_rgba(148,54,251,0.25)] dark:border-dak-cta dark:from-dak-surface dark:to-dak-surface sm:w-[240px]"
          >
            <span className="whitespace-nowrap text-sm font-medium leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-heading">{stat.label}</span>
            <p className="whitespace-nowrap font-medium leading-4 tracking-[0.28px]">
              <span className="text-[28px] text-[#020204] dark:text-dak-heading">{stat.value ?? "–"}</span>{" "}
              <span className={`text-sm ${stat.noteClassName}`}>{stats ? stat.note : ""}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex min-w-0 flex-col gap-8 lg:flex-[935]">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className={sectionHeading}>Recent Workspace</h3>
              <Link href="/workspaces" className={sectionLink}>
                View All Workspaces
              </Link>
            </div>
            {workspaces?.items.length === 0 && (
              <p className={emptyText}>
                No workspaces yet.{" "}
                <Link href="/workspaces/create" className="font-medium text-dak-cta">
                  Create your first one
                </Link>
                .
              </p>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
              {workspaces?.items.map((ws) => (
                <WorkspaceCard
                  key={ws.id}
                  href={`/workspaces/${ws.id}`}
                  title={ws.name}
                  workspace={plural(ws.canvasCount, "canvas", "canvases")}
                  editedAgo={`Edited ${timeAgo(ws.lastActivityAt)}`}
                  updatedTag={updatedTag(ws.lastActivityAt)}
                  collaborators={ws.members}
                  collaboratorCount={ws.memberCount}
                  imageSrc={ws.imageUrl ?? undefined}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <h3 className={sectionHeading}>Featured Classrooms</h3>
              <Link href="/classrooms" className={sectionLink}>
                Browse Classrooms
              </Link>
            </div>
            {classrooms?.items.length === 0 && <p className={emptyText}>No public classrooms yet.</p>}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[15px]">
              {classrooms?.items.map((c) => (
                <Link
                  key={c.id}
                  href={`/classrooms/${c.id}`}
                  className="flex min-h-[100px] w-full items-center gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white py-[9px] pl-6 pr-[25px] shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
                >
                  <div className="relative size-[60px] shrink-0 overflow-hidden rounded-2xl border-[0.5px] border-[#020204] dark:border-dak-border">
                    <UserImage src={c.imageUrl} fallback="/illustrations/classroom-thumb-laptop.jpg" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="truncate py-1 pr-4 text-sm font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">{c.title}</span>
                      <span className="truncate py-1 text-xs leading-4 tracking-[0.28px] text-[#45464d] dark:text-dak-muted">{c.instructor.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[`${c.enrolledCount} Enrolled`, c.progress === null ? "Public Preview" : "Enrolled"].map((tag) => (
                        <span key={tag} className="flex h-6 items-center rounded-[2px] bg-[rgba(148,54,251,0.1)] px-2 text-[10px] font-medium leading-[15px] text-dak-cta">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <h3 className={sectionHeading}>Recent Canvases</h3>
              {canvases?.items[0] && (
                <Link href={`/canvas/${canvases.items[0].id}`} className={sectionLink}>
                  Open Last Canvas
                </Link>
              )}
            </div>
            <div className="w-full overflow-x-auto rounded-2xl drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)]">
              <div className="min-w-[600px]">
                <div className={`${canvasTableCols} h-20 rounded-t-2xl bg-[#2b2b31] px-6 text-base leading-10 tracking-[-0.32px] text-white dark:bg-app-dark-surface`}>
                  <span className="truncate pl-2">Canvas</span>
                  <span className="truncate">Workspace</span>
                  <span className="whitespace-nowrap">Last Edited</span>
                  <span className="whitespace-nowrap pl-3">Visibility</span>
                </div>
                <div className="flex flex-col gap-4 rounded-b-2xl border-x border-b border-[rgba(43,43,49,0.4)] bg-white py-6 dark:border-dak-border dark:bg-dak-surface">
                  {canvases?.items.length === 0 && <p className={`px-6 ${emptyText}`}>Canvases you create or edit show up here.</p>}
                  {canvases?.items.map((row, i) => (
                    <Link
                      key={row.id}
                      href={`/canvas/${row.id}`}
                      className={`${canvasTableCols} h-14 px-6 ${i !== canvases.items.length - 1 ? "border-b-[0.5px] border-[#c793ff] dark:border-dak-border" : ""}`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-[#191919] dark:border-dak-border">
                          <UserImage src={row.thumbnailUrl} fallback="/illustrations/canvas-thumb-mortar-pattern.jpg" />
                        </div>
                        <span className="min-w-0 truncate text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">{row.title}</span>
                      </div>
                      <span className="truncate text-base leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-muted">{row.workspace.name}</span>
                      <span className="whitespace-nowrap text-base leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-muted">{timeAgo(row.updatedAt)}</span>
                      <span
                        className={`flex h-8 w-[81px] items-center justify-center rounded-lg border-[0.5px] text-sm font-medium leading-[15px] ${
                          row.visibility === "PUBLIC"
                            ? "border-[rgba(52,168,83,0.15)] bg-[rgba(52,168,83,0.15)] text-[#34a853]"
                            : "border-[rgba(2,2,4,0.15)] bg-[rgba(2,2,4,0.1)] text-[#020204] dark:border-dak-border dark:bg-dak-cta/10 dark:text-dak-heading"
                        }`}
                      >
                        {row.visibility === "PUBLIC" ? "Public" : "Private"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <h3 className={sectionHeading}>From the community</h3>
                <FeedToggle value={feed} onChange={setFeed} />
              </div>
              <Link href="/explore" className={sectionLink}>
                Explore
              </Link>
            </div>
            {posts?.items.length === 0 && (
              <p className={emptyText}>{feed === "following" ? "Follow people and businesses to see their posts here." : "No trending posts yet."}</p>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {posts?.items.map((p) => <CommunityPostCard key={p.id} post={p} />)}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className={sectionHeading}>New products near your trade</h3>
              <Link href="/products" className={sectionLink}>
                Open Catalog
              </Link>
            </div>
            {products?.items.length === 0 && <p className={emptyText}>No products have been published yet.</p>}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 xl:gap-[33px]">
              {products?.items.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="flex w-full flex-col gap-2 overflow-hidden rounded-lg border border-[rgba(43,43,49,0.4)] bg-white shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
                >
                  <div className="relative h-[130px] w-full overflow-hidden rounded-t-lg bg-[#2b2b31] dark:bg-dak-surface">
                    <UserImage src={p.images[0]} fallback="/illustrations/classroom-thumb-engineers.jpg" />
                  </div>
                  <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
                    <h4 className="text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">{p.name}</h4>
                    <span className="text-sm leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-muted">By {p.business.name}</span>
                    {p.size && (
                      <span className="flex h-6 w-fit items-center rounded-[2px] border border-dak-cta bg-[rgba(148,54,251,0.1)] px-[9px] text-[10px] font-medium leading-[15px] text-dak-cta">
                        {p.size}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="flex w-full flex-col gap-6 lg:sticky lg:top-[116px] lg:min-w-0 lg:flex-[452] lg:self-start">
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-medium leading-8 text-[#020204] dark:text-dak-heading">Notifications</h3>
            <div className="flex flex-col gap-4">
              {notes && sideNotes.length === 0 && <p className={emptyText}>You&apos;re all caught up.</p>}
              {sideNotes.map((n) => (
                <NotificationItem key={n.id} n={n} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold leading-8 text-[#020204] dark:text-dak-heading">Business profiles to follow</h3>
            <div className={`flex flex-col gap-8 ${sidePanel}`}>
              <div className="flex flex-col gap-6">
                {suggestions?.length === 0 && <p className={emptyText}>You follow every business we know about.</p>}
                {suggestions?.map((biz) => (
                  <div key={biz.id} className="flex items-center gap-4">
                    <Link href={`/business/${biz.id}`}>
                      <Avatar src={biz.avatarUrl} name={biz.name} />
                    </Link>
                    <Link href={`/business/${biz.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">{biz.name}</span>
                      <span className="truncate text-sm leading-5 text-[#2b2b31] dark:text-dak-muted">
                        {biz.industry ?? "Business"}. {plural(biz.productCount, "product")}
                      </span>
                    </Link>
                    <FollowButton userId={biz.id} initial={false} />
                  </div>
                ))}
              </div>
              <Link
                href="/explore?tab=peoples"
                className="flex items-center justify-center rounded-lg border border-[#2b2b31] py-[9px] text-base leading-6 text-[#020204] dark:border-dak-border dark:text-dak-heading"
              >
                See more in Explore
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold leading-8 text-[#020204] dark:text-dak-heading">My Classrooms</h3>
            <div className={`flex flex-col gap-4 ${sidePanel}`}>
              {active?.items.length === 0 && (
                <p className={emptyText}>
                  No classes in progress.{" "}
                  <Link href="/classrooms/join" className="font-medium text-dak-cta">
                    Join one with a code
                  </Link>
                  .
                </p>
              )}
              {active?.items.map((c) => (
                <Link
                  key={c.id}
                  href={`/classrooms/${c.id}`}
                  className="flex min-h-[105px] flex-col justify-center gap-2 rounded-2xl bg-[#2b2b31] px-6 py-4 drop-shadow-[0px_8px_4px_rgba(2,2,4,0.3)]"
                >
                  <div className="flex items-end justify-between gap-2">
                    <span className="truncate text-base leading-6 text-[#f3f3f3]">{c.title}</span>
                    <span className="text-base leading-6 text-white">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-xl bg-[#e0e0e0]">
                    <div className="h-full rounded-xl bg-dak-cta" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className="text-xs leading-[18px] text-white">
                    {c.completedLessons} of {plural(c.lessonCount, "lesson")} complete
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
