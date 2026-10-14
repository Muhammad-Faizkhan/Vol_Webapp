"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import type { Facets, Product } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { DropZone } from "@/components/ui/DropZone";
import { UserImage } from "@/components/ui/UserImage";
import { useUpload } from "@/lib/useUpload";

export type ProductDraft = {
  name: string;
  brand: string;
  category: string;
  trade: string;
  description: string;
  heightMm: string;
  widthMm: string;
  lengthMm: string;
  weightKg: string;
  images: string[];
};

export const DRAFT_KEY = "vol-product-draft";
const MAX_IMAGES = 4;

export const CATEGORIES = ["Tiling", "Flooring", "Fasteners", "Membranes", "Adhesives", "HVAC", "Electrical", "Plumbing", "Structural"];
export const TRADES = ["Tiling & Flooring", "HVAC Systems", "Electrical", "Structural", "Plumbing", "Carpentry"];

export const emptyDraft = (): ProductDraft => ({
  name: "",
  brand: "",
  category: "",
  trade: "",
  description: "",
  heightMm: "",
  widthMm: "",
  lengthMm: "",
  weightKg: "",
  images: [],
});

export function draftFromProduct(p: Product): ProductDraft {
  const n = (v: number | null) => (v == null ? "" : String(v));
  return {
    name: p.name,
    brand: p.brand ?? "",
    category: p.category ?? "",
    trade: p.trade ?? "",
    description: p.description ?? "",
    heightMm: n(p.heightMm),
    widthMm: n(p.widthMm),
    lengthMm: n(p.lengthMm),
    weightKg: n(p.weightKg),
    images: p.images,
  };
}

/** Request body for POST/PATCH /products. Empty fields are sent as "not set". */
export function draftToBody(d: ProductDraft) {
  const num = (v: string) => (v.trim() === "" ? null : Number(v));
  return {
    name: d.name.trim(),
    brand: d.brand.trim() || undefined,
    category: d.category || undefined,
    trade: d.trade || undefined,
    description: d.description.trim() || undefined,
    heightMm: num(d.heightMm),
    widthMm: num(d.widthMm),
    lengthMm: num(d.lengthMm),
    weightKg: num(d.weightKg),
    images: d.images,
  };
}

const input =
  "h-14 w-full rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted";
const label = "text-sm font-medium text-auth-navy dark:text-dak-heading";

export function ProductForm({
  value,
  onChange,
  error,
  onError,
  footer,
}: {
  value: ProductDraft;
  onChange: (d: ProductDraft) => void;
  error: string | null;
  onError: (message: string) => void;
  footer: ReactNode;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload(onError);
  const [dimError, setDimError] = useState(false);
  const { data: facets } = useApiQuery<Facets>("/products/facets");
  const set = <K extends keyof ProductDraft>(key: K, v: ProductDraft[K]) => onChange({ ...value, [key]: v });

  async function addFiles(files: FileList | File[] | null | undefined) {
    const list = Array.from(files ?? []).slice(0, MAX_IMAGES - value.images.length);
    const urls: string[] = [];
    for (const file of list) {
      const url = await upload(file);
      if (url) urls.push(url);
    }
    if (urls.length) onChange({ ...value, images: [...value.images, ...urls] });
  }

  return (
    <div className="flex flex-col gap-6">
      <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { void addFiles(e.target.files); e.target.value = ""; }} />
      {value.images.length < MAX_IMAGES && (
        <DropZone
          onFile={(file) => addFiles([file])}
          onClick={() => fileInput.current?.click()}
          className="flex h-[130px] w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-light-border bg-[#dcdcdc] dark:border-dak-border dark:bg-dak-surface"
        >
          <Image src="/icons/new-canvas.svg" alt="" width={24} height={24} className="dark:invert" />
          <p className="text-sm text-auth-navy dark:text-dak-heading">
            <span className="font-semibold">{uploading ? "Uploading…" : "Upload image"}</span>{" "}
            <span className="text-[#929292] dark:text-dak-muted">or drag and drop</span>
          </p>
          <span className="text-xs text-[#929292] dark:text-dak-muted">
            PNG, JPG up to 10MB · {value.images.length}/{MAX_IMAGES}
          </span>
        </DropZone>
      )}
      {value.images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {value.images.map((src, i) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-light-border dark:border-dak-border">
              <UserImage src={src} />
              {i === 0 && <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">Cover</span>}
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => set("images", value.images.filter((x) => x !== src))}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-sm text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className={label} htmlFor="product-name">
          Product Name
        </label>
        <input id="product-name" value={value.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. High-Capacity Chiller Unit TX-500" className={input} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label className={label} htmlFor="product-brand">
            Brand / Manufacturer
          </label>
          <input
            id="product-brand"
            list="brand-options"
            value={value.brand}
            onChange={(e) => set("brand", e.target.value)}
            placeholder="Select or type a manufacturer"
            className={input}
          />
          <datalist id="brand-options">
            {facets?.brands.map((b) => <option key={b.value} value={b.value} />)}
          </datalist>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label className={label} htmlFor="product-category">
            Product Category
          </label>
          <Select id="product-category" value={value.category} onChange={(v) => set("category", v)} placeholder="Select Category" options={CATEGORIES} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={label} htmlFor="product-trade">
          Trade Specialization
        </label>
        <Select id="product-trade" value={value.trade} onChange={(v) => set("trade", v)} placeholder="Select the trade this product serves" options={TRADES} />
      </div>

      <div className="flex flex-col gap-2">
        <label className={label} htmlFor="product-description">
          Short Description
        </label>
        <textarea
          id="product-description"
          rows={3}
          value={value.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Provide a brief overview of the product's primary function and application within the project context..."
          className="w-full resize-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 py-3 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
        />
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
        <h3 className="border-b border-light-border pb-4 text-2xl font-semibold text-auth-navy dark:border-dak-border dark:text-dak-heading">Dimensions</h3>
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              ["heightMm", "Overall Height", "mm"],
              ["widthMm", "Overall Width", "mm"],
              ["lengthMm", "Overall Length", "mm"],
              ["weightKg", "Total Weight", "kg"],
            ] as const
          ).map(([key, text, unit]) => (
            <div key={key} className="flex min-w-0 flex-col gap-2">
              <label className={label} htmlFor={`dim-${key}`}>
                {text}
              </label>
              <div className="relative">
                <input
                  id={`dim-${key}`}
                  type="number"
                  min={0}
                  step="0.01"
                  value={value[key]}
                  onChange={(e) => {
                    setDimError(Number(e.target.value) < 0);
                    set(key, e.target.value);
                  }}
                  placeholder="0.00"
                  className="h-12 w-full min-w-0 rounded-lg border border-light-border bg-[#f8f9ff] px-4 pr-12 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#929292] dark:text-dak-muted">{unit}</span>
              </div>
            </div>
          ))}
        </div>
        {dimError && <p className="text-sm text-red-500">Dimensions can&apos;t be negative.</p>}
      </div>

      {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}
      {footer}
    </div>
  );
}

function Select({ id, value, onChange, placeholder, options }: { id: string; value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  const all = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-14 w-full appearance-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base focus:outline-none dark:border-dak-border dark:bg-transparent ${
          value ? "text-auth-navy dark:text-dak-heading" : "text-[#929292] dark:text-dak-muted"
        }`}
      >
        <option value="">{placeholder}</option>
        {all.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Image src="/icons/dropdown-arrow.svg" alt="" width={20} height={20} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 dark:invert" />
    </div>
  );
}
