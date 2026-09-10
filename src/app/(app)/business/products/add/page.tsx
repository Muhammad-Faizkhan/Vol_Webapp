import Image from "next/image";
import Link from "next/link";
import { Stepper } from "@/components/ui/Stepper";

export default function AddNewProductPage() {
  return (
    <div className="flex w-full max-w-[800px] flex-col gap-4">
      <Link href="/business/dashboard" className="flex items-center gap-1.5 text-base font-medium text-auth-navy">
        <Image
          src="/icons/arrow-narrow-right.svg"
          alt=""
          width={20}
          height={20}
          className="-scale-y-100 rotate-180"
        />
        Back
      </Link>

      <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
        Add New Product
      </h1>

      <Stepper steps={["Identity", "Specs", "Review"]} currentStep={0} />

      <div className="flex h-[130px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-light-border bg-white">
        <Image src="/icons/new-canvas.svg" alt="" width={24} height={24} />
        <p className="text-sm text-auth-navy">
          <span className="font-semibold">Upload image</span>{" "}
          <span className="text-[#929292]">or drag and drop</span>
        </p>
        <span className="text-xs text-[#929292]">PDF, PNG, JPG up to 10MB</span>
      </div>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy">Product Name</label>
          <input
            type="text"
            placeholder="e.g. High-Capacity Chiller Unit TX-500"
            className="h-14 rounded-lg border border-light-border bg-white px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy">Brand / Manufacturer</label>
            <div className="relative">
              <select
                defaultValue=""
                className="h-14 w-full appearance-none rounded-lg border border-light-border bg-white px-4 text-base text-[#929292] focus:outline-none"
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
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy">Product Category</label>
            <div className="relative">
              <select
                defaultValue=""
                className="h-14 w-full appearance-none rounded-lg border border-light-border bg-white px-4 text-base text-[#929292] focus:outline-none"
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
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy">Short Description</label>
          <textarea
            rows={3}
            placeholder="Provide a brief overview of the product's primary function and application within the project context..."
            className="resize-none rounded-lg border border-light-border bg-white px-4 py-3 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6">
          <h3 className="border-b border-light-border pb-4 text-2xl font-semibold text-auth-navy">
            Dimensions
          </h3>
          <div className="flex gap-4">
            {["Length", "Width", "Height"].map((label) => (
              <div key={label} className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-medium text-auth-navy">{label} (mm)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="h-12 rounded-lg border border-light-border bg-white px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/business/products/add/specs"
          className="rounded-2xl bg-auth-slate py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(99,117,139,0.4)]"
        >
          Continue to Specs
        </Link>
      </form>
    </div>
  );
}
