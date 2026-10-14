"use client";

import Link from "next/link";
import { useState } from "react";
import type { MyStats, Paged, Product } from "@vol/api-client";
import { useApiQuery, useAuth, withQuery } from "@vol/api-client/react";
import { ProductCard } from "@/components/cards/ProductCard";
import { EmptyState, LoadingGrid, Pager } from "@/components/ui/States";
import { productSpecs } from "@/lib/format";

const FILTERS = [
  { value: undefined, label: "All" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Drafts" },
] as const;

export default function BusinessDashboardPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT" | undefined>();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { data: stats } = useApiQuery<MyStats>("/users/me/stats");
  const { data: products } = useApiQuery<Paged<Product>>(withQuery("/products/mine", { status, q: q.trim(), page, limit: 12 }));

  const statCards = [
    { label: "ACTIVE WORKSPACES", value: stats?.workspaces.total, note: `+${stats?.workspaces.newThisWeek ?? 0} this week` },
    { label: "TOTAL PRODUCTS", value: stats?.products.total, note: `${stats?.products.public ?? 0} shared publicly` },
    { label: "CANVASES", value: stats?.canvases.total, note: `${stats?.canvases.public ?? 0} shared publicly` },
    { label: "FOLLOWERS", value: stats?.followers.total, note: `+${stats?.followers.newThisMonth ?? 0} this month` },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">Welcome back, {user?.name}</h1>
          <p className="text-base text-auth-slate dark:text-dak-body">Manage the products you share with the network.</p>
        </div>
        <Link href="/business/products/add" className="flex w-fit items-center gap-2 rounded-lg bg-dak-cta px-4 py-2.5 text-base font-medium text-white">
          + Add Product
        </Link>
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

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Your Product Catalog</h3>
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() => {
                  setStatus(f.value);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  status === f.value ? "bg-app-dark-surface text-white dark:bg-dak-cta" : "border border-light-border text-auth-navy dark:border-dak-border dark:text-dak-heading"
                }`}
              >
                {f.label}
              </button>
            ))}
            <input
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search products"
              className="h-9 rounded-lg border border-light-border bg-white px-3 text-sm text-auth-navy focus:outline-none dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading"
            />
          </div>
        </div>
        {!products ? (
          <LoadingGrid minWidth={240} height={300} />
        ) : products.items.length === 0 ? (
          <EmptyState
            title={q || status ? "No matching products" : "Your catalog is empty"}
            body={q || status ? undefined : "Add products so people can place them on their canvases."}
            action={q || status ? undefined : { label: "+ Add Product", href: "/business/products/add" }}
          />
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
            {products.items.map((p) => (
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
        )}
        {products && <Pager page={products.page} pages={products.pages} onPage={setPage} />}
      </section>
    </div>
  );
}
