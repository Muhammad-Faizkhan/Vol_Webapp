"use client";

// 40×24 switch from Figma's "Toggle Switch" component: slate track when off, brand purple when on.
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-10 shrink-0 rounded-xl transition-colors ${checked ? "bg-dak-cta" : "bg-[#31384a]"}`}
    >
      <span
        className={`absolute top-1 size-4 rounded-full bg-white transition-[left] ${checked ? "left-5" : "left-1"}`}
      />
    </button>
  );
}
