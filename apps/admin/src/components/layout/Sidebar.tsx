"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/users", label: "User Management", icon: "users" },
  { href: "/cases", label: "Cases", icon: "cases" },
  { href: "/analytics", label: "Analytics", icon: "analytics" },
  { href: "/security", label: "Security Center", icon: "security" },
  { href: "/terms", label: "Terms & Conditions", icon: "terms" },
  { href: "/privacy", label: "Privacy Policies", icon: "privacy" },
  { href: "/settings", label: "System Settings", icon: "settings" },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export function Sidebar({ open, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[300px] max-w-[85vw] flex-col border-r border-adm-sidebar-line bg-adm-sidebar shadow-[0px_64px_64px_-32px_rgba(148,54,251,0.5)] backdrop-blur-[80px] transition-transform duration-200 ease-out lg:w-[var(--adm-sidebar-w)] lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 justify-center px-6 pt-[clamp(1rem,7.4dvh,5rem)] lg:px-10">
          <div className="relative h-[clamp(72px,12.6dvh,136px)] w-[clamp(48px,8.3dvh,90px)]">
            <Image src="/brand/admin-logo.png" alt="VÔL" fill sizes="90px" className="object-cover" priority />
          </div>
        </div>

        <nav className="mt-[clamp(1rem,4dvh,2.75rem)] flex flex-1 flex-col gap-[clamp(0.25rem,2.2dvh,1.5rem)] overflow-y-auto px-4 lg:px-10">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[clamp(44px,5.2dvh,56px)] shrink-0 items-center gap-3 rounded-lg border px-4 text-white transition-colors ${
                  active
                    ? "border-dak-cta bg-[linear-gradient(102.88deg,#9436fb_0.57%,#582095_100%)]"
                    : "border-transparent hover:bg-white/5"
                }`}
              >
                <Image src={`/icons/nav/${item.icon}.svg`} alt="" width={24} height={24} className="shrink-0" />
                <span className="truncate text-[clamp(16px,1.05vw,20px)] font-medium leading-6 tracking-[0.28px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 px-4 pb-[clamp(1rem,4.6dvh,3.125rem)] pt-4 lg:px-10">
          <button
            type="button"
            onClick={onLogout}
            className="flex h-14 w-full items-center gap-2.5 rounded-xl border-[0.5px] border-adm-logout-border bg-adm-logout px-3.5 text-left"
          >
            <Image src="/icons/nav/logout.svg" alt="" width={24} height={24} />
            <span className="text-[clamp(16px,1.05vw,20px)] font-medium leading-4 tracking-[0.28px] text-dak-heading">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
