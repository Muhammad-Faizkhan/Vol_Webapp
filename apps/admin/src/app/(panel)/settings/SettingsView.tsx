"use client";

import Image from "next/image";
import { useState } from "react";
import { Chips } from "@/components/ui/Chips";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toggle } from "@/components/ui/Toggle";
import { type SettingField, type SettingsTab, settingsTabs } from "@/lib/settings";

const pill = "h-10 rounded-2xl border border-dak-muted bg-transparent text-sm font-medium leading-5 text-dak-heading focus:border-dak-cta focus:outline-none";

function FieldControl({
  field,
  onChange,
}: {
  field: SettingField;
  onChange: (value: string | boolean) => void;
}) {
  switch (field.kind) {
    case "text":
      return <span className="text-right text-sm font-medium leading-5 text-dak-heading">{field.value}</span>;
    case "toggle":
      return <Toggle label={field.label} checked={field.value} onChange={onChange} />;
    case "number":
      return (
        <input
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={field.label}
          className={`${pill} w-[55px] p-2 text-center`}
        />
      );
    case "select":
      return (
        <span className="relative shrink-0">
          <select
            value={field.value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={field.label}
            className={`${pill} min-w-[103px] cursor-pointer appearance-none pl-4 pr-9 [&>option]:bg-dak-surface`}
          >
            {field.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <Image
            src="/icons/select-chevron.svg"
            alt=""
            width={18}
            height={18}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 -rotate-90"
          />
        </span>
      );
  }
}

export function SettingsView({ tab }: { tab: string }) {
  // Edits are kept per tab in local state until a settings API exists.
  const [tabs, setTabs] = useState<SettingsTab[]>(settingsTabs);
  const current = tabs.find((t) => t.value === tab) ?? tabs[0];

  const update = (cardIndex: number, fieldIndex: number, value: string | boolean) =>
    setTabs((all) =>
      all.map((t) =>
        t.value !== current.value
          ? t
          : {
              ...t,
              cards: t.cards.map((c, ci) =>
                ci !== cardIndex
                  ? c
                  : { ...c, fields: c.fields.map((f, fi) => (fi === fieldIndex ? ({ ...f, value } as SettingField) : f)) },
              ),
            },
      ),
    );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" subtitle="Platform-wide configuration." />

      <Chips
        label="Settings sections"
        value={current.value}
        items={tabs.map((t) => ({ value: t.value, label: t.label, href: t.value === "overview" ? "/settings" : `/settings?tab=${t.value}` }))}
      />

      <div className="grid items-start gap-6 2xl:grid-cols-2">
        {current.cards.map((card, ci) => (
          <section
            key={card.title}
            className="flex w-full max-w-[700px] flex-col gap-4 rounded-lg border border-dak-border/40 bg-dak-surface p-[25px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)]"
          >
            <h2 className="font-heading text-sm font-medium uppercase leading-4 tracking-[1.4px] text-dak-heading">{card.title}</h2>
            <div className="flex flex-col gap-2 border-t border-dak-border/40 pt-[18px]">
              {card.fields.map((field, fi) => (
                <div
                  key={field.label}
                  className="flex items-center justify-between gap-4 border-b border-dak-border/40 pb-4 last:border-b-0"
                >
                  <span className="text-sm leading-5 text-dak-body">{field.label}</span>
                  <FieldControl field={field} onChange={(v) => update(ci, fi, v)} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
