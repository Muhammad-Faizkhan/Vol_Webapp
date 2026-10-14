"use client";

import Link from "next/link";
import { titleCase, type WorkspaceMember, type WorkspaceRole } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { Avatar } from "@/components/ui/UserImage";

export function MembersPanel({ workspaceId, myRole, showManageRoles = true }: { workspaceId: string; myRole?: WorkspaceRole | null; showManageRoles?: boolean }) {
  const { data: members } = useApiQuery<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`);
  const canManage = myRole === "OWNER" || myRole === "ADMIN";

  return (
    <div className="overflow-hidden rounded-lg border border-light-border dark:border-dak-border">
      <div className="bg-app-dark-surface px-6 py-3 text-sm font-medium tracking-[0.28px] text-white">
        Members ({members?.length ?? "…"})
      </div>
      <div className="flex flex-col bg-white dark:bg-dak-surface">
        {members?.slice(0, 6).map((member, i) => (
          <div
            key={member.id}
            className={`flex items-center gap-3 p-4 ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}
          >
            <Avatar src={member.avatarUrl} name={member.name} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{member.name}</span>
              <span className="truncate text-sm text-[#929292] dark:text-dak-muted">{member.isYou ? "You" : (member.specialty ?? titleCase(member.accountType))}</span>
            </div>
            {member.role === "ADMIN" || member.role === "OWNER" ? (
              <span className="rounded-lg bg-app-dark-surface px-3 py-1.5 text-sm text-white">{titleCase(member.role)}</span>
            ) : (
              <span className="rounded-lg border border-light-border px-3 py-1.5 text-sm text-auth-navy dark:border-dak-border dark:text-dak-heading">
                {titleCase(member.role)}
              </span>
            )}
          </div>
        ))}
        {members && members.length > 6 && (
          <Link href={`/workspaces/${workspaceId}/members`} className="border-t border-light-border p-4 text-sm font-medium text-dak-cta dark:border-dak-border">
            +{members.length - 6} more
          </Link>
        )}
        {showManageRoles && canManage && (
          <div className="p-4 pt-2">
            <Link
              href={`/workspaces/${workspaceId}/members`}
              className="block w-full rounded-2xl bg-dak-cta py-3 text-center text-base font-medium tracking-[0.28px] text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]"
            >
              Manage Roles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
