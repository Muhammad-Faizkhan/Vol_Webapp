"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const tabs = [
  { href: "canvases", label: "Canvases" },
  { href: "files", label: "Files" },
  { href: "members", label: "Members & Roles" },
];

export default function WorkspaceDetailLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();

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
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-auth-navy sm:size-20 dark:bg-dak-cta">
            <Image src="/illustrations/auth-placeholder.svg" alt="" width={24} height={24} />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy sm:text-[32px] dark:text-dak-heading">
              Lorem Ipsum Workspace
            </h1>
            <p className="text-base text-auth-slate dark:text-dak-body">
              8 canvases · 5 members · shared with the customer · last activity 12 minutes ago
            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <Link
            href="/canvas/1"
            className="flex h-14 items-center justify-center gap-4 rounded-xl border border-app-dark-surface bg-app-dark-surface px-[17px] text-base text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
          >
            <Image src="/icons/new-canvas.svg" alt="" width={12} height={15} />
            Create Canvas
          </Link>
          <Link
            href={`/workspaces/${params.id}/invite`}
            className="flex h-14 items-center justify-center gap-4 rounded-xl bg-dak-cta px-4 text-base text-white"
          >
            <Image src="/icons/plus.svg" alt="" width={24} height={24} />
            Invite Members
          </Link>
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
