import Image from "next/image";
import Link from "next/link";

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  await params;

  return (
    <div className="flex w-full max-w-[800px] flex-col gap-4">
      <Link
        href="/business/dashboard"
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

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Edit Product
        </h1>
        <p className="text-base text-auth-slate dark:text-dak-body">
          Lorem Ipsum is simply dummy text of the printing and typesetting
        </p>
      </div>

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
            defaultValue="Abc Product"
            className="h-14 w-full rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Brand / Manufacturer</label>
            <div className="relative">
              <select
                defaultValue="Schluter Systems"
                className="h-14 w-full appearance-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading"
              >
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
                defaultValue="Tiling"
                className="h-14 w-full appearance-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading"
              >
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
            defaultValue="Coverage of 54 sq ft per roll, true size 600 x 1200mm, 1/8 inch (3mm) thickness."
            className="w-full resize-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 py-3 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
          <h3 className="border-b border-light-border pb-4 text-2xl font-semibold text-auth-navy dark:border-dak-border dark:text-dak-heading">
            Dimensions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Overall Height", "mm", "600"],
              ["Overall Width", "mm", "1200"],
              ["Overall Length", "mm", "1200"],
              ["Total Weight", "kg", "3.2"],
            ].map(([label, unit, value]) => (
              <div key={label} className="flex min-w-0 flex-col gap-2">
                <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">{label}</label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={value}
                    className="h-12 w-full min-w-0 rounded-lg border border-light-border bg-[#f8f9ff] px-4 pr-12 text-base text-auth-navy focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#929292] dark:text-dak-muted">
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-light-border pt-6 dark:border-[rgba(43,43,49,0.4)]">
          <Link
            href="/business/dashboard"
            className="rounded-full border border-light-border px-8 py-4 text-center text-base font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading"
          >
            Cancel
          </Link>
          <Link
            href="/business/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-dak-cta py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]"
          >
            Save Changes
          </Link>
        </div>
      </form>
    </div>
  );
}
