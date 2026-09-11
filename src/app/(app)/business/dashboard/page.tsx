import Link from "next/link";
import { ProductCard } from "@/components/cards/ProductCard";

const stats = [
  { label: "ACTIVE WORKSPACES", value: "6", note: "+1 this week" },
  { label: "TOTAL PRODUCTS", value: "24", note: "4 shared publicly" },
  { label: "CANVASES", value: "24", note: "4 shared publicly" },
  { label: "FOLLOWERS", value: "128", note: "+12 this month" },
];

const products = Array.from({ length: 8 }).map((_, i) => ({
  href: `/business/products/${i + 1}/edit`,
  brand: "Schluter Systems",
  name: "Abc Product",
  specs: [
    ["Coverage", "54 sq ft / roll"],
    ["True Size", "600 × 1200 MM"],
    ["Thickness", '1/8" (3mm)'],
    ["Rotation", "0"],
  ] as [string, string][],
  imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
}));

export default function BusinessDashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
            Welcome back, Abc Business
          </h1>
          <p className="text-base text-auth-slate dark:text-dak-body">
            MasterTile Inc. Here is your overview for today.
          </p>
        </div>
        <Link
          href="/business/products/add"
          className="flex w-fit items-center gap-2 rounded-lg bg-dak-cta px-4 py-2.5 text-base font-medium text-white"
        >
          + Add Product
        </Link>
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

      <section className="flex flex-col gap-4">
        <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Your Product Catalog</h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          {products.map((p, i) => (
            <ProductCard key={i} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}
