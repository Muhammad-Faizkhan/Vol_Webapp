import type { ReactNode } from "react";

// "Section - Welcome Header" from Figma: optional eyebrow above or subtitle below a 32px title,
// with page actions pinned to the right (wrapping underneath on narrow screens).
export function PageHeader({
  title,
  eyebrow,
  subtitle,
  actions,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow && <p className="text-base leading-6 text-dak-body">{eyebrow}</p>}
        <h1 className="text-[clamp(24px,2.4vw,32px)] font-bold leading-10 tracking-[-0.32px] text-dak-heading">{title}</h1>
        {subtitle && <p className="text-base leading-6 text-dak-body">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-4">{actions}</div>}
    </div>
  );
}
