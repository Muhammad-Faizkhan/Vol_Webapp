"use client";

import Link from "next/link";

type ChipItem = { value: string; label: string; href?: string };

const base = "flex h-12 shrink-0 items-center justify-center rounded-2xl px-4 py-2.5 text-base whitespace-nowrap transition-colors";
// Figma pills are 110px (active) and 150px (idle) at 1920; they scale down with the viewport and
// wrap rather than scroll when a row still doesn't fit.
const activeCls = "min-w-[clamp(80px,calc(5.73*var(--vw)),110px)] bg-dak-cta font-semibold text-white";
const idleCls = "min-w-[clamp(80px,calc(7.8*var(--vw)),150px)] border border-adm-chip-border text-white/60 hover:text-white";

// The pill filter/tab row used across the admin screens (user filters, user-detail tabs, settings
// tabs). Items with an href render as links so tabs stay URL-addressable.
export function Chips({
  items,
  value,
  onChange,
  label,
}: {
  items: ChipItem[];
  value: string;
  onChange?: (value: string) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-[17px]">
      {items.map((item) => {
        const active = item.value === value;
        const cls = `${base} ${active ? activeCls : idleCls}`;
        return item.href ? (
          <Link key={item.value} href={item.href} role="tab" aria-selected={active} className={cls} scroll={false}>
            {item.label}
          </Link>
        ) : (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(item.value)}
            className={cls}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
