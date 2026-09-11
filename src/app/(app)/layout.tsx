"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-app-bg dark:bg-dak-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />
      <main className="min-h-[calc(100dvh-80px)] px-4 pb-8 pt-24 sm:px-6 lg:ml-[400px] lg:min-h-[calc(100dvh-100px)] lg:px-[50px] lg:pb-10 lg:pt-[clamp(112px,14dvh,140px)]">
        {children}
      </main>
    </div>
  );
}
