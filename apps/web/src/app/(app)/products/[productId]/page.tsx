"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Product } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { CanvasPicker } from "@/components/canvas/CanvasPicker";
import { ReportButton } from "@/components/social/ReportButton";
import { ErrorState } from "@/components/ui/States";
import { Avatar, UserImage } from "@/components/ui/UserImage";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const { data: p, error } = useApiQuery<Product>(`/products/${productId}`);
  const [image, setImage] = useState(0);
  const [picking, setPicking] = useState(false);

  if (error) return <ErrorState error={error} />;
  if (!p) return null;

  const specs: [string, string][] = [
    ["True Size", p.size ?? "—"],
    ["Height / Thickness", p.heightMm != null ? `${p.heightMm} mm` : "—"],
    ["Width", p.widthMm != null ? `${p.widthMm} mm` : "—"],
    ["Length", p.lengthMm != null ? `${p.lengthMm} mm` : "—"],
    ["Weight", p.weightKg != null ? `${p.weightKg} kg` : "—"],
    ["Category", p.category ?? "—"],
    ["Trade", p.trade ?? "—"],
  ];

  return (
    <div className="flex w-full max-w-[1100px] flex-col gap-6">
      <button type="button" onClick={() => router.back()} className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </button>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex w-full flex-col gap-3 lg:w-1/2">
          <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-auth-navy dark:bg-dak-surface">
            {p.images.length ? <UserImage src={p.images[image]} alt={p.name} /> : <Image src="/illustrations/auth-placeholder.svg" alt="" width={56} height={56} />}
          </div>
          {p.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {p.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImage(i)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 ${i === image ? "border-dak-cta" : "border-transparent"}`}
                >
                  <UserImage src={src} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-5 lg:w-1/2">
          <div className="flex flex-col gap-2">
            {p.brand && <span className="text-xs uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">{p.brand}</span>}
            <h1 className="text-2xl font-bold text-auth-navy dark:text-dak-heading sm:text-[32px]">{p.name}</h1>
            {p.status !== "PUBLISHED" && <span className="w-fit rounded bg-[#fbbc05]/20 px-2 py-1 text-xs font-semibold text-[#a07800]">Draft</span>}
          </div>

          <Link href={`/business/${p.business.id}`} className="flex items-center gap-3">
            <Avatar src={p.business.avatarUrl} name={p.business.name} />
            <span className="flex flex-col">
              <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">{p.business.name}</span>
              <span className="text-xs text-[#929292] dark:text-dak-muted">View business profile</span>
            </span>
          </Link>

          {p.description && <p className="whitespace-pre-wrap text-base text-auth-slate dark:text-dak-body">{p.description}</p>}

          <div className="flex flex-col rounded-2xl border border-light-border bg-white p-4 dark:border-dak-border dark:bg-dak-surface">
            {specs.map(([label, value], i) => (
              <div key={label} className={`flex justify-between py-2.5 text-sm ${i ? "border-t border-light-border dark:border-dak-border" : ""}`}>
                <span className="text-[#2b2b31] dark:text-dak-body">{label}</span>
                <span className="font-semibold text-[#020204] dark:text-dak-heading">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {p.isMine ? (
              <Link href={`/business/products/${p.id}/edit`} className="rounded-2xl bg-dak-cta px-6 py-3 text-base font-medium text-white">
                Edit product
              </Link>
            ) : (
              <button type="button" onClick={() => setPicking(true)} className="rounded-2xl bg-dak-cta px-6 py-3 text-base font-medium text-white">
                Add to a canvas
              </button>
            )}
            <span className="text-sm text-[#929292] dark:text-dak-muted">
              Used on {p.canvasCount} canvas{p.canvasCount === 1 ? "" : "es"}
            </span>
            {!p.isMine && <ReportButton targetType="PRODUCT" targetId={p.id} className="ml-auto text-sm text-[#929292] hover:text-red-500" />}
          </div>
        </div>
      </div>

      {picking && (
        <CanvasPicker
          title="Place on which canvas?"
          onClose={() => setPicking(false)}
          onPick={(c) => router.push(`/canvas/${c.id}?addProduct=${p.id}`)}
        />
      )}
    </div>
  );
}
