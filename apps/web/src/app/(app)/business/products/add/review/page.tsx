"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessage } from "@vol/api-client";
import { useInvalidate } from "@vol/api-client/react";
import { DRAFT_KEY, draftToBody, type ProductDraft } from "@/components/products/ProductForm";
import { Stepper } from "@/components/ui/Stepper";
import { useToast } from "@/components/ui/Toast";
import { UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

export default function ReviewProductPage() {
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [saving, setSaving] = useState<"PUBLISHED" | "DRAFT" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(DRAFT_KEY);
    if (!saved) {
      router.replace("/business/products/add");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(JSON.parse(saved));
  }, [router]);

  async function save(status: "PUBLISHED" | "DRAFT") {
    if (!draft) return;
    setSaving(status);
    setError(null);
    try {
      await api.post("/products", { ...draftToBody(draft), status });
      sessionStorage.removeItem(DRAFT_KEY);
      await invalidate("/products", "/users/me/stats");
      toast(status === "PUBLISHED" ? "Product published" : "Draft saved");
      router.push("/business/dashboard");
    } catch (err) {
      setError(errorMessage(err));
      setSaving(null);
    }
  }

  if (!draft) return null;
  const dims: [string, string][] = [
    ["Height", draft.heightMm ? `${draft.heightMm} mm` : "—"],
    ["Width", draft.widthMm ? `${draft.widthMm} mm` : "—"],
    ["Length", draft.lengthMm ? `${draft.lengthMm} mm` : "—"],
    ["Weight", draft.weightKg ? `${draft.weightKg} kg` : "—"],
  ];
  const [cover, ...rest] = draft.images;

  return (
    <div className="flex w-full max-w-[800px] flex-col gap-4">
      <Link href="/business/products/add" className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </Link>

      <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">Review &amp; Publish</h1>
      <p className="text-base text-auth-slate dark:text-dak-body">Verify all product details before committing to the catalog.</p>

      <Stepper steps={["Identity", "Specs", "Review"]} currentStep={2} />

      <div className="relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl bg-auth-navy dark:bg-dak-surface">
        {cover ? <UserImage src={cover} /> : <span className="text-sm text-white/70">No images added</span>}
      </div>
      {rest.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {rest.map((src) => (
            <div key={src} className="relative aspect-square w-full min-w-0 overflow-hidden rounded-2xl">
              <UserImage src={src} />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(198,198,205,0.4)] dark:bg-dak-surface">
        <div className="flex items-center justify-between border-b border-light-border pb-4 dark:border-[rgba(198,198,205,0.4)]">
          <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Product Details</h3>
          <EditLink />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Field label="Product Name" value={draft.name} />
          <Field label="Category" value={draft.category || "—"} />
          <Field label="Brand" value={draft.brand || "—"} />
          <Field label="Trade" value={draft.trade || "—"} />
          <div className="col-span-2 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#929292] dark:text-dak-muted">Short Description</span>
            <span className="whitespace-pre-wrap text-sm text-auth-navy dark:text-dak-heading">{draft.description || "—"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(198,198,205,0.4)] dark:bg-dak-surface">
        <div className="flex items-center justify-between border-b border-light-border pb-4 dark:border-[rgba(198,198,205,0.4)]">
          <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Dimensional</h3>
          <EditLink />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {dims.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-4 rounded border border-light-border bg-[#f8f9ff] p-3 dark:border-[rgba(198,198,205,0.3)] dark:bg-[#2b2b31]">
              <span className="text-sm font-semibold text-auth-slate dark:text-dak-body">{label}</span>
              <span className="text-base font-medium text-auth-navy dark:text-dak-heading">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => save("DRAFT")}
          disabled={!!saving}
          className="rounded-2xl border border-light-border px-8 py-4 text-base font-medium text-auth-navy disabled:opacity-60 dark:border-dak-border dark:text-dak-heading"
        >
          {saving === "DRAFT" ? "Saving…" : "Save as draft"}
        </button>
        <button
          type="button"
          onClick={() => save("PUBLISHED")}
          disabled={!!saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-dak-cta py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)] disabled:opacity-60"
        >
          {saving === "PUBLISHED" ? "Publishing…" : "Publish Product"}
          <Image src="/icons/arrow-right-small.svg" alt="" width={12} height={12} />
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#929292] dark:text-dak-muted">{label}</span>
      <span className="text-base font-medium text-auth-navy dark:text-dak-heading">{value}</span>
    </div>
  );
}

function EditLink() {
  return (
    <Link href="/business/products/add" className="flex items-center gap-1 text-xs font-semibold text-auth-navy dark:text-dak-heading">
      <Image src="/icons/edit-pencil.svg" alt="" width={12} height={12} className="invert dark:invert-0" />
      Edit
    </Link>
  );
}
