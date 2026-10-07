"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip, axisTick } from "./chart-theme";

// Bar colors and tooltip colors from Figma node 742:7. Tooltip shows classrooms in green even
// though the bar itself is #3bcc92, exactly as designed.
const bars = [
  { key: "workspaces", label: "Workspaces", color: "#3c6ef7", tip: "#3c6ef7" },
  { key: "canvases", label: "Canvases", color: "#00b5e7", tip: "#00b5e7" },
  { key: "classrooms", label: "Classrooms", color: "#3bcc92", tip: "#23c54e" },
  { key: "catalog", label: "Catalog", color: "#e0bc4b", tip: "#e0bc4b" },
];

export function ActivityChart({
  data,
  height = 236,
}: {
  data: Array<{ label: string } & Record<string, number | string>>;
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -18 }} barGap={4} barCategoryGap="22%">
          <CartesianGrid stroke="#777a82" strokeWidth={0.5} vertical={false} />
          <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} tickMargin={14} />
          <YAxis
            domain={[0, 1000]}
            ticks={[0, 300, 500, 700, 1000]}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <ChartTooltip compact>
                  <p className="text-xs text-dak-heading">{String(label).replace("WEEK", "Week")}</p>
                  {bars.map((b) => (
                    <p key={b.key} className="text-[10px]" style={{ color: b.tip }}>
                      {b.label}: {String(payload[0].payload[b.key])}
                    </p>
                  ))}
                </ChartTooltip>
              ) : null
            }
          />
          {bars.map((b) => (
            <Bar key={b.key} dataKey={b.key} fill={b.color} radius={[8, 8, 0, 0]} maxBarSize={32} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
