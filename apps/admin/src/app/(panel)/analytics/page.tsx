"use client";

import { useState } from "react";
import type { AdminAnalytics, AdminDashboard } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { ActivityChart } from "@/components/charts/ActivityChart";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { ShareDonut } from "@/components/charts/ShareDonut";
import { Chips } from "@/components/ui/Chips";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Widget } from "@/components/ui/Widget";
import { stat } from "@/lib/admin";

const tabs = [
  { value: "growth", label: "Growth" },
  { value: "engagement", label: "Engagement" },
  { value: "composition", label: "Composition" },
];

// Donut colors from Figma 790:5518, extended for extra business segments.
const SHARE_COLORS = ["#4285f4", "#fbbc05", "#3bcc92", "#9436fb", "#ea4335"];

export default function AnalyticsPage() {
  const [tab, setTab] = useState("growth");
  const [period, setPeriod] = useState<"yearly" | "monthly">("yearly");
  const { data } = useApiQuery<AdminAnalytics>(`/admin/analytics?period=${period}`);
  const { data: dashboard } = useApiQuery<AdminDashboard>(tab === "engagement" ? "/admin/dashboard" : null);

  const stats = data
    ? [
        stat("Total Users", "/icons/nav/users.svg", data.stats.totalUsers, undefined, "All registered accounts"),
        stat("Active workspaces", "/icons/stats/workspaces.svg", data.stats.activeWorkspaces, undefined, "Updated in the last 30 days"),
        stat("Classrooms running", "/icons/stats/classrooms.svg", data.stats.classroomsRunning, undefined, "Published"),
        stat("Total products", "/icons/stats/products.svg", data.stats.products, undefined, "Published in catalogs"),
      ]
    : [];
  const now = new Date();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Analytics" subtitle="Aggregate performance — growth, engagement, content and safety." />

      <div className="grid grid-cols-1 gap-x-[19px] gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
        {!data && Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[120px] animate-pulse rounded-lg bg-dak-surface" />)}
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Chips label="Analytics views" items={tabs} value={tab} onChange={setTab} />
        {tab === "growth" && (
          <Chips
            label="Growth period"
            items={[
              { value: "yearly", label: "Yearly" },
              { value: "monthly", label: "Monthly" },
            ]}
            value={period}
            onChange={(v) => setPeriod(v as "yearly" | "monthly")}
          />
        )}
      </div>

      <div className="w-full max-w-[800px]">
        {tab === "growth" && (
          <Widget title="User & business growth" subtitle="Cumulative accounts and active users" period={period === "yearly" ? "Yearly" : "Monthly"}>
            {data && (
              <GrowthChart
                key={period}
                data={data.growth}
                defaultIndex={period === "yearly" ? now.getMonth() : now.getDate() - 1}
                series={[
                  { key: "total", label: "Total User", color: "#9436fb", stroke: "progress" },
                  { key: "active", label: "Active User", color: "#4285f4" },
                ]}
              />
            )}
          </Widget>
        )}
        {tab === "engagement" && (
          <Widget title="Workspace, canvas, classroom & catalog activity" period="Monthly">
            {dashboard && <ActivityChart data={dashboard.activityByWeek} />}
          </Widget>
        )}
        {tab === "composition" && (
          <Widget title="Account composition" subtitle="Share of platform accounts by type">
            {data && <ShareDonut data={data.accountShare.map((s, i) => ({ ...s, color: SHARE_COLORS[i % SHARE_COLORS.length] }))} />}
          </Widget>
        )}
      </div>
    </div>
  );
}
