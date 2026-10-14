import { RequireAuth } from "@/components/auth/RequireAuth";

export default function CanvasLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
