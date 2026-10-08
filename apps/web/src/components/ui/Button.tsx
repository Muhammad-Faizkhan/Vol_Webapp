import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "dark" | "dark-outline" | "google" | "apple";
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

  if (variant === "google") {
    return (
      <button
        className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-[#34a853]/50 bg-white text-base font-medium text-[#34a853] dark:border-dak-border dark:bg-transparent dark:text-dak-heading ${className}`}
        {...props}
      >
        {icon}
        <span>{children}</span>
      </button>
    );
  }

  if (variant === "apple") {
    return (
      <button
        className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-[#020204] bg-[#020204] text-base font-medium text-white dark:border-dak-border dark:bg-transparent dark:text-dak-heading ${className}`}
        {...props}
      >
        {icon}
        <span>{children}</span>
      </button>
    );
  }

  if (variant === "dark-outline") {
    return (
      <button
        className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-dak-border bg-transparent text-base font-medium text-dak-heading ${className}`}
        {...props}
      >
        {icon}
        <span>{children}</span>
      </button>
    );
  }

  if (variant === "dark") {
    return (
      <button
        className={`h-14 w-full rounded-full bg-dak-cta text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)] disabled:opacity-60 ${className}`}
        {...props}
      >
        {children}
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
