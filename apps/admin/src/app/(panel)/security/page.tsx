"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toggle } from "@/components/ui/Toggle";
import { Widget } from "@/components/ui/Widget";

// Copy verbatim from Figma node 791:5770 (including "crendentials").
const policies = [
  { key: "twoFactor", title: "Require 2FA for all Users", hint: "Blocks sign-in until enrolment is complete", on: false },
  { key: "reauth", title: "Re-auth for destructive actions", hint: "Password prompt before bans and deletions", on: true },
  { key: "account", title: "Account & security", hint: "Manage account crendentials", on: false },
  { key: "lockout", title: "Lock account after failed attempts", hint: "Consecutive failures before lockout", on: false },
  { key: "timeout", title: "Session timeout", hint: "Idle 30 minutes before automatic sign-out", on: false },
  { key: "newDevice", title: "Alert on new device sign-in", hint: "Alert every user by notifications", on: false },
];

export default function SecurityPage() {
  const [state, setState] = useState(() => Object.fromEntries(policies.map((p) => [p.key, p.on])));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Security Center"
        subtitle="Session control, sign-in anomalies and access policy for the admin portal."
      />

      <Widget title="Access policy" subtitle="Applies to every account" className="w-full max-w-[786px]">
        <ul className="flex flex-col gap-6">
          {policies.map((p) => (
            <li
              key={p.key}
              className="flex min-h-20 flex-col justify-center gap-2.5 rounded-[14px] border border-[#31384a] bg-[#111520] px-4 py-[11px]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-base text-white">{p.title}</p>
                <Toggle
                  label={p.title}
                  checked={state[p.key]}
                  onChange={(v) => setState((s) => ({ ...s, [p.key]: v }))}
                />
              </div>
              <p className="text-base text-dak-muted">{p.hint}</p>
            </li>
          ))}
        </ul>
      </Widget>
    </div>
  );
}
