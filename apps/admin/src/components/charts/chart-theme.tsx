import type { ReactNode } from "react";

// Figma's growth charts space their y-axis ticks evenly even though the values aren't
// (0, 10k, 20k, 50k, 100k). Recharts has no such scale, so values are mapped onto evenly spaced
// "tick positions" by linear interpolation between neighbouring ticks, and the axis labels the
// positions with the real tick values.
export function piecewiseScale(ticks: number[]) {
  const toPos = (v: number) => {
    if (v <= ticks[0]) return 0;
    for (let i = 1; i < ticks.length; i++) {
      if (v <= ticks[i]) return i - 1 + (v - ticks[i - 1]) / (ticks[i] - ticks[i - 1]);
    }
    return ticks.length - 1;
  };
  return { toPos, positions: ticks.map((_, i) => i), domain: [0, ticks.length - 1] as [number, number] };
}

export function formatK(v: number) {
  return v >= 1000 ? `${v / 1000}k` : String(v);
}

export const axisTick = { fill: "#c8cbd0", fontSize: 10, fontWeight: 500, letterSpacing: -0.3 };

export function ChartTooltip({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-adm-tooltip-border bg-adm-tooltip tracking-[-0.3px] ${
        compact ? "gap-2 p-2" : "w-[149px] gap-4 p-4 text-sm"
      }`}
    >
      {children}
    </div>
  );
}
