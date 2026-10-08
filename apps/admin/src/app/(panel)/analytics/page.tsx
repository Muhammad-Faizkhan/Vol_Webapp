"use client";

import { useState } from "react";
import { ActivityChart } from "@/components/charts/ActivityChart";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { ShareDonut } from "@/components/charts/ShareDonut";
import { Chips } from "@/components/ui/Chips";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Widget } from "@/components/ui/Widget";
import { accountShare, activityByWeek, analyticsStats, userGrowthYearly } from "@/lib/mock-data";

const tabs = [
  { value: "growth", label: "Growth" },
  { value: "engagement", label: "Engagement" },
  { value: "composition", label: "Composition" },
];

export default function AnalyticsPage() {
  const [tab, setTab] = useState("growth");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Analytics" subtitle="Aggregate performance — growth, engagement, content and safety." />

      <div className="grid grid-cols-1 gap-x-[19px] gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <Chips label="Analytics views" items={tabs} value={tab} onChange={setTab} />

      <div className="w-full max-w-[800px]">
        {tab === "growth" && (
          <Widget title="User & business growth" subtitle="Cumulative accounts and monthly active users" period="Yearly">
            <GrowthChart
              data={userGrowthYearly}
              defaultIndex={7}
              series={[
                { key: "total", label: "Total User", color: "#9436fb", stroke: "progress" },
                { key: "active", label: "Active User", color: "#4285f4" },
              ]}
            />
          </Widget>
        )}
        {tab === "engagement" && (
          <Widget title="Workspace, canvas, classroom & catalog activity" period="Monthly">
            <ActivityChart data={activityByWeek} />
          </Widget>
        )}
        {tab === "composition" && (
          <Widget title="Workspace, canvas, classroom & catalog activity" subtitle="Share of platform accounts by type">
            <ShareDonut data={accountShare} />
          </Widget>
        )}
      </div>
    </div>
  );
}
