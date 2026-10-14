"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessage, timeAgo, type Notification } from "@vol/api-client";
import { useInvalidate } from "@vol/api-client/react";
import { Avatar } from "@/components/ui/UserImage";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

const darkPill =
  "flex h-8 shrink-0 items-center justify-center rounded-lg bg-[#2b2b31] px-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-dak-cta";
const outlinePill =
  "flex h-8 shrink-0 items-center justify-center rounded-lg border border-[#020204] px-2 text-sm font-medium text-[#020204] disabled:opacity-60 dark:border-dak-border dark:text-dak-heading";

/** Where a notification leads when it has no inline actions. */
function linkFor(n: Notification): { href: string; label: string } | null {
  const d = n.data ?? {};
  switch (n.type) {
    case "WORKSPACE_JOIN_ACCEPTED":
      return d.workspaceId ? { href: `/workspaces/${d.workspaceId}`, label: "Open Workspace" } : null;
    case "CLASSROOM_ENROLLED":
      return d.classroomId ? { href: `/classrooms/${d.classroomId}`, label: "Open Classroom" } : null;
    case "POST_COMMENT":
    case "POST_LIKE":
      if (d.classroomId) return { href: `/classrooms/${d.classroomId}?tab=discussions`, label: "View Discussion" };
      return d.postId ? { href: `/discover/post/${d.postId}`, label: "View Post" } : null;
    case "NEW_FOLLOWER":
      return d.userId ? { href: `/profile/${d.userId}`, label: "View Profile" } : null;
    case "WORKSPACE_INVITE":
    case "WORKSPACE_JOIN_REQUEST":
      return n.resolved && d.workspaceId ? { href: `/workspaces/${d.workspaceId}`, label: "Open Workspace" } : null;
    default:
      return null;
  }
}

export function NotificationItem({ n, variant = "card", onDone }: { n: Notification; variant?: "card" | "compact"; onDone?: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const [busy, setBusy] = useState(false);

  const actionable = !n.resolved && (n.type === "WORKSPACE_INVITE" || n.type === "WORKSPACE_JOIN_REQUEST");
  const link = linkFor(n);

  async function answer(accept: boolean) {
    setBusy(true);
    try {
      const d = n.data ?? {};
      if (n.type === "WORKSPACE_INVITE") {
        await api.post(`/invites/${d.inviteId}/${accept ? "accept" : "decline"}`);
        toast(accept ? "You joined the workspace" : "Invitation declined");
        if (accept) router.push(`/workspaces/${d.workspaceId}`);
      } else {
        await api.post(`/join-requests/${d.requestId}/${accept ? "accept" : "decline"}`);
        toast(accept ? "Request accepted" : "Request declined");
      }
      await invalidate("/notifications", "/workspaces");
      onDone?.();
    } catch (err) {
      toast(errorMessage(err), "error");
      await invalidate("/notifications");
    } finally {
      setBusy(false);
    }
  }

  const compact = variant === "compact";
  return (
    <div
      className={
        compact
          ? `flex items-start gap-3 px-4 py-3 ${n.read ? "" : "bg-dak-cta/5"}`
          : "flex min-h-[120px] items-center gap-4 rounded-2xl border border-[rgba(43,43,49,0.4)] bg-white p-[17px] drop-shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface"
      }
    >
      <Avatar src={n.actor?.avatarUrl} name={n.actor?.name ?? "VÔL"} size={compact ? 36 : 40} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-body">
          {n.title} <span className="text-xs text-[#9c9c9c] dark:text-dak-muted">· {timeAgo(n.createdAt)}</span>
        </p>
        <p className="text-sm font-medium leading-5 text-[#020204] dark:text-dak-heading">{n.body}</p>
        {actionable ? (
          <div className="flex gap-2 pt-1">
            <button type="button" disabled={busy} onClick={() => answer(true)} className={`${darkPill} w-20`}>
              Accept
            </button>
            <button type="button" disabled={busy} onClick={() => answer(false)} className={`${outlinePill} w-20`}>
              Decline
            </button>
          </div>
        ) : (
          link && (
            <div className="flex pt-1">
              <Link href={link.href} onClick={onDone} className={`${darkPill} min-w-[132px] px-3`}>
                {link.label}
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}
