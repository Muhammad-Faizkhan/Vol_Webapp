"use client";

import { useRef } from "react";

const LENGTH = 6;

// Six 64px boxes split 3 + 3 by a dash, per Figma node 705:4602. Filled boxes get the purple
// border; empty ones keep the light border.
export function CodeInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, LENGTH));
  };

  const box = (i: number) => (
    <input
      key={i}
      ref={(el) => {
        refs.current[i] = el;
      }}
      inputMode="numeric"
      autoComplete={i === 0 ? "one-time-code" : "off"}
      maxLength={1}
      aria-label={`Digit ${i + 1}`}
      value={digits[i]}
      onChange={(e) => {
        const d = e.target.value.replace(/\D/g, "").slice(-1);
        setDigit(i, d);
        if (d && i < LENGTH - 1) refs.current[i + 1]?.focus();
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
      }}
      onPaste={(e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
        if (!pasted) return;
        e.preventDefault();
        onChange(pasted);
        refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
      }}
      className={`aspect-square w-full max-w-16 min-w-0 rounded-[10px] border bg-transparent text-center text-[22px] leading-6 text-dak-heading caret-dak-heading focus:outline-none ${
        digits[i] ? "border-dak-cta" : "border-dak-heading focus:border-dak-cta"
      }`}
    />
  );

  return (
    <div className="flex items-center justify-center gap-[clamp(6px,calc(1.2*var(--vw)),12px)]">
      {[0, 1, 2].map(box)}
      <span className="w-[clamp(12px,calc(2*var(--vw)),40px)] text-center text-base font-bold leading-6 text-dak-heading">-</span>
      {[3, 4, 5].map(box)}
    </div>
  );
}
