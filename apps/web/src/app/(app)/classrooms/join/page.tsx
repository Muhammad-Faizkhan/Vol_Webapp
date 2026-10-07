"use client";

import { useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import MyClassroomsPage from "../page";

const CODE_LENGTH = 6;

export default function JoinClassroomModalPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");
  const isComplete = digits.every((d) => d !== "");

  const setDigit = (index: number, value: string) => {
    const char = value.slice(-1).toUpperCase();
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "").slice(0, CODE_LENGTH).toUpperCase();
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleJoin = () => {
    if (!isComplete) return;
    router.push("/classrooms/1");
  };

  return (
    <>
      <MyClassroomsPage />
      <Modal maxWidth={531}>
        <div className="flex items-center justify-between bg-[#2b2b31] p-6">
          <h2 className="text-2xl font-medium text-white">Join a New Classroom</h2>
          <Link href="/classrooms" aria-label="Close">
            <Image src="/icons/close-x-white.svg" alt="" width={14} height={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-8 bg-gradient-to-b from-white to-[#f3e8ff] p-6 dark:from-dak-surface dark:to-dak-surface">
          <div className="flex flex-col gap-4">
            <label className="text-sm tracking-[0.28px] text-[#2b2b31] dark:text-dak-heading">
              Enter 6-digit classroom code
            </label>
            <div className="flex items-center justify-between gap-2">
              {digits.map((digit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={`h-14 w-12 rounded border bg-white text-center text-[32px] font-semibold uppercase tracking-[-0.32px] text-[#2b2b31] focus:outline-none dark:bg-dak-bg dark:text-dak-heading ${
                      digit ? "border-dak-cta text-[#020204] dark:text-dak-heading" : "border-[#2b2b31] dark:border-dak-border"
                    }`}
                  />
                  {i === 2 && <span className="text-base text-dak-cta">-</span>}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#2b2b31] dark:text-dak-body">
              Ask your instructor for the unique joining code.
            </p>
          </div>

          {isComplete && (
            <div className="relative flex items-start gap-4 overflow-hidden rounded-xl border border-[#cacaca] bg-[#020204] p-[17px]">
              <div className="absolute -right-10 -top-9 size-32 rounded-xl bg-[rgba(79,98,110,0.1)] blur-xl" />
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded bg-[rgba(230,230,230,0.3)]">
                <Image src="/icons/compass.svg" alt="" width={11} height={18} />
              </div>
              <div className="relative flex flex-1 flex-col gap-1">
                <span className="w-fit rounded-xl bg-[rgba(148,54,251,0.3)] px-2 py-1 text-xs font-semibold text-dak-cta">
                  Verified Class
                </span>
                <h3 className="text-2xl font-medium text-white">Advanced Architectural Substrates</h3>
                <div className="flex items-center gap-2 pt-1">
                  <Image src="/icons/instructor.svg" alt="" width={9} height={9} />
                  <span className="text-sm text-white">Instructor: Mark Williams</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 p-6">
          <Link href="/classrooms" className="rounded px-6 py-2.5 text-sm font-medium text-[#020204] dark:text-dak-heading">
            Cancel
          </Link>
          <button
            onClick={handleJoin}
            disabled={!isComplete}
            className="rounded border border-white/20 bg-dak-cta px-6 py-2.5 text-sm font-medium text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Join Classroom
          </button>
        </div>
      </Modal>
    </>
  );
}
