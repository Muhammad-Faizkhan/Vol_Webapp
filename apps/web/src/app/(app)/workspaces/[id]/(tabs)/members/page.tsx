"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import {
  errorMessage,
  timeAgo,
  titleCase,
  type JoinRequest,
  type PendingInvite,
  type Visibility,
  type WorkspaceDetail,
  type WorkspaceMember,
  type WorkspaceRole,
} from "@vol/api-client";
import { useApiQuery, useInvalidate } from "@vol/api-client/react";
import { useToast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

const ASSIGNABLE: WorkspaceRole[] = ["ADMIN", "COLLABORATOR", "VIEWER"];

export default function WorkspaceMembersPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const invalidate = useInvalidate();
  const { data: ws } = useApiQuery<WorkspaceDetail>(`/workspaces/${id}`);
  const isAdmin = ws?.myRole === "OWNER" || ws?.myRole === "ADMIN";
  const isOwner = ws?.myRole === "OWNER";
  const { data: members } = useApiQuery<WorkspaceMember[]>(`/workspaces/${id}/members`);
  const { data: requests } = useApiQuery<JoinRequest[]>(isAdmin ? `/workspaces/${id}/join-requests` : null);
  const { data: invites } = useApiQuery<PendingInvite[]>(isAdmin ? `/workspaces/${id}/invites` : null);

  const refresh = () => invalidate(`/workspaces/${id}`, "/notifications");

  async function run(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      await refresh();
      toast(success);
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  // Only the owner can promote to or demote from admin; admins manage collaborators and viewers.
  const canEditMember = (m: WorkspaceMember) => isAdmin && m.role !== "OWNER" && !m.isYou && (isOwner || m.role !== "ADMIN");

  return (
    <div className="flex w-full flex-col gap-8">
      {isAdmin && !!requests?.length && (
        <div className="w-full overflow-hidden rounded-2xl border border-dak-cta">
          <div className="bg-dak-cta px-6 py-3 text-base text-white">Join requests ({requests.length})</div>
          <div className="flex flex-col bg-white dark:bg-dak-surface">
            {requests.map((r, i) => (
              <div key={r.id} className={`flex flex-wrap items-center gap-3 px-6 py-4 ${i ? "border-t border-light-border dark:border-dak-border" : ""}`}>
                <Avatar src={r.user.avatarUrl} name={r.user.name} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{r.user.name}</span>
                  <span className="text-xs text-[#929292] dark:text-dak-muted">Asked {timeAgo(r.createdAt)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => run(() => api.post(`/join-requests/${r.id}/accept`), `${r.user.name} added`)}
                  className="rounded-lg bg-app-dark-surface px-4 py-2 text-sm text-white"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => run(() => api.post(`/join-requests/${r.id}/decline`), "Request declined")}
                  className="rounded-lg border border-light-border px-4 py-2 text-sm text-auth-navy dark:border-dak-border dark:text-dak-heading"
                >
                  Decline
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full overflow-hidden rounded-2xl border border-light-border dark:border-dak-border">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="flex bg-app-dark-surface px-6 py-4 text-base text-white">
              <span className="w-[300px] shrink-0 whitespace-nowrap">Member</span>
              <span className="w-[260px] shrink-0 whitespace-nowrap">Profile Type</span>
              <span className="whitespace-nowrap">Action</span>
            </div>
            <div className="flex flex-col bg-white dark:bg-dak-surface">
              {members?.map((member, i) => (
                <div key={member.id} className={`flex items-center px-6 py-4 ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}>
                  <div className="flex w-[300px] shrink-0 items-center gap-3">
                    <Avatar src={member.avatarUrl} name={member.name} />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{member.name}</span>
                      <span className="truncate text-sm text-[#929292] dark:text-dak-muted">{member.isYou ? "You" : (member.email ?? "")}</span>
                    </div>
                  </div>
                  <span className="w-[260px] shrink-0 truncate text-base text-[#929292] dark:text-dak-muted">
                    {member.specialty ?? titleCase(member.accountType)}
                  </span>
                  <div className="flex items-center gap-2">
                    {canEditMember(member) ? (
                      <select
                        aria-label={`Role for ${member.name}`}
                        value={member.role}
                        onChange={(e) =>
                          run(() => api.patch(`/workspaces/${id}/members/${member.id}`, { role: e.target.value }), `${member.name} is now ${titleCase(e.target.value)}`)
                        }
                        className="rounded-lg border border-light-border bg-white px-3 py-2 text-sm text-auth-navy dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading"
                      >
                        {ASSIGNABLE.filter((r) => isOwner || r !== "ADMIN").map((r) => (
                          <option key={r} value={r}>
                            {titleCase(r)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm ${
                          member.role === "ADMIN" || member.role === "OWNER"
                            ? "bg-app-dark-surface text-white"
                            : "border border-light-border text-[#929292] dark:border-dak-border dark:text-dak-heading"
                        }`}
                      >
                        {titleCase(member.role)}
                      </span>
                    )}
                    {canEditMember(member) && (
                      <button
                        type="button"
                        aria-label={`Remove ${member.name}`}
                        onClick={() => {
                          if (window.confirm(`Remove ${member.name} from this workspace?`)) {
                            void run(() => api.del(`/workspaces/${id}/members/${member.id}`), `${member.name} removed`);
                          }
                        }}
                        className="rounded-lg px-2 py-2 text-sm text-[#929292] hover:bg-red-50 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {invites?.map((invite) => (
                <div key={invite.id} className="flex items-center border-t border-light-border px-6 py-4 dark:border-dak-border">
                  <div className="flex w-[300px] shrink-0 items-center gap-3">
                    <Avatar src={null} name={invite.email} />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{invite.email}</span>
                      <span className="text-sm text-[#929292] dark:text-dak-muted">Invited {timeAgo(invite.createdAt)}</span>
                    </div>
                  </div>
                  <span className="w-[260px] shrink-0 text-base italic text-[#929292] dark:text-dak-muted">Pending · {titleCase(invite.role)}</span>
                  <button
                    type="button"
                    onClick={() => run(() => api.del(`/workspaces/${id}/invites/${invite.id}`), "Invite cancelled")}
                    className="rounded-lg border border-light-border px-4 py-2 text-sm text-[#929292] dark:border-dak-border dark:text-dak-heading"
                  >
                    Cancel invite
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[463px] rounded-lg border border-light-border bg-white p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-dak-border dark:bg-dak-surface">
        <h2 className="mb-6 text-2xl font-semibold text-auth-navy dark:text-dak-heading">Visibility</h2>
        <fieldset disabled={!isAdmin} className="flex flex-col gap-6 disabled:opacity-70">
          <VisibilityOption
            value="PUBLIC"
            current={ws?.visibility}
            icon={<Image src="/icons/globe.svg" alt="" width={17} height={17} className="invert dark:invert-0" />}
            title="Public to explore"
            body="Your profile, projects, and credentials will be visible to all platform users."
            onPick={(v) => run(() => api.patch(`/workspaces/${id}`, { visibility: v }), "Workspace is now public")}
          />
          <VisibilityOption
            value="PRIVATE"
            current={ws?.visibility}
            icon={<Image src="/icons/lock-small.svg" alt="" width={14} height={18} className="dark:brightness-0 dark:invert" />}
            title="Private to members"
            body="You can only collaborate via direct invites from existing workspaces or verified connections."
            onPick={(v) => run(() => api.patch(`/workspaces/${id}`, { visibility: v }), "Workspace is now private")}
          />
        </fieldset>
        {!isAdmin && <p className="mt-4 text-sm text-[#929292] dark:text-dak-muted">Only workspace admins can change visibility.</p>}
      </div>
    </div>
  );
}

function VisibilityOption({
  value,
  current,
  icon,
  title,
  body,
  onPick,
}: {
  value: Visibility;
  current?: Visibility;
  icon: React.ReactNode;
  title: string;
  body: string;
  onPick: (v: Visibility) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-light-border p-4 has-checked:border-auth-navy dark:border-dak-border dark:has-checked:border-dak-line">
      <input
        type="radio"
        name="workspace-visibility"
        checked={current === value}
        onChange={() => current !== value && onPick(value)}
        className="mt-2 size-5 shrink-0 accent-auth-navy dark:accent-dak-cta"
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-base font-medium tracking-[0.28px] text-auth-navy dark:text-dak-heading">{title}</span>
        </div>
        <p className="text-sm text-[#45464d] dark:text-dak-body">{body}</p>
      </div>
    </label>
  );
}
