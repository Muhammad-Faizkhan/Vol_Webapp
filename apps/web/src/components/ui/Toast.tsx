"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type Tone = "success" | "error";
type ToastItem = { id: number; message: string; tone: Tone };

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});

/** `const toast = useToast(); toast("Saved")` or `toast(message, "error")`. */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = useCallback((message: string, tone: Tone = "success") => {
    const id = ++nextId.current;
    setItems((all) => [...all.slice(-2), { id, message, tone }]);
    setTimeout(() => setItems((all) => all.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className={`pointer-events-auto w-full max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              t.tone === "error" ? "bg-red-600" : "bg-[#020204] dark:bg-dak-cta"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
