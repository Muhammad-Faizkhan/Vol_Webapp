import type { InputHTMLAttributes, ReactNode } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
};

export function TextField({ icon, className = "", ...props }: TextFieldProps) {
  return (
    <div className="relative h-14 w-full">
      <div className="absolute inset-0 rounded-xl border border-auth-navy/50 bg-white" />
      <div className="relative flex h-full items-center gap-0.5 px-6">
        {icon}
        <input
          className={`w-full bg-transparent text-base text-auth-slate placeholder:text-auth-slate/60 focus:outline-none ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
