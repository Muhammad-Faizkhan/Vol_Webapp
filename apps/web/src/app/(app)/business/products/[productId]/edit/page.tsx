"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { errorMessage, type Product } from "@vol/api-client";
import { useApiQuery, useInvalidate } from "@vol/api-client/react";
import { draftFromProduct, draftToBody, ProductForm, type ProductDraft } from "@/components/products/ProductForm";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

export default function EditProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, error } = useApiQuery<Product>(`/products/${productId}`);

  if (error) return <ErrorState error={error} />;
  if (!product) return null;
  if (!product.isMine) return <ErrorState error={new Error("You can only edit your own products.")} />;
  return <Editor key={product.id} product={product} />;
}

function Editor({ product }: { product: Product }) {
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const [draft, setDraft] = useState<ProductDraft>(() => draftFromProduct(product));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(status?: "PUBLISHED" | "DRAFT") {
    if (!draft.name.trim()) return setError("Give the product a name.");
    setBusy(true);
    setError(null);
    try {
      await api.patch(`/products/${product.id}`, { ...draftToBody(draft), ...(status ? { status } : {}) });
      await invalidate("/products", "/users/me/stats");
      toast(status === "PUBLISHED" ? "Product published" : status === "DRAFT" ? "Product unpublished" : "Changes saved");
      router.push("/business/dashboard");
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Remove "${product.name}" from your catalog?`)) return;
    try {
      await api.del(`/products/${product.id}`);
      await invalidate("/products", "/users/me/stats");
      toast("Product removed");
      router.push("/business/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const published = product.status === "PUBLISHED";

  return (
    <div className="flex w-full max-w-[800px] flex-col gap-4">
      <Link href="/business/dashboard" className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">Edit Product</h1>
          <p className="text-base text-auth-slate dark:text-dak-body">
            {published ? "Published · visible in the catalog" : "Draft · only you can see it"}
            {product.canvasCount > 0 && ` · on ${product.canvasCount} canvas${product.canvasCount === 1 ? "" : "es"}`}
          </p>
        </div>
        <button type="button" onClick={remove} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:border-red-500/30">
          Remove product
        </button>
      </div>

      <ProductForm
        value={draft}
        onChange={setDraft}
        error={error}
        onError={setError}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-light-border pt-6 dark:border-[rgba(43,43,49,0.4)]">
            <Link
              href="/business/dashboard"
              className="rounded-full border border-light-border px-8 py-4 text-center text-base font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading"
            >
              Cancel
            </Link>
            <button
              type="button"
              disabled={busy}
              onClick={() => save(published ? "DRAFT" : "PUBLISHED")}
              className="rounded-full border border-light-border px-6 py-4 text-base font-medium text-auth-navy disabled:opacity-60 dark:border-dak-border dark:text-dak-heading"
            >
              {published ? "Unpublish" : "Publish"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => save()}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-dak-cta py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)] disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save Changes"}
            </button>
          </div>
        }
      />
    </div>
  );
}
