"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const PERSONA_STORAGE_KEY = "vol-persona";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

function subscribeToPersona(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getPersonaSnapshot(): "individual" | "business" {
  try {
    return localStorage.getItem(PERSONA_STORAGE_KEY) === "business" ? "business" : "individual";
  } catch {
    return "individual";
  }
}

function getPersonaServerSnapshot(): "individual" | "business" {
  // The server has no access to localStorage, so it always renders "individual". Reading the
  // real value only through useSyncExternalStore (rather than a useState lazy initializer or a
  // plain useEffect) lets React reconcile the client's first render against this exact server
  // snapshot, then swap to the live snapshot in a safe, non-hydration-mismatching update — the
  // idiomatic fix for the Home link href mismatch reported in HANDOFF.md.
  return "individual";
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const persona = useSyncExternalStore(subscribeToPersona, getPersonaSnapshot, getPersonaServerSnapshot);

  const individualNavItems = [
    { href: "/home", label: "Home", icon: "home" },
    { href: "/discover", label: "Feed", icon: "feed" },
    { href: "/workspaces", label: "Workspaces", icon: "workspaces" },
    { href: "/explore", label: "Explore", icon: "explore" },
    { href: "/classrooms", label: "Classrooms", icon: "classrooms" },
    { href: "/business/dashboard", label: "Products", icon: "products" },
    { href: "/profile", label: "Profile", icon: "profile" },
  ];

  // The business persona's sidebar has fewer items than the individual one — no Feed or
  // Explore — and Products/Classrooms are in swapped order, per Figma nodes 562:31634 and
  // 562:32050 (both business-persona screens, confirmed consistent across both).
  const businessNavItems = [
    { href: "/business/home", label: "Home", icon: "home" },
    { href: "/workspaces", label: "Workspaces", icon: "workspaces" },
    { href: "/business/dashboard", label: "Products", icon: "products" },
    { href: "/classrooms", label: "Classrooms", icon: "classrooms" },
    { href: "/profile", label: "Profile", icon: "profile" },
  ];

  const navItems = persona === "business" ? businessNavItems : individualNavItems;

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] max-w-[85vw] shrink-0 flex-col bg-dak-cta transition-transform duration-200 ease-out dark:bg-dak-bg lg:left-[var(--app-wide-gutter)] lg:w-[var(--app-sidebar-w)] lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-[clamp(1rem,4dvh,2rem)] lg:px-8 lg:pt-[clamp(1.25rem,4dvh,2.5rem)]">
          <div className="relative size-[clamp(48px,8dvh,80px)]">
            <Image src="/illustrations/vol-logo.png" alt="VÔL" fill className="object-contain" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-11 items-center justify-center rounded-full text-white lg:hidden"
          >
            <span className="relative block size-5">
              <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rotate-45 bg-white" />
              <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-white" />
            </span>
          </button>
        </div>

        <nav className="mt-[clamp(1rem,3dvh,2rem)] flex flex-1 flex-col gap-1 overflow-y-auto px-4 lg:px-5">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-4 py-[clamp(0.375rem,1.2dvh,0.75rem)] text-white transition-colors ${
                  active ? "bg-app-sidebar-active dark:bg-dak-cta" : "bg-transparent"
                }`}
              >
                <Image src={`/icons/nav/${item.icon}.svg`} alt="" width={24} height={24} className="shrink-0" />
                <span className="text-base font-medium tracking-[0.28px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 flex-col gap-1 px-4 pb-[clamp(0.5rem,2dvh,1rem)] lg:px-5">
          <Link
            href="/settings"
            onClick={onClose}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-[clamp(0.375rem,1.2dvh,0.75rem)] text-white transition-colors ${
              pathname === "/settings" ? "bg-app-sidebar-active dark:bg-dak-cta" : "bg-transparent"
            }`}
          >
            <Image src="/icons/nav/settings.svg" alt="" width={24} height={24} className="shrink-0" />
            <span className="text-base font-medium tracking-[0.28px]">Settings</span>
          </Link>
        </div>

        <Link
          href="/"
          onClick={onClose}
          className="mx-4 mb-[clamp(0.75rem,3dvh,1.5rem)] flex min-h-11 shrink-0 items-center gap-3 rounded-xl bg-black/20 px-4 py-[clamp(0.375rem,1.2dvh,0.75rem)] text-white dark:bg-white/10 lg:mx-5"
        >
          <Image src="/icons/nav/logout.svg" alt="" width={24} height={24} />
          <span className="text-base font-medium tracking-[0.28px]">Logout</span>
        </Link>
      </div>
    </>
  );
}
