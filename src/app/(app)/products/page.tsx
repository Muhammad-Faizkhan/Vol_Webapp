"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/cards/ProductCard";

const filterGroups = [
  { id: "trade", title: "Trade Specialization", options: ["Tiling & Flooring", "HVAC Systems", "Electrical", "Structural"] },
  { id: "brand", title: "Brand", options: ["Schluter Systems", "Hilti", "Makita", "Laticrete"] },
] as const;

const initialFilters = new Set<string>(["Tiling & Flooring", "Schluter Systems", "Hilti"]);

const sortOptions = ["Relevance", "Newest", "Name (A–Z)"];

const products = Array.from({ length: 6 }).map((_, i) => ({
  href: `/business/products/${i + 1}/edit`,
  brand: "Schluter Systems",
  name: "Abc Product",
  specs: [
    ["Coverage", "54 sq ft / roll"],
    ["True Size", "600 x 1200 MM"],
    ["Thickness", '1/8" (3mm)'],
    ["Rotation", "0"],
  ] as [string, string][],
  imageSrc: "/illustrations/classroom-thumb-engineers.jpg",
}));

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-5 cursor-pointer items-center gap-3">
      <span className="relative flex size-[18px] shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-[2px] border border-[#2b2b31] bg-white checked:border-transparent checked:bg-[#020204] dark:border-dak-border dark:bg-transparent dark:checked:bg-dak-cta"
        />
        <Image
          src="/icons/checkbox-tick-white.svg"
          alt=""
          width={16}
          height={16}
          className="pointer-events-none relative hidden peer-checked:block"
        />
      </span>
      <span
        className={`text-sm leading-5 ${checked ? "text-[#020204] dark:text-dak-heading" : "text-[#2b2b31] dark:text-dak-body"}`}
      >
        {label}
      </span>
    </label>
  );
}

export default function ProductCatalogPage() {
  const [selected, setSelected] = useState<Set<string>>(initialFilters);
  const [sort, setSort] = useState(sortOptions[0]);

  const toggle = (option: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });

  const selectedTrades = filterGroups[0].options.filter((o) => selected.has(o));

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px] sm:leading-10">
          Product Catalog
        </h1>
        <p className="max-w-[570px] text-base leading-6 text-[#020204] dark:text-dak-body">
          Browse and specify trade-accurate inventory, structural components, and finishing materials for your
          architectural canvases.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
        <aside className="flex w-full shrink-0 flex-col gap-6 rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white px-[25px] py-[17px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface lg:min-h-[783px] lg:w-[275px] lg:self-start">
          <div className="flex items-center justify-between border-b border-[#c793ff] px-6 pb-[25px] pt-6 dark:border-dak-border">
            <span className="text-sm font-medium uppercase leading-4 tracking-[0.7px] text-[#020204] dark:text-dak-heading">
              Filters
            </span>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs font-semibold leading-3 text-[#020204] dark:text-dak-heading"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-col gap-8">
            {filterGroups.map((group) => (
              <fieldset key={group.id} className="flex flex-col gap-3">
                <legend className="mb-3 w-full border-b border-[#c793ff] pb-[9px] text-sm font-medium leading-4 tracking-[0.28px] text-[#020204] dark:border-dak-border dark:text-dak-heading">
                  {group.title}
                </legend>
                {group.options.map((option) => (
                  <FilterCheckbox
                    key={option}
                    label={option}
                    checked={selected.has(option)}
                    onChange={() => toggle(option)}
                  />
                ))}
              </fieldset>
            ))}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-6 bg-white pb-6 dark:bg-transparent lg:pl-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-5 text-[#2b2b31] dark:text-dak-body">
              Showing <span className="font-semibold">243</span> products in{" "}
              <span className="font-semibold">{selectedTrades.length ? selectedTrades.join(", ") : "all trades"}</span>
            </p>
            <div className="relative w-full shrink-0 sm:w-[192px]">
              <select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded border border-[#2b2b31] bg-transparent py-[9px] pl-[13px] pr-[33px] text-sm leading-5 text-[#020204] dark:border-dak-border dark:text-dak-heading"
              >
                {sortOptions.map((o) => (
                  <option key={o} value={o}>
                    Sort by: {o}
                  </option>
                ))}
              </select>
              <Image
                src="/icons/sort-chevron-down.svg"
                alt=""
                width={21}
                height={21}
                className="pointer-events-none absolute right-[9px] top-1/2 -translate-y-1/2 dark:invert"
              />
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {products.map((p, i) => (
              <ProductCard key={i} {...p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
