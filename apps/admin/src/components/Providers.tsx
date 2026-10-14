"use client";

import type { ReactNode } from "react";
import { ApiProvider } from "@vol/api-client/react";
import { api } from "@/lib/api";

export function Providers({ children }: { children: ReactNode }) {
  return <ApiProvider api={api}>{children}</ApiProvider>;
}
