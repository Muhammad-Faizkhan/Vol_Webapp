import type { InputHTMLAttributes } from "react";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className = "", ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={`size-6 shrink-0 rounded-[5px] border border-light-border bg-white accent-dak-cta dark:border-dak-border dark:bg-transparent ${className}`}
      {...props}
    />
  );
}
