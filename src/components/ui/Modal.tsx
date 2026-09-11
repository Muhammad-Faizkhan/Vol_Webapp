import type { ReactNode } from "react";

export function Modal({
  children,
  maxWidth = 768,
}: {
  children: ReactNode;
  maxWidth?: number;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-auth-navy/[0.73] p-4">
      <div
        className="max-h-[90dvh] w-full overflow-y-auto rounded-lg border border-light-border bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] dark:border-dak-border dark:bg-dak-surface"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
