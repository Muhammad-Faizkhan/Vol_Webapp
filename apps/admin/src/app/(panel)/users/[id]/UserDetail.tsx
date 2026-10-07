"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";
import { ActionModal } from "@/components/modals/ActionModal";
import { type ModerationAction, moderationActions } from "@/components/modals/moderation";
import { BackLink } from "@/components/ui/BackLink";
import { Chips } from "@/components/ui/Chips";
import { DetailCard, DetailRow } from "@/components/ui/DetailCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge, accountStatusTone } from "@/components/ui/StatusBadge";
import { Toast, type ToastTone } from "@/components/ui/Toast";
import { type AccountStatus, type AdminUser, userClassrooms, userWorkspaces } from "@/lib/mock-data";

export type UserTab = "profile" | "workspaces" | "classrooms";

type AccountAction = Extract<ModerationAction, "suspend" | "ban" | "delete">;

const outcomes: Record<AccountAction, { status?: AccountStatus; toast: string; tone: ToastTone }> = {
  suspend: { status: "Suspended", toast: "Suspend user completed", tone: "warning" },
  ban: { status: "Ban", toast: "Ban user completed", tone: "danger" },
  delete: { toast: "Delete user completed", tone: "danger" },
};

function TableCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full max-w-[815px] flex-col gap-8 rounded-2xl border border-dak-border bg-dak-surface px-[clamp(16px,2.1vw,40px)] pb-10 pt-6">
      <h2 className="font-heading text-sm font-medium uppercase leading-4 tracking-[1.4px] text-dak-heading">{title}</h2>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

const wsCols = "grid-cols-[minmax(120px,2.6fr)_minmax(60px,1.2fr)_minmax(60px,1.4fr)_minmax(70px,1.5fr)_minmax(70px,1.4fr)_minmax(60px,0.9fr)]";
const crCols = "grid-cols-[minmax(120px,2.2fr)_minmax(70px,1.5fr)_minmax(70px,2.6fr)_minmax(90px,1fr)]";
const headCls = "items-center gap-4 border-b border-dak-muted/50 pb-6 text-sm font-medium leading-4 tracking-[0.28px] text-dak-body";

export function UserDetail({ user, tab }: { user: AdminUser; tab: UserTab }) {
  const router = useRouter();
  const [status, setStatus] = useState(user.status);
  const [action, setAction] = useState<AccountAction | null>(null);
  const [toast, setToast] = useState<{ title: string; tone: ToastTone } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const tabHref = (t: UserTab) => (t === "profile" ? `/users/${user.id}` : `/users/${user.id}?tab=${t}`);

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/users" />

      <PageHeader
        title="User Details"
        subtitle={`${user.id} · ${user.type.toLowerCase()}`}
        actions={
          <>
            <button
              type="button"
              onClick={() => setAction("suspend")}
              disabled={status !== "Active"}
              className="flex h-12 items-center gap-2 rounded-[28px] border border-adm-warning px-4 text-base font-medium tracking-[-0.32px] text-adm-warning disabled:opacity-50"
            >
              <Image src="/icons/user-minus-yellow.svg" alt="" width={18} height={18} />
              Suspend Account
            </button>
            <button
              type="button"
              onClick={() => setAction("ban")}
              disabled={status === "Ban"}
              className="flex h-12 items-center gap-2 rounded-[28px] bg-adm-danger px-4 text-sm font-medium tracking-[-0.32px] text-dak-heading disabled:opacity-50"
            >
              <Image src="/icons/banned-white.svg" alt="" width={18} height={18} />
              Ban User
            </button>
            <button
              type="button"
              onClick={() => setAction("delete")}
              className="flex h-12 items-center gap-2 rounded-[28px] bg-adm-danger-dark px-4 text-base font-medium tracking-[-0.32px] text-dak-heading"
            >
              <Image src="/icons/delete.svg" alt="" width={18} height={18} />
              Delete User
            </button>
          </>
        }
      />

      <div className="flex items-start gap-[11px]">
        <Image src={user.avatar} alt="" width={60} height={60} className="size-[60px] shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-lg font-semibold tracking-[-0.2px] text-dak-heading">{user.name}</p>
          <p className="text-sm font-medium leading-4 tracking-[0.28px] text-dak-body">{user.email}</p>
          <span className="w-fit">
            <StatusBadge label={status} tone={accountStatusTone(status)} />
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
        <DetailCard title="Account Details" className="w-full max-w-[760px]">
          <DetailRow label="Username">{user.username}</DetailRow>
          <DetailRow label="Phone">{user.phone}</DetailRow>
          <DetailRow label="Country">{user.country}</DetailRow>
          <DetailRow label="City">{user.city}</DetailRow>
          <DetailRow label="Account type">{user.type}</DetailRow>
          <DetailRow label="Joined">{user.joined}</DetailRow>
          <DetailRow label="Profile visibility">{user.visibility}</DetailRow>
        </DetailCard>
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
            <ul className="flex flex-col gap-8 pt-8">
              {userWorkspaces.map((w, i) => (
                <li key={i} className={`grid ${wsCols} items-center gap-4 text-sm font-medium leading-4 tracking-[0.28px] text-dak-body`}>
                  <span className="truncate text-base font-normal tracking-[-0.2px] text-dak-heading">{w.name}</span>
                  <span>{w.role}</span>
                  <span className="text-center text-dak-heading">{w.members}</span>
                  <span className="text-center text-dak-heading">{w.canvases}</span>
                  <span>{w.visibility}</span>
                  <span className="text-right">{w.updated}</span>
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
            <ul className="flex flex-col gap-6 pt-6">
              {userClassrooms.map((c, i) => (
                <li key={i} className={`grid ${crCols} items-center gap-4 text-sm font-medium leading-4 tracking-[0.28px] text-dak-body`}>
                  <span className="truncate text-base font-normal tracking-[-0.2px] text-dak-heading">{c.name}</span>
                  <span>{c.role}</span>
                  <span className="text-dak-heading">{c.progress}</span>
                  <span className="flex justify-end">
                    <StatusBadge label={c.status} tone={c.status === "Active" ? "success" : "neutral"} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TableCard>
      )}

      {action && (
        <ActionModal
          {...moderationActions[action]}
          onClose={() => setAction(null)}
          onConfirm={() => {
            const outcome = outcomes[action];
            setAction(null);
            if (outcome.status) setStatus(outcome.status);
            setToast({ title: outcome.toast, tone: outcome.tone });
            if (action === "delete") setTimeout(() => router.push("/users"), 1500);
          }}
        />
      )}
      {toast && <Toast title={toast.title} tone={toast.tone} onClose={closeToast} />}
    </div>
  );
}
