"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import { errorMessage, timeAgo, type WorkspaceDetail } from "@vol/api-client";
import { useApiQuery, useAuth, useInvalidate } from "@vol/api-client/react";
import { CreateCanvasButton } from "@/components/canvas/CreateCanvasButton";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";
import { plural } from "@/lib/format";

const tabs = [
  { href: "canvases", label: "Canvases" },
  { href: "files", label: "Files" },
  { href: "members", label: "Members & Roles" },
];

export default function WorkspaceDetailLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const { user } = useAuth();
  const { data: ws, error, mutate } = useApiQuery<WorkspaceDetail>(`/workspaces/${params.id}`);
  const [menuOpen, setMenuOpen] = useState(false);

  const canEdit = ws?.myRole && ws.myRole !== "VIEWER";
  const isAdmin = ws?.myRole === "OWNER" || ws?.myRole === "ADMIN";

  async function leaveOrDelete() {
    if (!ws) return;
    const owner = ws.myRole === "OWNER";
    const ok = window.confirm(owner ? `Delete "${ws.name}" and all its canvases? This can't be undone.` : `Leave "${ws.name}"?`);
    if (!ok) return;
    try {
      if (owner) await api.del(`/workspaces/${ws.id}`);
      else await api.del(`/workspaces/${ws.id}/members/${user!.id}`);
      await invalidate("/workspaces", "/users/me/stats", "/canvases");
      toast(owner ? "Workspace deleted" : "You left the workspace");
      router.push("/workspaces");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  if (error) return <ErrorState error={error} onRetry={() => mutate()} />;

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <Link href="/workspaces" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
          <Image
            src="/icons/arrow-narrow-right.svg"
            alt=""
            width={20}
            height={20}
            className="-scale-y-100 rotate-180 dark:invert"
          />
          Back
        </Link>
        <p className="pt-2 text-lg text-auth-navy dark:text-dak-body">Workspaces</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-auth-navy sm:size-20 dark:bg-dak-cta">
            {ws?.imageUrl ? <UserImage src={ws.imageUrl} /> : <Image src="/illustrations/auth-placeholder.svg" alt="" width={24} height={24} />}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className="truncate text-2xl font-bold tracking-[-0.32px] text-auth-navy sm:text-[32px] dark:text-dak-heading">
              {ws?.name ?? " "}
            </h1>
            <p className="text-base text-auth-slate dark:text-dak-body">
              {ws
                ? [
                    plural(ws.canvasCount, "canvas", "canvases"),
                    plural(ws.memberCount, "member"),
                    ws.visibility === "PUBLIC" ? "public to explore" : "private to members",
                    `last activity ${timeAgo(ws.lastActivityAt)}`,
                  ].join(" · ")
                : " "}
            </p>
          </div>
        </div>
        <div className="relative flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          {canEdit && (
            <CreateCanvasButton
              workspaceId={params.id}
              className="flex h-14 items-center justify-center gap-4 rounded-xl border border-app-dark-surface bg-app-dark-surface px-[17px] text-base text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
            >
              <Image src="/icons/new-canvas.svg" alt="" width={12} height={15} />
              Create Canvas
            </CreateCanvasButton>
          )}
          {isAdmin && (
            <Link
              href={`/workspaces/${params.id}/invite`}
              className="flex h-14 items-center justify-center gap-4 rounded-xl bg-dak-cta px-4 text-base text-white"
            >
              <Image src="/icons/plus.svg" alt="" width={24} height={24} />
              Invite Members
            </Link>
          )}
          {ws?.myRole && (
            <>
              <button
                type="button"
                aria-label="Workspace options"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-14 items-center justify-center rounded-xl border border-light-border px-4 text-xl text-auth-navy dark:border-dak-border dark:text-dak-heading"
              >
                ⋯
              </button>
              {menuOpen && (
                <>
                  <button type="button" aria-label="Close menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-light-border bg-white shadow-lg dark:border-dak-border dark:bg-dak-surface">
                    <button
                      type="button"
                      onClick={leaveOrDelete}
                      className="flex min-h-11 w-full items-center px-4 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      {ws.myRole === "OWNER" ? "Delete workspace" : "Leave workspace"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex gap-8 overflow-x-auto border-b border-light-border dark:border-dak-border">
        {tabs.map((tab) => {
          const href = `/workspaces/${params.id}/${tab.href}`;
          const active = pathname === href;
          return (
            <Link
              key={tab.href}
              href={href}
              className={`shrink-0 whitespace-nowrap pb-3 text-lg font-medium ${
                active
                  ? "border-b-4 border-auth-navy text-auth-navy dark:border-dak-cta dark:text-dak-heading"
                  : "text-[#929292] dark:text-dak-muted"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
