"use client";

import { useRef } from "react";

const LENGTH = 6;

export function OtpInput() {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    if (inputRefs.current[index]) inputRefs.current[index]!.value = digit;
    if (digit && index < LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex h-16 w-full items-center justify-center gap-2">
      {Array.from({ length: LENGTH }).map((_, index) => (
        <div key={index} className="flex items-center">
          {index === 3 && <span className="px-1 text-base font-bold text-light-border">-</span>}
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="h-16 w-14 rounded border border-light-border bg-white text-center text-xl text-auth-navy focus:border-auth-navy focus:outline-none"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        </div>
      ))}
    </div>
  );
}
