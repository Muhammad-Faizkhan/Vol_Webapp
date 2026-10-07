"use client";

import Image from "next/image";
import { useEffect } from "react";

const tones = {
  warning: "border-adm-warning bg-[#2a2306] text-adm-warning",
  danger: "border-adm-danger bg-[#2a0d0e] text-adm-danger",
  info: "border-adm-blue bg-[#0d1a2f] text-adm-blue",
  success: "border-adm-success bg-[#0a2312] text-adm-success",
};

export type ToastTone = keyof typeof tones;

// Figma node 789:4595: bottom-right confirmation after a moderation action, with a round close
// button overlapping its top-left corner. The tinted fills are the Figma 15% tones flattened
// onto the black page so the toast stays opaque over content.
export function Toast({
  title,
  message = "Action recorded in the audit log.",
  tone,
  onClose,
}: {
  title: string;
  message?: string;
  tone: ToastTone;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-[11px] rounded-2xl border p-6 sm:right-[50px] ${tones[tone]}`}
    >
      <span className="size-6 shrink-0 bg-current [mask:url(/icons/check-circle.svg)_center/contain_no-repeat]" />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-lg font-semibold leading-8 text-dak-heading">{title}</p>
        <p className="text-sm leading-5 text-dak-body">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="absolute -left-1 -top-2.5 rounded-[30px] bg-dak-muted p-2"
      >
        <Image src="/icons/close-x.svg" alt="" width={14} height={14} />
      </button>
    </div>
  );
}
