import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
  icon?: ReactNode;
};

export function Button({
  variant = "primary",
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  if (variant === "outline") {
    return (
      <button
        className={`flex h-14 w-full items-center justify-center gap-0.5 rounded-xl border border-auth-navy/50 bg-white text-xl font-medium text-auth-slate ${className}`}
        {...props}
      >
        {icon}
        <span className="p-2.5">{children}</span>
      </button>
    );
  }

  return (
    <button
      className={`h-14 w-full rounded-2xl bg-auth-slate text-base font-medium text-white shadow-[0px_8px_16px_rgba(99,117,139,0.4)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
