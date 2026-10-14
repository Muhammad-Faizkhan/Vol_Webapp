"use client";

import { useCallback, useState } from "react";
import { errorMessage, type SecurityOverview } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { useIsAdmin } from "@/components/auth/RequireAdmin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast } from "@/components/ui/Toast";
import { Toggle } from "@/components/ui/Toggle";
import { Widget } from "@/components/ui/Widget";
import { api } from "@/lib/api";

export default function SecurityPage() {
  const isAdmin = useIsAdmin();
  const { data, error, mutate } = useApiQuery<SecurityOverview>(isAdmin ? "/admin/security" : null, { refreshInterval: 60_000 });
  const [toast, setToast] = useState<{ title: string; message?: string; tone: "success" | "danger" } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  async function toggle(key: string, label: string, value: boolean) {
    try {
      await mutate(await api.put<SecurityOverview>("/admin/security", { changes: { [key]: value } }), { revalidate: false });
      setToast({ title: `${label} ${value ? "enabled" : "disabled"}`, message: "Applies to every account immediately.", tone: "success" });
    } catch (err) {
      setToast({ title: "Couldn't update policy", message: errorMessage(err), tone: "danger" });
    }
  }

  if (!isAdmin) return <PageHeader title="Security Center" subtitle="Only administrators can change access policy." />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Security Center" subtitle="Session control, sign-in anomalies and access policy for the admin portal." />

      {data && (
        <div className="flex flex-wrap gap-4">
          {[
            ["Failed sign-ins (24 h)", data.health.securityAlerts24h],
            ["Failed admin logins (24 h)", data.health.failedAdminLogins24h],
            ["Open critical cases", data.health.openCriticalCases],
          ].map(([label, value]) => (
            <div key={label} className="flex min-w-[200px] flex-col gap-2 rounded-lg border border-dak-cta bg-dak-surface px-6 py-4">
              <span className="text-sm text-dak-body">{label}</span>
              <span className="text-2xl font-medium text-dak-heading">{value}</span>
            </div>
          ))}
        </div>
      )}

      <Widget title="Access policy" subtitle="Applies to every account" className="w-full max-w-[786px]">
        {error && <p className="text-adm-danger">{errorMessage(error)}</p>}
        <ul className="flex flex-col gap-6">
          {data?.policies.map((p) => (
            <li key={p.key} className="flex min-h-20 flex-col justify-center gap-2.5 rounded-[14px] border border-[#31384a] bg-[#111520] px-4 py-[11px]">
              <div className="flex items-center justify-between gap-4">
                <p className="text-base text-white">{p.label}</p>
                <Toggle label={p.label} checked={p.value} onChange={(v) => toggle(p.key, p.label, v)} />
              </div>
              {p.hint && <p className="text-base text-dak-muted">{p.hint}</p>}
            </li>
          ))}
        </ul>
      </Widget>
      {toast && <Toast title={toast.title} message={toast.message} tone={toast.tone} onClose={closeToast} />}
    </div>
  );
}
