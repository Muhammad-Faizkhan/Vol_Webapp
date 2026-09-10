import type { InputHTMLAttributes } from "react";

export function Checkbox({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={`size-6 shrink-0 rounded-[5px] border border-auth-checkbox bg-[#f9f9f9] accent-auth-checkbox ${className}`}
      {...props}
    />
  );
}
