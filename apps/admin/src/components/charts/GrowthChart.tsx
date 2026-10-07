"use client";

import { useState } from "react";
import { Area, ComposedChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip, axisTick, formatK, piecewiseScale } from "./chart-theme";

export type GrowthSeries = {
  key: string;
  label: string;
  color: string;
  /** "progress": solid line from the first point up to the hovered one (User Growth).
   *  "dashed": dashed outline along the whole area (Business Growth). */
  stroke?: "progress" | "dashed";
  /** Dot and tooltip color when it differs from the area (Business Growth: purple area, green dot). */
  accent?: string;
};

const TICKS = [0, 10000, 20000, 50000, 100000];

// Left-aligned y labels, as in Figma (they sit flush with the widget's padding, not the plot).
function YTick({ y, payload }: { y?: number; payload?: { value: number } }) {
  return (
    <text x={1} y={y} dy={4} textAnchor="start" {...axisTick}>
      {formatK(TICKS[payload?.value ?? 0])}
    </text>
  );
}

// Area chart behind Figma's "User Growth" and "Business Growth" widgets (705:3181): gradient fills
// fading to transparent, a light vertical cursor and a dark tooltip, shown by default on the point
// Figma highlights (`defaultIndex`) and following the pointer afterwards.
export function GrowthChart({
  data,
  series,
  defaultIndex,
  height = 236,
}: {
  data: Array<{ label: string } & Record<string, number | string>>;
  series: GrowthSeries[];
  defaultIndex: number;
  height?: number;
}) {
  const [active, setActive] = useState(defaultIndex);
  const scale = piecewiseScale(TICKS);
  const plotted = data.map((d, i) => {
    const row: Record<string, number | string | null> = { label: d.label };
    for (const s of series) {
      const pos = scale.toPos(Number(d[s.key]));
      row[s.key] = pos;
      row[`${s.key}Raw`] = d[s.key];
      row[`${s.key}Progress`] = i <= active ? pos : null;
    }
    return row;
  });

  return (
    <div style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={plotted}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          onMouseMove={(state) => {
            const i = Number(state?.activeTooltipIndex);
            if (Number.isInteger(i)) setActive(i);
          }}
        >
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
          <XAxis
            dataKey="label"
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            tickMargin={16}
            interval={0}
          />
          <YAxis
            type="number"
            domain={scale.domain}
            ticks={scale.positions}
            tick={<YTick />}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip
            defaultIndex={defaultIndex}
            cursor={{ stroke: "#d9d9d9", strokeWidth: 2 }}
            content={({ active: isActive, payload, label }) =>
              // The trailing unlabeled point only extends the area to the plot edge, as in Figma.
              isActive && payload?.length && label ? (
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
              stroke={s.stroke === "dashed" ? s.color : "none"}
              strokeWidth={s.stroke === "dashed" ? 1 : 0}
              strokeDasharray={s.stroke === "dashed" ? "2 2" : undefined}
              fill={`url(#grad-${s.key})`}
              activeDot={{ r: 6, fill: s.accent ?? s.color, stroke: "none" }}
              isAnimationActive={false}
            />
          ))}
          {series
            .filter((s) => s.stroke === "progress")
            .map((s) => (
              <Line
                key={`${s.key}-progress`}
                type="linear"
                dataKey={`${s.key}Progress`}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
                tooltipType="none"
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
