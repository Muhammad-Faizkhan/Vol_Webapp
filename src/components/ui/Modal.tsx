import type { ReactNode } from "react";

export function Modal({
  children,
  maxWidth = 768,
}: {
  children: ReactNode;
  maxWidth?: number;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(58,58,58,0.69)] p-4">
      <div
        className="max-h-[90dvh] w-full overflow-y-auto rounded-2xl border border-light-border bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] dark:border-dak-border dark:bg-dak-surface"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
