"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ActionModal } from "@/components/modals/ActionModal";
import { type ModerationAction, moderationActions } from "@/components/modals/moderation";
import { BackLink } from "@/components/ui/BackLink";
import { DetailCard, DetailRow } from "@/components/ui/DetailCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast, type ToastTone } from "@/components/ui/Toast";
import type { AdminCase } from "@/lib/mock-data";

type CaseAction = Exclude<ModerationAction, "delete">;

const outcomes: Record<CaseAction, { toast: string; tone: ToastTone }> = {
  dismiss: { toast: "Dismiss case completed", tone: "info" },
  warn: { toast: "Issue warning completed", tone: "info" },
  suspend: { toast: "Suspend user completed", tone: "warning" },
  ban: { toast: "Ban user completed", tone: "danger" },
};

const outlineBtn =
  "flex h-12 items-center justify-center rounded-[28px] border border-dak-body px-4 text-base font-medium tracking-[-0.32px] text-dak-body";

export function CaseDetail({ escalation }: { escalation: AdminCase }) {
  const router = useRouter();
  const [action, setAction] = useState<CaseAction | null>(null);
  const [toast, setToast] = useState<{ title: string; tone: ToastTone } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/cases" />
      <PageHeader title={escalation.title} subtitle={escalation.id} />

      <DetailCard
        title="Case details"
        className="w-full max-w-[760px]"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2 font-heading text-sm font-medium uppercase leading-4 tracking-[1.4px]">
            <span className="text-dak-body">recommendation</span>
            <span className="text-dak-heading">{escalation.recommendation}</span>
          </div>
        }
      >
        <DetailRow label="Reported account">{escalation.reportedAccount}</DetailRow>
        <DetailRow label="Violation">{escalation.violation}</DetailRow>
        <DetailRow label="Escalated by">{escalation.escalatedBy}</DetailRow>
        <DetailRow label="Opened">{escalation.openedLocation}</DetailRow>
      </DetailCard>

      <DetailCard title="evidence" className="w-full max-w-[760px]">
        {escalation.evidence.map((item) => (
          <DetailRow key={item} label={item} />
        ))}
      </DetailCard>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={() => setAction("dismiss")} className={outlineBtn}>
          Dismiss Case
        </button>
        <button type="button" onClick={() => setAction("warn")} className={outlineBtn}>
          Issue Warning
        </button>
        <button
          type="button"
          onClick={() => setAction("suspend")}
          className="flex h-12 items-center gap-2 rounded-[28px] border border-adm-warning px-4 text-base font-medium tracking-[-0.32px] text-adm-warning"
        >
          <Image src="/icons/user-minus-yellow.svg" alt="" width={18} height={18} />
          Suspend Account
        </button>
        <button
          type="button"
          onClick={() => setAction("ban")}
          className="flex h-12 items-center gap-2 rounded-[28px] bg-adm-danger px-4 text-sm font-medium tracking-[-0.32px] text-dak-heading"
        >
          <Image src="/icons/banned-white.svg" alt="" width={18} height={18} />
          Ban User
        </button>
      </div>

      {action && (
        <ActionModal
          {...moderationActions[action]}
          onClose={() => setAction(null)}
          onConfirm={() => {
            setToast({ title: outcomes[action].toast, tone: outcomes[action].tone });
            if (action === "dismiss") setTimeout(() => router.push("/cases"), 1500);
            setAction(null);
          }}
        />
      )}
      {toast && <Toast title={toast.title} tone={toast.tone} onClose={closeToast} />}
    </div>
  );
}
