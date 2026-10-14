"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DRAFT_KEY, emptyDraft, ProductForm, type ProductDraft } from "@/components/products/ProductForm";
import { Stepper } from "@/components/ui/Stepper";

export default function AddNewProductPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);

  // Coming back from the review step ("Edit") restores what was typed.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setDraft(JSON.parse(saved));
    } catch {
      // ignore unreadable drafts
    }
  }, []);

  function next() {
    if (!draft.name.trim()) return setError("Give the product a name.");
    if ([draft.heightMm, draft.widthMm, draft.lengthMm, draft.weightKg].some((v) => v !== "" && Number(v) < 0)) {
      return setError("Dimensions can't be negative.");
    }
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    router.push("/business/products/add/review");
  }

  return (
    <div className="flex w-full max-w-[800px] flex-col gap-4">
      <Link href="/business/dashboard" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </Link>

      <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">Add New Product</h1>

      <Stepper steps={["Identity", "Specs", "Review"]} currentStep={0} />

      <ProductForm
        value={draft}
        onChange={setDraft}
        error={error}
        onError={setError}
        footer={
          <div className="flex items-center justify-between gap-4 border-t border-light-border pt-6 dark:border-[rgba(43,43,49,0.4)]">
            <Link
              href="/business/dashboard"
              onClick={() => sessionStorage.removeItem(DRAFT_KEY)}
              className="rounded-full border border-light-border px-8 py-4 text-center text-base font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={next}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-dak-cta py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]"
            >
              Next Step
              <Image src="/icons/arrow-right-small.svg" alt="" width={12} height={12} />
            </button>
          </div>
        }
      />
    </div>
  );
}
