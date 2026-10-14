"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { errorMessage, type SettingField, type SettingsTab } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { useIsAdmin } from "@/components/auth/RequireAdmin";
import { Chips } from "@/components/ui/Chips";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast } from "@/components/ui/Toast";
import { Toggle } from "@/components/ui/Toggle";
import { api } from "@/lib/api";

const pill = "h-10 rounded-2xl border border-dak-muted bg-transparent text-sm font-medium leading-5 text-dak-heading focus:border-dak-cta focus:outline-none";

/** Text and number fields keep a local draft and save on blur/Enter; toggles and selects save at once. */
function FieldControl({ field, onSave }: { field: SettingField; onSave: (value: string | number | boolean) => void }) {
  const [draft, setDraft] = useState(String(field.value));
  const commit = () => {
    if (draft === String(field.value)) return;
    onSave(field.kind === "number" ? Number(draft.replace(/[^\d.]/g, "")) : draft.trim());
  };
  switch (field.kind) {
    case "text":
      return (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          aria-label={field.label}
          className={`${pill} w-[200px] px-3 text-right`}
        />
      );
    case "toggle":
      return <Toggle label={field.label} checked={field.value} onChange={(v) => onSave(v)} />;
    case "number":
      return (
        <input
          inputMode="numeric"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          aria-label={field.label}
          className={`${pill} w-[70px] p-2 text-center`}
        />
      );
    case "select":
      return (
        <span className="relative shrink-0">
          <select
            value={field.value}
            onChange={(e) => onSave(e.target.value)}
            aria-label={field.label}
            className={`${pill} min-w-[103px] cursor-pointer appearance-none pl-4 pr-9 [&>option]:bg-dak-surface`}
          >
            {field.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <Image src="/icons/select-chevron.svg" alt="" width={18} height={18} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 -rotate-90" />
        </span>
      );
  }
}

export function SettingsView({ tab }: { tab: string }) {
  const isAdmin = useIsAdmin();
  const { data: tabs, error, mutate } = useApiQuery<SettingsTab[]>(isAdmin ? "/admin/settings" : null);
  const [toast, setToast] = useState<{ title: string; message?: string; tone: "success" | "danger" } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  if (!isAdmin) return <PageHeader title="Settings" subtitle="Only administrators can change platform settings." />;
  if (error) return <p className="text-adm-danger">{errorMessage(error)}</p>;
  if (!tabs) return <p className="text-dak-body">Loading…</p>;
  const current = tabs.find((t) => t.value === tab) ?? tabs[0];

  async function save(field: SettingField, value: string | number | boolean) {
    try {
      await mutate(await api.put<SettingsTab[]>("/admin/settings", { changes: { [field.key]: value } }), { revalidate: false });
      setToast({ title: `${field.label} updated`, message: "Saved and recorded in the audit log.", tone: "success" });
    } catch (err) {
      setToast({ title: "Couldn't save", message: errorMessage(err), tone: "danger" });
      await mutate();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" subtitle="Platform-wide configuration. Changes apply immediately." />

      <Chips
        label="Settings sections"
        value={current.value}
        items={tabs.map((t) => ({ value: t.value, label: t.label, href: t.value === "overview" ? "/settings" : `/settings?tab=${t.value}` }))}
      />

      <div className="grid items-start gap-6 2xl:grid-cols-2">
        {current.cards.map((card) => (
          <section
            key={card.title}
            className="flex w-full max-w-[700px] flex-col gap-4 rounded-lg border border-dak-border/40 bg-dak-surface p-[25px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)]"
          >
            <h2 className="font-heading text-sm font-medium uppercase leading-4 tracking-[1.4px] text-dak-heading">{card.title}</h2>
            <div className="flex flex-col gap-2 border-t border-dak-border/40 pt-[18px]">
              {card.fields.map((field) => (
                <div key={field.key} className="flex items-center justify-between gap-4 border-b border-dak-border/40 pb-4 last:border-b-0">
                  <span className="text-sm leading-5 text-dak-body">{field.label}</span>
                  {/* Keyed on the value so a saved/reverted value resets the field's draft. */}
                  <FieldControl key={String(field.value)} field={field} onSave={(v) => save(field, v)} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {toast && <Toast title={toast.title} message={toast.message} tone={toast.tone} onClose={closeToast} />}
    </div>
  );
}
