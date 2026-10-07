"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "./chart-theme";

export type ShareSlice = { name: string; value: number; color: string };

// Donut from Figma node 790:5518 ("Share of platform accounts by type") with the legend spread
// along the bottom of the widget.
export function ShareDonut({ data }: { data: ShareSlice[] }) {
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="h-[290px] w-full max-w-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
              outerRadius="80%"
              startAngle={62}
              endAngle={-298}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <ChartTooltip compact>
                    <p className="px-2 text-[10px]" style={{ color: payload[0].payload.color }}>
                      {payload[0].name}: {String(payload[0].value)}
                    </p>
                  </ChartTooltip>
                ) : null
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex w-full max-w-[647px] flex-wrap justify-between gap-4">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-[10px] font-medium tracking-[-0.3px] text-dak-body">
            <span className="size-2.5 rounded-full" style={{ background: d.color }} />
            {d.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
