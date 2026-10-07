import Image from "next/image";
import type { ReactNode } from "react";

export function Widget({
  title,
  subtitle,
  period,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  period?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`flex min-w-0 flex-col gap-2 overflow-hidden rounded-2xl border border-dak-border bg-dak-surface p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-[-0.2px] text-dak-heading">{title}</h2>
          {subtitle && <p className="text-base tracking-[-0.2px] text-dak-muted">{subtitle}</p>}
        </div>
        {period && (
          <span className="flex shrink-0 items-center gap-1 text-sm tracking-[-0.3px] text-dak-heading">
            {period}
            <Image src="/icons/chevron-down.svg" alt="" width={14} height={14} />
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
