import type { ReactNode } from "react";

// Figma "Bio Card": dark card with a small uppercase Geist heading over a divider.
export function DetailCard({
  title,
  children,
  footer,
  className = "",
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col gap-4 rounded-lg border border-dak-border/40 bg-dak-surface p-[25px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)] ${className}`}
    >
      <h2 className="font-heading text-sm font-medium uppercase leading-4 tracking-[1.4px] text-dak-heading">{title}</h2>
      <div className="flex flex-col gap-2 border-t border-dak-border/40 pt-[18px]">{children}</div>
      {footer}
    </section>
  );
}

// One label/value line inside a DetailCard. Without a value the label renders as the line's
// content (Figma's evidence list).
export function DetailRow({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-dak-border/40 pb-4 text-sm leading-5">
      <span className={children === undefined ? "font-medium text-dak-heading" : "text-dak-body"}>{label}</span>
      {children !== undefined && <span className="text-right font-medium text-dak-heading">{children}</span>}
    </div>
  );
}
