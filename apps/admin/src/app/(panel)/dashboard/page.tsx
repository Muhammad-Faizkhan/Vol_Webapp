"use client";

import Image from "next/image";
import Link from "next/link";
import type { AdminDashboard } from "@vol/api-client";
import { useApiQuery, useAuth } from "@vol/api-client/react";
import { ActivityChart } from "@/components/charts/ActivityChart";
import { GrowthChart } from "@/components/charts/GrowthChart";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Widget } from "@/components/ui/Widget";
import { stat } from "@/lib/admin";

const healthTone = {
  danger: "bg-adm-danger-text/15 text-adm-danger-text",
  warning: "bg-adm-warning/15 text-adm-warning",
};

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data } = useApiQuery<AdminDashboard>("/admin/dashboard", { refreshInterval: 60_000 });
  const s = data?.stats;

  const stats = s
    ? [
        stat("Total Users", "/icons/nav/users.svg", s.totalUsers.value, s.totalUsers.delta),
        stat("Individual Users", "/icons/stats/user.svg", s.individualUsers.value, undefined, `${Math.round((s.individualUsers.value / Math.max(1, s.totalUsers.value)) * 100)}% of users`),
        stat("Business Users", "/icons/stats/business-users.svg", s.businessUsers.value, undefined, `${Math.round((s.businessUsers.value / Math.max(1, s.totalUsers.value)) * 100)}% of users`),
        stat("Active Users (30d)", "/icons/stats/activity.svg", s.activeUsers30d.value, s.activeUsers30d.delta),
        stat("New Registrations (7d)", "/icons/stats/user-plus.svg", s.newRegistrations7d.value, undefined, `${s.newRegistrations7d.delta} vs last week`),
        stat("Total Workspaces", "/icons/stats/workspaces.svg", s.workspaces.value, s.workspaces.delta),
        stat("Total Classrooms", "/icons/stats/classrooms.svg", s.classrooms.value, s.classrooms.delta),
        stat("Total Catalogs", "/icons/stats/catalogs.svg", s.catalogs.value, s.catalogs.delta),
        stat("Total Canvases", "/icons/stats/canvases.svg", s.canvases.value, s.canvases.delta),
        { ...stat("Suspended Users", "/icons/stats/user-minus.svg", s.suspendedUsers.value, undefined, `+${s.suspendedUsers.thisWeek ?? 0} this week`), tone: "down" as const },
        { ...stat("Banned Users", "/icons/stats/banned.svg", s.bannedUsers.value, undefined, `+${s.bannedUsers.thisWeek ?? 0} this week`), tone: "down" as const },
      ]
    : [];

  const health = data
    ? [
        { label: "Open critical cases", value: data.health.openCriticalCases, tone: "danger" as const },
        { label: "Security alerts (24 h)", value: data.health.securityAlerts24h, tone: "warning" as const },
        { label: "Failed admin logins (24 h)", value: data.health.failedAdminLogins24h, tone: "warning" as const },
      ]
    : [];
  const month = new Date().getMonth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Dashboard Overview"
        title={`${greeting()}, ${user?.name.split(" ")[0] ?? ""}.`}
        actions={
          <Link href="/cases" className="flex h-14 w-[170px] items-center justify-center gap-2 rounded-xl bg-dak-cta px-4 text-base text-white">
            <Image src="/icons/case.svg" alt="" width={24} height={24} />
            Open Cases
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-x-[19px] gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!s && Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-[120px] animate-pulse rounded-lg bg-dak-surface" />)}
        {stats.map((item) => (
          <StatCard key={item.label} stat={item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[800fr_590fr]">
        <Widget title="User Growth" period="Yearly">
          {data && (
            <GrowthChart
              data={data.userGrowth}
              defaultIndex={month}
              series={[
                { key: "total", label: "Total User", color: "#9436fb", stroke: "progress" },
                { key: "active", label: "Active User", color: "#4285f4" },
              ]}
            />
          )}
        </Widget>
        <Widget title="Business Growth" period="Monthly">
          {data && (
            <GrowthChart
              data={data.businessGrowth}
              defaultIndex={Math.max(0, data.businessGrowth.length - 1)}
              series={[{ key: "business", label: "Business", color: "#9436fb", accent: "#23c54e", stroke: "dashed" }]}
            />
          )}
        </Widget>
      </div>

      <div className="grid gap-6 xl:grid-cols-[800fr_590fr]">
        <Widget title="Workspace, canvas, classroom & catalog activity" period="Monthly">
          {data && <ActivityChart data={data.activityByWeek} />}
        </Widget>
        <Widget title="Platform health">
          <ul className="flex flex-col gap-6">
            {health.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.label.startsWith("Open") ? "/cases" : "/security"}
                  className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-dak-muted bg-dak-border px-6"
                >
                  <span className="text-sm font-medium tracking-[-0.3px] text-dak-body">{item.label}</span>
                  <span className={`rounded-[30px] px-4 py-2 text-sm font-medium tracking-[-0.3px] ${healthTone[item.tone]}`}>{item.value}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Widget>
      </div>
    </div>
  );
}
