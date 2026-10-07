import type { InputHTMLAttributes } from "react";

export function Toggle({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-xl bg-auth-navy ${className}`}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="absolute left-0.5 size-5 rounded-full bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.1)] transition-transform peer-checked:translate-x-6" />
    </label>
  );
}
