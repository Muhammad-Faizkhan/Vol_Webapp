import Image from "next/image";
import Link from "next/link";
import { ActivityChart } from "@/components/charts/ActivityChart";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Widget } from "@/components/ui/Widget";
import {
  activityByWeek,
  businessGrowthMonthly,
  dashboardStats,
  platformHealth,
  userGrowthYearly,
} from "@/lib/mock-data";

const healthTone = {
  danger: "bg-adm-danger-text/15 text-adm-danger-text",
  warning: "bg-adm-warning/15 text-adm-warning",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Dashboard Overview"
        title="Good morning, Morgan."
        actions={
          <Link
            href="/cases"
            className="flex h-14 w-[170px] items-center justify-center gap-2 rounded-xl bg-dak-cta px-4 text-base text-white"
          >
            <Image src="/icons/case.svg" alt="" width={24} height={24} />
            Open Cases
          </Link>
        }
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-x-[19px] gap-y-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[800fr_590fr]">
        <Widget title="User Growth" period="Yearly">
          <GrowthChart
            data={userGrowthYearly}
            series={[
              { key: "total", label: "Total User", color: "#4285f4" },
              { key: "active", label: "Active User", color: "#9436fb", dashed: true },
            ]}
          />
        </Widget>
        <Widget title="Business Growth" period="Monthly">
          <GrowthChart
            data={businessGrowthMonthly}
            series={[{ key: "business", label: "Business", color: "#9436fb", accent: "#23c54e", dashed: true }]}
          />
        </Widget>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[800fr_590fr]">
        <Widget title="Workspace, canvas, classroom & catalog activity" period="Monthly">
          <ActivityChart data={activityByWeek} />
        </Widget>
        <Widget title="Platform health">
          <ul className="flex flex-col gap-6">
            {platformHealth.map((item) => (
              <li
                key={item.label}
                className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-dak-muted bg-dak-border px-6"
              >
                <span className="text-sm font-medium tracking-[-0.3px] text-dak-body">{item.label}</span>
                <span className={`rounded-[30px] px-4 py-2 text-sm font-medium tracking-[-0.3px] ${healthTone[item.tone]}`}>
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </Widget>
      </div>
    </div>
  );
}
