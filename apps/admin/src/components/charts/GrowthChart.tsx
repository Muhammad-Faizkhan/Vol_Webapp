"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip, axisTick, formatK, piecewiseScale } from "./chart-theme";

export type GrowthSeries = {
  key: string;
  label: string;
  color: string;
  dashed?: boolean;
  /** Dot and tooltip color when it differs from the area (Business Growth: purple area, green dot). */
  accent?: string;
};

const TICKS = [0, 10000, 20000, 50000, 100000];

// Area chart behind Figma's "User Growth" and "Business Growth" widgets: gradient fills fading
// to transparent, a light vertical cursor and a dark tooltip listing each series in its color.
export function GrowthChart({
  data,
  series,
  height = 236,
}: {
  data: Array<{ label: string } & Record<string, number | string>>;
  series: GrowthSeries[];
  height?: number;
}) {
  const scale = piecewiseScale(TICKS);
  const plotted = data.map((d) => {
    const row: Record<string, number | string> = { label: d.label };
    for (const s of series) {
      row[s.key] = scale.toPos(Number(d[s.key]));
      row[`${s.key}Raw`] = d[s.key];
    }
    return row;
  });

  return (
    <div style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={plotted} margin={{ top: 8, right: 0, bottom: 0, left: -18 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="#282828" horizontal={false} />
          <CartesianGrid stroke="#777a82" strokeWidth={0.5} vertical={false} />
          <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} tickMargin={16} interval={0} padding={{ right: 14 }} />
          <YAxis
            type="number"
            domain={scale.domain}
            ticks={scale.positions}
            tickFormatter={(p: number) => formatK(TICKS[p])}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip
            cursor={{ stroke: "#d9d9d9", strokeWidth: 2 }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <ChartTooltip>
                  <p className="text-dak-heading">{label}</p>
                  {series.map((s) => (
                    <p key={s.key} style={{ color: s.accent ?? s.color }}>
                      {s.label}: {String(payload[0].payload[`${s.key}Raw`])}
                    </p>
                  ))}
                </ChartTooltip>
              ) : null
            }
          />
          {series.map((s) => (
            <Area
              key={s.key}
              type="linear"
              dataKey={s.key}
              stroke={s.dashed ? s.color : "none"}
              strokeWidth={s.dashed ? 2 : 0}
              strokeDasharray={s.dashed ? "4 4" : undefined}
              fill={`url(#grad-${s.key})`}
              activeDot={{ r: 6, fill: s.accent ?? s.color, stroke: "none" }}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
