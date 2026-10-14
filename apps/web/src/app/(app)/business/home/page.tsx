"use client";

import Link from "next/link";
import { timeAgo, type CanvasCard, type MyStats, type Notification, type Paged, type Product, type WorkspaceCard as WorkspaceCardData } from "@vol/api-client";
import { useApiQuery, useAuth } from "@vol/api-client/react";
import { CreateCanvasButton } from "@/components/canvas/CreateCanvasButton";
import { ProductCard } from "@/components/cards/ProductCard";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { UserImage } from "@/components/ui/UserImage";
import { CanvasGrid } from "@/components/workspace/CanvasGrid";
import { greeting, plural, productSpecs } from "@/lib/format";

const emptyText = "text-sm text-[#45464d] dark:text-dak-muted";

export default function BusinessHomePage() {
  const { user } = useAuth();
  const { data: stats } = useApiQuery<MyStats>("/users/me/stats");
  const { data: canvases } = useApiQuery<Paged<CanvasCard>>("/canvases/recent?limit=3");
  const { data: products } = useApiQuery<Paged<Product>>("/products/mine?limit=3");
  const { data: workspaces } = useApiQuery<Paged<WorkspaceCardData>>("/workspaces?limit=4");
  const { data: notes } = useApiQuery<Paged<Notification>>("/notifications?limit=2");

  const statCards = [
    { label: "ACTIVE WORKSPACES", value: stats?.workspaces.total, note: `+${stats?.workspaces.newThisWeek ?? 0} this week` },
    { label: "TOTAL PRODUCTS", value: stats?.products.total, note: `${stats?.products.public ?? 0} shared publicly` },
    { label: "CANVASES", value: stats?.canvases.total, note: `${stats?.canvases.public ?? 0} shared publicly` },
    { label: "FOLLOWERS", value: stats?.followers.total, note: `+${stats?.followers.newThisMonth ?? 0} this month` },
  ];
  const business = user?.business;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
            {greeting()}, {user?.name}
          </h1>
          <p className="text-base text-auth-slate dark:text-dak-body">
            {business?.verification === "PENDING"
              ? "Your business verification is under review. Here is your overview for today."
              : "Here is your overview for today."}
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <CreateCanvasButton className="flex h-14 items-center justify-center gap-4 rounded-xl border border-app-dark-surface bg-app-dark-surface px-[17px] text-base text-white">
            Create Canvas
          </CreateCanvasButton>
          <Link href="/workspaces/create" className="flex h-14 items-center justify-center gap-4 rounded-xl bg-dak-cta px-4 text-base text-white">
            Create Workspace
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-4 rounded-lg border border-light-border bg-[#f8f9ff] px-[25px] py-[17px] dark:border-dak-cta dark:bg-dak-surface"
          >
            <span className="text-sm font-medium tracking-[0.28px] text-auth-navy dark:text-dak-heading">{stat.label}</span>
            <p className="text-2xl font-medium text-auth-navy dark:text-dak-heading">
              {stat.value ?? "–"} <span className="text-sm text-[#889298] dark:text-dak-muted">{stats ? stat.note : ""}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex min-w-0 flex-col gap-8 lg:flex-[2]">
          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Recent Canvases</h3>
              {canvases?.items[0] && (
                <Link href={`/canvas/${canvases.items[0].id}`} className="text-base font-medium text-dak-cta">
                  Open Last Canvas
                </Link>
              )}
            </div>
            {canvases?.items.length === 0 && <p className={emptyText}>Canvases you create or edit show up here.</p>}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">{canvases && <CanvasGrid canvases={canvases.items} />}</div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Your Product Catalog</h3>
              <Link href="/business/dashboard" className="text-base font-medium text-dak-cta">
                Open Catalog
              </Link>
            </div>
            {products?.items.length === 0 && (
              <p className={emptyText}>
                No products yet.{" "}
                <Link href="/business/products/add" className="font-medium text-dak-cta">
                  Add your first product
                </Link>
                .
              </p>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {products?.items.map((p) => (
                <ProductCard
                  key={p.id}
                  href={`/business/products/${p.id}/edit`}
                  brand={p.brand ?? "—"}
                  name={p.name}
                  specs={productSpecs(p)}
                  imageSrc={p.images[0]}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="flex w-full flex-col gap-6 lg:sticky lg:top-[116px] lg:flex-1 lg:self-start">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Notifications</h3>
            {notes?.items.length === 0 && <p className={emptyText}>You&apos;re all caught up.</p>}
            {notes?.items.map((n) => (
              <NotificationItem key={n.id} n={n} />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Active Workspaces</h3>
            <div className="overflow-hidden rounded-lg border border-light-border dark:border-dak-border">
              <div className="bg-[#e7e8e9] px-6 py-3 text-sm font-medium tracking-[0.28px] text-auth-navy dark:bg-dak-bg dark:text-dak-heading">
                Active Workspaces ({workspaces?.total ?? 0})
              </div>
              <div className="flex flex-col bg-[#f8f9ff] dark:bg-dak-surface">
                {workspaces?.items.length === 0 && <p className={`p-4 ${emptyText}`}>No workspaces yet.</p>}
                {workspaces?.items.map((ws, i) => (
                  <Link
                    key={ws.id}
                    href={`/workspaces/${ws.id}`}
                    className={`flex items-center gap-3 p-4 ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}
                  >
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-auth-navy dark:bg-dak-cta">
                      <UserImage src={ws.imageUrl} fallback="/illustrations/canvas-thumb-mortar-pattern.jpg" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{ws.name}</span>
                      <span className="text-xs text-[#929292] dark:text-dak-muted">
                        {plural(ws.memberCount, "member")} • Updated {timeAgo(ws.lastActivityAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/workspaces" className="flex items-center justify-center bg-[#f2f2f3] py-3 text-sm font-medium text-auth-navy dark:bg-dak-bg dark:text-dak-heading">
                View All Workspaces
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
