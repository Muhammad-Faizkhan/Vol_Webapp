"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { errorMessage, formatDate, timeAgo, titleCase, type AdminCaseDetail } from "@vol/api-client";
import { useApiQuery, useInvalidate } from "@vol/api-client/react";
import { ActionModal } from "@/components/modals/ActionModal";
import { type ModerationAction, moderationActions } from "@/components/modals/moderation";
import { BackLink } from "@/components/ui/BackLink";
import { DetailCard, DetailRow } from "@/components/ui/DetailCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Toast, type ToastTone } from "@/components/ui/Toast";
import { caseStatusLabel } from "@/lib/admin";
import { api } from "@/lib/api";

type CaseAction = Exclude<ModerationAction, "delete">;

const outcomes: Record<CaseAction, { toast: string; tone: ToastTone }> = {
  dismiss: { toast: "Dismiss case completed", tone: "info" },
  warn: { toast: "Issue warning completed", tone: "info" },
  suspend: { toast: "Suspend user completed", tone: "warning" },
  ban: { toast: "Ban user completed", tone: "danger" },
};

const outlineBtn = "flex h-12 items-center justify-center rounded-[28px] border border-dak-body px-4 text-base font-medium tracking-[-0.32px] text-dak-body disabled:opacity-40";

export function CaseDetail({ id }: { id: string }) {
  const router = useRouter();
  const invalidate = useInvalidate();
  const { data: c, error, mutate } = useApiQuery<AdminCaseDetail>(`/admin/cases/${id}`);
  const [action, setAction] = useState<CaseAction | null>(null);
  const [toast, setToast] = useState<{ title: string; message?: string; tone: ToastTone } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  if (error) return <p className="text-adm-danger">{errorMessage(error)}</p>;
  if (!c) return <p className="text-dak-body">Loading…</p>;
  const closed = c.status === "RESOLVED" || c.status === "DISMISSED";

  async function run(kind: CaseAction | "review" | "reopen", reason = "") {
    setAction(null);
    try {
      const updated = await api.post<AdminCaseDetail>(`/admin/cases/${c!.id}/${kind}`, { reason });
      await mutate(updated, { revalidate: false });
      await invalidate("/admin/cases", "/admin/users", "/admin/dashboard");
      if (kind === "review") setToast({ title: "Case marked in review", tone: "info" });
      else if (kind === "reopen") setToast({ title: "Case reopened", tone: "info" });
      else {
        setToast({ title: outcomes[kind].toast, tone: outcomes[kind].tone });
        if (kind === "dismiss") setTimeout(() => router.push("/cases"), 1500);
      }
    } catch (err) {
      setToast({ title: "Action failed", message: errorMessage(err), tone: "danger" });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/cases" />
      <PageHeader
        title={c.title}
        subtitle={c.displayId}
        actions={<StatusBadge label={caseStatusLabel[c.status]} tone={c.status === "OPEN" ? "success" : c.status === "IN_REVIEW" ? "warning" : "neutral"} />}
      />

      <DetailCard
        title="Case details"
        className="w-full max-w-[760px]"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2 font-heading text-sm font-medium uppercase leading-4 tracking-[1.4px]">
            <span className="text-dak-body">recommendation</span>
            <span className="text-dak-heading">{c.recommendation ?? (c.reportCount >= 3 ? "Suspension recommended" : "Review and decide")}</span>
          </div>
        }
      >
        <DetailRow label="Reported account">
          <Link href={`/users/${c.reportedUser.id}`} className="text-dak-cta underline-offset-2 hover:underline">
            {c.reportedUser.name}
          </Link>
        </DetailRow>
        <DetailRow label="Violation">{c.violation}</DetailRow>
        <DetailRow label="Escalated">{formatDate(c.escalatedAt)}</DetailRow>
        <DetailRow label="Reports">{c.reportCount}</DetailRow>
        {c.assignee && <DetailRow label="Assigned to">{c.assignee.name}</DetailRow>}
        {c.resolvedAt && <DetailRow label="Closed">{formatDate(c.resolvedAt)}</DetailRow>}
      </DetailCard>

      <DetailCard title="evidence" className="w-full max-w-[760px]">
        {c.evidence.map((item) => (
          <DetailRow key={item} label={item} />
        ))}
      </DetailCard>

      <DetailCard title="reports" className="w-full max-w-[760px]">
        {c.reports.map((r) => (
          <DetailRow key={r.id} label={`${r.reason} · ${titleCase(r.targetType)} · ${timeAgo(r.createdAt)}`}>
            {r.reporter.name}
            {r.details ? ` — “${r.details}”` : ""}
          </DetailRow>
        ))}
      </DetailCard>

      {c.actions.length > 0 && (
        <DetailCard title="actions taken" className="w-full max-w-[760px]">
          {c.actions.map((a) => (
            <DetailRow key={a.id} label={`${titleCase(a.type)} · ${timeAgo(a.createdAt)}`}>
              {a.reason} — {a.actor.name}
            </DetailRow>
          ))}
        </DetailCard>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {closed ? (
          <button type="button" onClick={() => run("reopen")} className={outlineBtn}>
            Reopen Case
          </button>
        ) : (
          <>
            {c.status === "OPEN" && (
              <button type="button" onClick={() => run("review")} className={outlineBtn}>
                Mark In Review
              </button>
            )}
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
          </>
        )}
      </div>

      {action && <ActionModal {...moderationActions[action]} onClose={() => setAction(null)} onConfirm={(reason) => run(action, reason)} />}
      {toast && <Toast title={toast.title} message={toast.message} tone={toast.tone} onClose={closeToast} />}
    </div>
  );
}
