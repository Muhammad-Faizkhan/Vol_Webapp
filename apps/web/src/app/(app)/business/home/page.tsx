import Image from "next/image";
import Link from "next/link";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";
import { ProductCard } from "@/components/cards/ProductCard";

const stats = [
  { label: "ACTIVE WORKSPACES", value: "6", note: "+1 this week" },
  { label: "TOTAL PRODUCTS", value: "24", note: "4 shared publicly" },
  { label: "CANVASES", value: "24", note: "4 shared publicly" },
  { label: "FOLLOWERS", value: "128", note: "+12 this month" },
];

const canvases = [
  {
    href: "/canvas/1",
    title: "Lorem Ipsum Canvas",
    meta: "Lorem Ipsum Workspace",
    metaSecondary: "Edited 12min ago . 4 Products",
    updatedTag: "+3 Collabs",
    imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
  },
  {
    href: "/canvas/2",
    title: "Lorem Ipsum Canvas",
    meta: "Lorem Ipsum Workspace",
    metaSecondary: "Edited 12min ago . 4 Products",
    updatedTag: "+3 Collabs",
    imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
  },
  {
    href: "/canvas/3",
    title: "Lorem Ipsum Canvas",
    meta: "Lorem Ipsum Workspace",
    metaSecondary: "Edited 12min ago . 4 Products",
    updatedTag: "+3 Collabs",
    imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
  },
];

const products = Array.from({ length: 3 }).map((_, i) => ({
  href: `/business/products/${i + 1}/edit`,
  brand: "Schluter Systems",
  name: "Abc Product",
  specs: [
    ["Coverage", "54 sq ft / roll"],
    ["True Size", "600 × 1200 MM"],
  ] as [string, string][],
  imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
}));

const activeWorkspaces = [
  { name: "Bathroom Project", meta: "4 members • Updated today" },
  { name: "Training Materials", meta: "8 members • Updated yesterday" },
];

export default function BusinessHomePage() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
            Welcome back, Abc Business
          </h1>
          <p className="text-base text-auth-slate dark:text-dak-body">
            MasterTile Inc. Here is your overview for today.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <Link
            href="/canvas/1"
            className="flex h-14 items-center justify-center gap-4 rounded-xl border border-app-dark-surface bg-app-dark-surface px-[17px] text-base text-white"
          >
            Create Canvas
          </Link>
          <Link
            href="/workspaces/create"
            className="flex h-14 items-center justify-center gap-4 rounded-xl bg-dak-cta px-4 text-base text-white"
          >
            Create Workspace
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-4 rounded-lg border border-light-border bg-[#f8f9ff] px-[25px] py-[17px] dark:border-dak-cta dark:bg-dak-surface"
          >
            <span className="text-sm font-medium tracking-[0.28px] text-auth-navy dark:text-dak-heading">
              {stat.label}
            </span>
            <p className="text-2xl font-medium text-auth-navy dark:text-dak-heading">
              {stat.value} <span className="text-sm text-[#889298] dark:text-dak-muted">{stat.note}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex min-w-0 flex-col gap-8 lg:flex-[2]">
          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Recent Canvases</h3>
              <Link href="/canvas/1" className="text-base font-medium text-dak-cta">
                Open Last Canvas
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
              {canvases.map((canvas, i) => (
                <WorkspaceCard key={i} variant="grid" {...canvas} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Your Product Catalog</h3>
              <Link href="/business/dashboard" className="text-base font-medium text-dak-cta">
                Open Catalog
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {products.map((p, i) => (
                <ProductCard key={i} {...p} />
              ))}
            </div>
          </section>
        </div>

        <div className="flex w-full flex-col gap-6 lg:sticky lg:top-[116px] lg:flex-1 lg:self-start">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Notifications</h3>
            <div className="flex items-start gap-4 rounded-lg border border-light-border bg-[#f8f9ff] p-[17px] dark:border-dak-border dark:bg-dak-surface">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                <Image src="/avatars/avatar-1.jpg" alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-auth-navy dark:text-dak-heading">Abc Workspace Invitation</p>
                <p className="text-sm text-auth-navy dark:text-dak-body">
                  Mark Williams invited you as a collaborator
                </p>
                <div className="flex gap-2 pt-1">
                  <button className="rounded-lg bg-auth-navy px-3 py-1.5 text-xs font-medium text-white dark:bg-dak-cta">
                    Accept
                  </button>
                  <button className="rounded-lg border border-light-border px-3 py-1.5 text-xs font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading">
                    Decline
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-light-border bg-[#f8f9ff] p-[17px] dark:border-dak-border dark:bg-dak-surface">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                <Image src="/illustrations/canvas-thumb-mortar-pattern.jpg" alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-auth-navy dark:text-dak-heading">Workspace Code Accepted</p>
                <p className="text-sm text-auth-navy dark:text-dak-body">Mark Williams Accepted your request</p>
                <button className="mt-1 w-fit rounded-lg bg-auth-navy px-3 py-1.5 text-xs font-medium text-white dark:bg-dak-cta">
                  Open Classroom
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Active Workspaces</h3>
            <div className="overflow-hidden rounded-lg border border-light-border dark:border-dak-border">
              <div className="bg-[#e7e8e9] px-6 py-3 text-sm font-medium tracking-[0.28px] text-auth-navy dark:bg-dak-bg dark:text-dak-heading">
                Active Workspaces ({activeWorkspaces.length})
              </div>
              <div className="flex flex-col bg-[#f8f9ff] dark:bg-dak-surface">
                {activeWorkspaces.map((ws, i) => (
                  <div
                    key={ws.name}
                    className={`flex items-center gap-3 p-4 ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}
                  >
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                      <Image src="/illustrations/canvas-thumb-mortar-pattern.jpg" alt="" fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">{ws.name}</span>
                      <span className="text-xs text-[#929292] dark:text-dak-muted">{ws.meta}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/workspaces"
                className="flex items-center justify-center bg-[#f2f2f3] py-3 text-sm font-medium text-auth-navy dark:bg-dak-bg dark:text-dak-heading"
              >
                View All Workspaces
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
