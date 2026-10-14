"use client";

import { useState } from "react";
import { timeAgo, type Activity } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";

export function ActivityPanel({ workspaceId }: { workspaceId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: activity } = useApiQuery<Activity[]>(`/workspaces/${workspaceId}/activity?limit=${expanded ? 50 : 3}`);
  const items = activity ?? [];

  return (
    <div className="overflow-hidden rounded-lg border border-light-border dark:border-dak-border">
      <div className="bg-app-dark-surface px-6 py-3 text-sm font-medium tracking-[0.28px] text-white">Workspace Activity</div>
      <div className="flex max-h-[480px] flex-col overflow-y-auto bg-white dark:bg-dak-surface">
        {activity && items.length === 0 && <p className="p-4 text-sm text-[#929292] dark:text-dak-muted">No activity yet.</p>}
        {items.map((item, i) => (
          <div key={item.id} className={`flex flex-col gap-2 p-4 ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-sm text-auth-navy dark:text-dak-heading">
                  {item.actor?.name ?? "Someone"} {item.message}
                </p>
                <span className="text-xs text-[#929292] dark:text-dak-muted">{timeAgo(item.createdAt)}</span>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="shrink-0 rounded-lg bg-app-dark-surface px-3 py-1.5 text-xs font-medium text-white"
              >
                {openId === item.id ? "Hide" : "See details"}
              </button>
            </div>
            {openId === item.id && (
              <p className="rounded-lg bg-[#f8f9ff] px-3 py-2 text-xs text-[#45464d] dark:bg-dak-bg dark:text-dak-body">
                {new Date(item.createdAt).toLocaleString()} · {item.actor ? `${item.actor.name}${item.actor.username ? ` (@${item.actor.username})` : ""}` : "System"}
              </p>
            )}
          </div>
        ))}
        {!expanded && items.length >= 3 && (
          <div className="p-4 pt-2">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="w-full rounded-2xl border border-light-border py-3 text-base font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading"
            >
              See Full Audit Trail
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
