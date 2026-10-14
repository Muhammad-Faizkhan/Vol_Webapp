"use client";

import type { ReactNode } from "react";
import { ApiProvider } from "@vol/api-client/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { api } from "@/lib/api";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApiProvider api={api}>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </ApiProvider>
  );
}
