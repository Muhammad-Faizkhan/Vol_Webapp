import type { InputHTMLAttributes, ReactNode } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
};

export function TextField({ icon, className = "", ...props }: TextFieldProps) {
  return (
    <div className="relative h-14 w-full">
      <div className="absolute inset-0 rounded-xl border border-[#2b2b31]/50 bg-white dark:border-dak-border dark:bg-transparent" />
      <div className="relative flex h-full items-center gap-2 px-6">
        {icon}
        <input
          className={`w-full bg-transparent text-base text-[#2b2b31] placeholder:text-[#2b2b31]/60 focus:outline-none dark:text-dak-heading dark:placeholder:text-dak-muted ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
