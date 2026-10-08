"use client";

import { useRef } from "react";

const LENGTH = 6;

type OtpInputProps = {
  onChange?: (code: string) => void;
};

export function OtpInput({ onChange }: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function emitCode() {
    const code = inputRefs.current.map((el) => el?.value ?? "").join("");
    onChange?.(code);
  }

  function updateFilledState(index: number, filled: boolean) {
    const el = inputRefs.current[index];
    el?.classList.toggle("border-[#9436fb]", filled);
    el?.classList.toggle("border-[#9e9e9e]", !filled);
    el?.classList.toggle("dark:border-dak-cta", filled);
    el?.classList.toggle("dark:border-dak-border", !filled);
  }

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    if (inputRefs.current[index]) inputRefs.current[index]!.value = digit;
    updateFilledState(index, !!digit);
    if (digit && index < LENGTH - 1) inputRefs.current[index + 1]?.focus();
    emitCode();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
      emitCode();
    }
  }

  const boxClass =
    "h-[clamp(2.75rem,7dvh,4rem)] w-[clamp(2rem,8vw,3.5rem)] rounded border border-[#9e9e9e] bg-white/70 text-center text-lg text-[#2b2b31] focus:border-dak-cta focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading sm:text-xl";

  return (
    <div className="flex w-full items-center justify-center gap-1 sm:gap-2">
      {Array.from({ length: LENGTH }).map((_, index) => (
        <div key={index} className="flex items-center">
          {index === 3 && (
            <span className="px-0.5 text-base font-bold text-[#2b2b31] dark:text-dak-border sm:px-1">
              -
            </span>
          )}
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={boxClass}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        </div>
      ))}
    </div>
  );
}
