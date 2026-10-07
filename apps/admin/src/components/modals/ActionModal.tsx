"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

export type ActionModalProps = {
  title: string;
  description: string;
  confirmLabel: string;
  /** Tailwind classes for the confirm button's fill, e.g. "bg-adm-warning". */
  confirmClassName: string;
  /** When set, the admin must type this word before confirming (Figma's ban/delete modals). */
  confirmWord?: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
};

// Shared shell for every moderation action (suspend, ban, delete, warn, dismiss). Each one
// records a reason in the audit log, per Figma's "Composer Modal Container" frames.
export function ActionModal({
  title,
  description,
  confirmLabel,
  confirmClassName,
  confirmWord,
  onConfirm,
  onClose,
}: ActionModalProps) {
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");
  const id = useId();
  const canConfirm = reason.trim().length > 0 && (!confirmWord || typed.trim() === confirmWord);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (canConfirm) onConfirm(reason.trim());
        }}
        className="flex max-h-[90dvh] w-full max-w-[768px] flex-col overflow-hidden rounded-2xl border border-[#c6c6cd] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center justify-between gap-4 bg-dak-border px-6 py-5">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 id={`${id}-title`} className="text-xl font-semibold leading-8 text-dak-heading sm:text-2xl">
              {title}
            </h2>
            <p className="text-sm leading-5 text-dak-body">{description}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="shrink-0 rounded-xl p-2">
            <Image src="/icons/close-x.svg" alt="" width={14} height={14} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto border border-dak-border/40 bg-dak-surface px-[25px] pb-[25px] pt-[41px]">
          <label className="flex flex-col gap-2 pb-1.5">
            <span className="text-sm font-medium leading-4 tracking-[0.28px] text-dak-body">Reason (recorded in audit log)</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Type here..."
              autoFocus
              className="h-[121px] w-full resize-none rounded-xl border border-dak-body bg-transparent px-[17px] pt-[17px] text-base leading-6 text-dak-heading placeholder:text-dak-muted focus:border-dak-cta focus:outline-none"
            />
          </label>

          {confirmWord && (
            <label className="flex flex-col gap-2 pb-1.5">
              <span className="text-sm font-medium leading-4 tracking-[0.28px] text-dak-body">
                Type <span className="text-adm-danger">{confirmWord}</span> to continue
              </span>
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type here..."
                className="h-14 w-full rounded-xl border border-dak-body bg-transparent px-[17px] text-base text-dak-heading placeholder:text-dak-muted focus:border-dak-cta focus:outline-none"
              />
            </label>
          )}
        </div>

        <div className="flex min-h-[121px] items-center justify-end gap-4 bg-dak-border px-6 py-4 sm:gap-6">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full max-w-40 rounded-2xl border border-dak-heading font-heading text-sm font-medium tracking-[0.28px] text-white shadow-[0px_8px_12px_0px_rgba(148,54,251,0.4)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canConfirm}
            className={`h-12 w-full max-w-[166px] rounded-2xl font-heading text-sm font-medium tracking-[0.28px] text-dak-heading transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${confirmClassName}`}
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
