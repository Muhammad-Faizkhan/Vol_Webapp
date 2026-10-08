import Image from "next/image";
import Link from "next/link";
import { Stepper } from "@/components/ui/Stepper";

const dimensions = [
  ["Height", "8 x4mm"],
  ["Width", "8 x4mm"],
  ["Thickness", "8 x4mm"],
  ["Length", "8 x4mm"],
];

export default function ReviewProductPage() {
  return (
    <div className="flex w-full max-w-[800px] flex-col gap-4">
      <Link
        href="/business/products/add"
        className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading"
      >
        <Image
          src="/icons/arrow-narrow-right.svg"
          alt=""
          width={20}
          height={20}
          className="-scale-y-100 rotate-180 dark:invert"
        />
        Back
      </Link>

      <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
        Review &amp; Publish
      </h1>
      <p className="text-base text-auth-slate dark:text-dak-body">
        Verify all product details before committing to the catalog.
      </p>

      <Stepper steps={["Identity", "Specs", "Review"]} currentStep={2} />

      <div className="relative h-[320px] w-full overflow-hidden rounded-2xl">
        <Image src="/illustrations/classroom-thumb-engineers.jpg" alt="" fill className="object-cover" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative aspect-square w-full min-w-0 overflow-hidden rounded-2xl">
            <Image src="/illustrations/classroom-thumb-engineers.jpg" alt="" fill className="object-cover" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(198,198,205,0.4)] dark:bg-dak-surface">
        <div className="flex items-center justify-between border-b border-light-border pb-4 dark:border-[rgba(198,198,205,0.4)]">
          <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Product Details</h3>
          <Link
            href="/business/products/add"
            className="flex items-center gap-1 text-xs font-semibold text-auth-navy dark:text-dak-heading"
          >
            <Image src="/icons/edit-pencil.svg" alt="" width={12} height={12} className="invert dark:invert-0" />
            Edit
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#929292] dark:text-dak-muted">
              Product Name
            </span>
            <span className="text-base font-medium text-auth-navy dark:text-dak-heading">Lorem Ipsum Product</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#929292] dark:text-dak-muted">
              Category
            </span>
            <span className="text-base font-medium text-auth-navy dark:text-dak-heading">Fasteners</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#929292] dark:text-dak-muted">
              Brand
            </span>
            <span className="text-base font-medium text-auth-navy dark:text-dak-heading">AeroForge Hardware</span>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#929292] dark:text-dak-muted">
              Short Description
            </span>
            <span className="text-sm text-auth-navy dark:text-dak-heading">
              High-strength titanium grade 5 hex head bolt designed for aerospace and motorsport applications
              requiring extreme durability and low weight.
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(198,198,205,0.4)] dark:bg-dak-surface">
        <div className="flex items-center justify-between border-b border-light-border pb-4 dark:border-[rgba(198,198,205,0.4)]">
          <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Dimensional</h3>
          <Link
            href="/business/products/add"
            className="flex items-center gap-1 text-xs font-semibold text-auth-navy dark:text-dak-heading"
          >
            <Image src="/icons/edit-pencil.svg" alt="" width={12} height={12} className="invert dark:invert-0" />
            Edit
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {dimensions.map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-4 rounded border border-light-border bg-[#f8f9ff] p-3 dark:border-[rgba(198,198,205,0.3)] dark:bg-[#2b2b31]"
            >
              <span className="text-sm font-semibold text-auth-slate dark:text-dak-body">{label}</span>
              <span className="text-base font-medium text-auth-navy dark:text-dak-heading">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/business/dashboard"
        className="flex items-center justify-center gap-2 rounded-2xl bg-dak-cta py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]"
      >
        Publish Product
        <Image src="/icons/arrow-right-small.svg" alt="" width={12} height={12} />
      </Link>
    </div>
  );
}
