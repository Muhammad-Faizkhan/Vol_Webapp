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
}));

export default function BusinessDashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
            Welcome back, Abc Business
          </h1>
          <p className="text-base text-auth-slate">
            MasterTile Inc. Here is your overview for today.
          </p>
        </div>
        <Link
          href="/business/products/add"
          className="flex items-center gap-2 rounded-lg bg-auth-navy px-4 py-2.5 text-base font-medium text-white"
        >
          + Add Product
        </Link>
      </div>

      <div className="flex gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-light-border bg-[#f8f9ff] px-[25px] py-[17px]"
          >
            <span className="text-sm font-medium tracking-[0.28px] text-auth-navy">
              {stat.label}
            </span>
            <p className="text-2xl font-medium text-auth-navy">
              {stat.value} <span className="text-sm text-[#889298]">{stat.note}</span>
            </p>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <h3 className="text-2xl font-medium text-auth-navy">Your Product Catalog</h3>
        <div className="flex flex-wrap gap-6">
          {products.map((p, i) => (
            <ProductCard key={i} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}
