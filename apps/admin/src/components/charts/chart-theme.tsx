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
  return v >= 1000 ? `${Number((v / 1000).toFixed(1))}k` : String(v);
}

/** [0, M/10, M/5, M/2, M] where M is the next 1/2/5×10ⁿ at or above the peak (at least 10). */
export function growthTicks(peak: number) {
  let max = 10;
  while (max < peak) max = String(max).startsWith("1") ? max * 2 : String(max).startsWith("2") ? (max / 2) * 5 : max * 2;
  return [0, max / 10, max / 5, max / 2, max];
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
