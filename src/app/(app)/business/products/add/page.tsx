import Image from "next/image";
import Link from "next/link";
import { Stepper } from "@/components/ui/Stepper";

export default function AddNewProductPage() {
  return (
    <div className="flex w-full max-w-[800px] flex-col gap-4">
      <Link href="/business/dashboard" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
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
        Add New Product
      </h1>

      <Stepper steps={["Identity", "Specs", "Review"]} currentStep={0} />

      <div className="flex h-[130px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-light-border bg-[#dcdcdc] dark:border-dak-border dark:bg-dak-surface">
        <Image src="/icons/new-canvas.svg" alt="" width={24} height={24} className="dark:invert" />
        <p className="text-sm text-auth-navy dark:text-dak-heading">
          <span className="font-semibold">Upload image</span>{" "}
          <span className="text-[#929292] dark:text-dak-muted">or drag and drop</span>
        </p>
        <span className="text-xs text-[#929292] dark:text-dak-muted">PDF, PNG, JPG up to 10MB</span>
      </div>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Product Name</label>
          <input
            type="text"
            placeholder="e.g. High-Capacity Chiller Unit TX-500"
            className="h-14 w-full rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Brand / Manufacturer</label>
            <div className="relative">
              <select
                defaultValue=""
                className="h-14 w-full appearance-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-muted"
              >
                <option value="" disabled>
                  Select Manufacturer
                </option>
                <option>Schluter Systems</option>
              </select>
              <Image
                src="/icons/dropdown-arrow.svg"
                alt=""
                width={20}
                height={20}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 dark:invert"
              />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Product Category</label>
            <div className="relative">
              <select
                defaultValue=""
                className="h-14 w-full appearance-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-muted"
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option>Tiling</option>
              </select>
              <Image
                src="/icons/dropdown-arrow.svg"
                alt=""
                width={20}
                height={20}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 dark:invert"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Short Description</label>
          <textarea
            rows={3}
            placeholder="Provide a brief overview of the product's primary function and application within the project context..."
            className="w-full resize-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 py-3 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
          <h3 className="border-b border-light-border pb-4 text-2xl font-semibold text-auth-navy dark:border-dak-border dark:text-dak-heading">
            Dimensions
          </h3>
          <div className="flex gap-4">
            {["Length", "Width", "Height"].map((label) => (
              <div key={label} className="flex min-w-0 flex-1 flex-col gap-2">
                <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">{label} (mm)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="h-12 w-full min-w-0 rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
                />
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/business/products/add/specs"
          className="rounded-full bg-dak-cta py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]"
        >
          Continue to Specs
        </Link>
      </form>
    </div>
  );
}
