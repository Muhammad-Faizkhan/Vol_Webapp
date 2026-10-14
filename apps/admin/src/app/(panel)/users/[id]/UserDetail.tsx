"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";
import { errorMessage, formatDate, timeAgo, titleCase, type AdminUserDetail } from "@vol/api-client";
import { useApiQuery, useInvalidate } from "@vol/api-client/react";
import { useIsAdmin } from "@/components/auth/RequireAdmin";
import { ActionModal } from "@/components/modals/ActionModal";
import { type ModerationAction, moderationActions } from "@/components/modals/moderation";
import { BackLink } from "@/components/ui/BackLink";
import { Chips } from "@/components/ui/Chips";
import { DetailCard, DetailRow } from "@/components/ui/DetailCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge, accountStatusTone } from "@/components/ui/StatusBadge";
import { Toast, type ToastTone } from "@/components/ui/Toast";
import { accountStatusLabel, accountTypeLabel } from "@/lib/admin";
import { api } from "@/lib/api";
import { UserAvatar } from "../UsersTable";

export type UserTab = "profile" | "workspaces" | "classrooms";

type AccountAction = Extract<ModerationAction, "suspend" | "ban" | "delete" | "warn"> | "reinstate";

const outcomes: Record<AccountAction, { toast: string; tone: ToastTone }> = {
  suspend: { toast: "Suspend user completed", tone: "warning" },
  ban: { toast: "Ban user completed", tone: "danger" },
  delete: { toast: "Delete user completed", tone: "danger" },
  warn: { toast: "Warning issued", tone: "info" },
  reinstate: { toast: "Account reinstated", tone: "success" },
};

const reinstateCopy = {
  title: "Reinstate this account?",
  description: "The user regains access to workspaces, classrooms and community immediately.",
  confirmLabel: "Reinstate",
  confirmClassName: "bg-adm-success",
};

function TableCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full max-w-[815px] flex-col gap-8 rounded-2xl border border-dak-border bg-dak-surface px-[clamp(16px,calc(2.1*var(--vw)),40px)] pb-10 pt-6">
      <h2 className="font-heading text-sm font-medium uppercase leading-4 tracking-[1.4px] text-dak-heading">{title}</h2>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

const wsCols = "grid-cols-[minmax(120px,2.6fr)_minmax(60px,1.2fr)_minmax(60px,1.4fr)_minmax(70px,1.5fr)_minmax(70px,1.4fr)_minmax(60px,0.9fr)]";
const crCols = "grid-cols-[minmax(120px,2.2fr)_minmax(70px,1.5fr)_minmax(70px,2.6fr)_minmax(90px,1fr)]";
const headCls = "items-center gap-4 border-b border-dak-muted/50 pb-6 text-sm font-medium leading-4 tracking-[0.28px] text-dak-body";

export function UserDetail({ id, tab }: { id: string; tab: UserTab }) {
  const router = useRouter();
  const invalidate = useInvalidate();
  const isAdmin = useIsAdmin();
  const { data: user, error, mutate } = useApiQuery<AdminUserDetail>(`/admin/users/${id}`);
  const [action, setAction] = useState<AccountAction | null>(null);
  const [toast, setToast] = useState<{ title: string; message?: string; tone: ToastTone } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  if (error) return <p className="text-adm-danger">{errorMessage(error)}</p>;
  if (!user) return <p className="text-dak-body">Loading…</p>;

  const status = accountStatusLabel[user.status];
  const tabHref = (t: UserTab) => (t === "profile" ? `/users/${user.id}` : `/users/${user.id}?tab=${t}`);

  async function confirm(reason: string) {
    const current = action!;
    setAction(null);
    try {
      const result = await api.post<AdminUserDetail | { deleted: true }>(`/admin/users/${id}/${current}`, { reason });
      setToast({ title: outcomes[current].toast, tone: outcomes[current].tone });
      await invalidate("/admin/users", "/admin/dashboard", "/admin/cases");
      if ("deleted" in result) setTimeout(() => router.push("/users"), 1500);
      else await mutate(result, { revalidate: false });
    } catch (err) {
      setToast({ title: "Action failed", message: errorMessage(err), tone: "danger" });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/users" />

      <PageHeader
        title="User Details"
        subtitle={`${user.displayId} · ${accountTypeLabel(user.accountType).toLowerCase()}`}
        actions={
          <>
            <button
              type="button"
              onClick={() => setAction("warn")}
              className="flex h-12 items-center gap-2 rounded-[28px] border border-adm-blue px-4 text-base font-medium tracking-[-0.32px] text-adm-blue"
            >
              Warn
            </button>
            {user.status === "ACTIVE" ? (
              <button
                type="button"
                onClick={() => setAction("suspend")}
                className="flex h-12 items-center gap-2 rounded-[28px] border border-adm-warning px-4 text-base font-medium tracking-[-0.32px] text-adm-warning"
              >
                <Image src="/icons/user-minus-yellow.svg" alt="" width={18} height={18} />
                Suspend Account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAction("reinstate")}
                className="flex h-12 items-center gap-2 rounded-[28px] border border-adm-success px-4 text-base font-medium tracking-[-0.32px] text-adm-success"
              >
                Reinstate
              </button>
            )}
            <button
              type="button"
              onClick={() => setAction("ban")}
              disabled={user.status === "BANNED"}
              className="flex h-12 items-center gap-2 rounded-[28px] bg-adm-danger px-4 text-sm font-medium tracking-[-0.32px] text-dak-heading disabled:opacity-50"
            >
              <Image src="/icons/banned-white.svg" alt="" width={18} height={18} />
              Ban User
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setAction("delete")}
                className="flex h-12 items-center gap-2 rounded-[28px] bg-adm-danger-dark px-4 text-base font-medium tracking-[-0.32px] text-dak-heading"
              >
                <Image src="/icons/delete.svg" alt="" width={18} height={18} />
                Delete User
              </button>
            )}
          </>
        }
      />

      <div className="flex items-start gap-[11px]">
        <UserAvatar src={user.avatarUrl} name={user.name} size={60} />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-lg font-semibold tracking-[-0.2px] text-dak-heading">{user.name}</p>
          <p className="text-sm font-medium leading-4 tracking-[0.28px] text-dak-body">{user.email}</p>
          <span className="flex w-fit items-center gap-3">
            <StatusBadge label={status} tone={accountStatusTone(status)} />
            {user.reports > 0 && <span className="text-sm text-adm-danger-text">{user.reports} reports</span>}
          </span>
        </div>
      </div>

      <Chips
        label="User sections"
        value={tab}
        items={[
          { value: "profile", label: "Profile", href: tabHref("profile") },
          { value: "workspaces", label: "Workspaces", href: tabHref("workspaces") },
          { value: "classrooms", label: "Classrooms", href: tabHref("classrooms") },
        ]}
      />

      {tab === "profile" && (
        <div className="flex flex-col gap-6">
          <DetailCard title="Account Details" className="w-full max-w-[760px]">
            <DetailRow label="Username">{user.username ? `@${user.username}` : "—"}</DetailRow>
            <DetailRow label="Phone">{user.phone ?? "—"}</DetailRow>
            <DetailRow label="Country">{user.country ?? "—"}</DetailRow>
            <DetailRow label="City">{user.city ?? "—"}</DetailRow>
            <DetailRow label="Account type">{accountTypeLabel(user.accountType)}</DetailRow>
            {user.business && <DetailRow label="Business verification">{titleCase(user.business.verification)}</DetailRow>}
            <DetailRow label="Email verified">{user.emailVerified ? "Yes" : "No"}</DetailRow>
            <DetailRow label="Joined">{formatDate(user.joinedAt)}</DetailRow>
            <DetailRow label="Last active">{timeAgo(user.lastActiveAt)}</DetailRow>
            <DetailRow label="Profile visibility">{titleCase(user.visibility)}</DetailRow>
          </DetailCard>
          {user.history.length > 0 && (
            <DetailCard title="Moderation history" className="w-full max-w-[760px]">
              {user.history.map((h) => (
                <DetailRow key={h.id} label={`${titleCase(h.type)} · ${timeAgo(h.createdAt)}`}>
                  {h.reason} — {h.actor.name}
                </DetailRow>
              ))}
            </DetailCard>
          )}
        </div>
      )}

      {tab === "workspaces" && (
        <TableCard title="workspaces Details">
          <div className="min-w-[640px]">
            <div className={`grid ${wsCols} ${headCls}`}>
              <span>Workspace</span>
              <span>Role</span>
              <span className="text-center">Member</span>
              <span className="text-center">Canvases</span>
              <span>Visibility</span>
              <span className="text-right">Updated</span>
            </div>
            {user.workspaces.length === 0 && <p className="pt-8 text-sm text-dak-body">Not a member of any workspace.</p>}
            <ul className="flex flex-col gap-8 pt-8">
              {user.workspaces.map((w) => (
                <li key={w.id} className={`grid ${wsCols} items-center gap-4 text-sm font-medium leading-4 tracking-[0.28px] text-dak-body`}>
                  <span className="truncate text-base font-normal tracking-[-0.2px] text-dak-heading">{w.name}</span>
                  <span>{titleCase(w.role)}</span>
                  <span className="text-center text-dak-heading">{String(w.members).padStart(2, "0")}</span>
                  <span className="text-center text-dak-heading">{String(w.canvases).padStart(2, "0")}</span>
                  <span>{titleCase(w.visibility)}</span>
                  <span className="text-right">{timeAgo(w.updatedAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        </TableCard>
      )}

      {tab === "classrooms" && (
        <TableCard title="Classrooms Details">
          <div className="min-w-[560px]">
            <div className={`grid ${crCols} ${headCls}`}>
              <span>Classroom</span>
              <span>Role</span>
              <span>Progress</span>
              <span className="text-center">Status</span>
            </div>
            {user.classrooms.length === 0 && <p className="pt-6 text-sm text-dak-body">No classrooms.</p>}
            <ul className="flex flex-col gap-6 pt-6">
              {user.classrooms.map((c) => (
                <li key={`${c.id}-${c.role}`} className={`grid ${crCols} items-center gap-4 text-sm font-medium leading-4 tracking-[0.28px] text-dak-body`}>
                  <span className="truncate text-base font-normal tracking-[-0.2px] text-dak-heading">{c.title}</span>
                  <span>{titleCase(c.role)}</span>
                  <span className="text-dak-heading">{c.progress === null ? "—" : `${c.progress}%`}</span>
                  <span className="flex justify-end">
                    <StatusBadge label={titleCase(c.status)} tone={c.status === "ACTIVE" ? "success" : "neutral"} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TableCard>
      )}

      {action && (
        <ActionModal {...(action === "reinstate" ? reinstateCopy : moderationActions[action])} onClose={() => setAction(null)} onConfirm={confirm} />
      )}
      {toast && <Toast title={toast.title} message={toast.message} tone={toast.tone} onClose={closeToast} />}
    </div>
  );
}
