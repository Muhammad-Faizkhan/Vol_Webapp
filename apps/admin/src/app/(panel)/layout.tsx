"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { SignOutModal } from "@/components/modals/SignOutModal";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  return (
    <div className="min-h-[calc(100*var(--vh))] w-full bg-dak-bg">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => {
          setSidebarOpen(false);
          setSignOutOpen(true);
        }}
      />
      <TopNav onMenuClick={() => setSidebarOpen(true)} />
      <main className="min-w-0 px-4 pb-10 pt-24 sm:px-6 lg:ml-[var(--adm-sidebar-w)] lg:pl-[50px] lg:pr-[51px] lg:pt-[140px]">
        {children}
      </main>
      {signOutOpen && <SignOutModal onClose={() => setSignOutOpen(false)} onConfirm={() => router.push("/login")} />}
    </div>
  );
}
