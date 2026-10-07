"use client";

import Image from "next/image";
import { useEffect } from "react";

export function SignOutModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-title"
        onClick={(e) => e.stopPropagation()}
        className="relative mt-[50px] flex w-full max-w-[325px] flex-col items-center gap-5 rounded-[30px] bg-[#4d4955] px-[30px] pb-[30px] backdrop-blur-[10px]"
      >
        <Image
          src="/illustrations/signout-glow.svg"
          alt=""
          width={325}
          height={256}
          className="pointer-events-none absolute bottom-0 left-0 h-full w-full rounded-[30px]"
        />
        <div className="relative -mt-[50px] flex size-[100px] items-center justify-center rounded-full bg-dak-surface pl-2.5 pr-[15px]">
          <Image src="/icons/logout-lg.svg" alt="" width={46} height={46} />
        </div>
        <div className="relative flex flex-col items-center gap-4 text-center">
          <h2 id="signout-title" className="text-[22px] font-semibold text-dak-heading">
            Sign Out
          </h2>
          <p className="w-[245px] text-base text-dak-body">Are you sure you want to logout of your account?</p>
        </div>
        <div className="relative flex w-full max-w-[261px] gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[54px] flex-1 rounded-full bg-white/70 px-4 font-urbanist text-base font-medium text-dak-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[54px] flex-1 rounded-full bg-dak-surface px-4 font-urbanist text-base font-medium"
          >
            <span className="bg-gradient-to-b from-white to-[#999] bg-clip-text text-transparent">Yes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
