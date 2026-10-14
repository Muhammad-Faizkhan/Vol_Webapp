"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { errorMessage, type Session } from "@vol/api-client";
import { useAuth } from "@vol/api-client/react";
import { CodeInput } from "@/components/auth/CodeInput";
import { api } from "@/lib/api";

export function VerifyForm({ email, next }: { email: string; next: string }) {
  const router = useRouter();
  const { setSession } = useAuth();
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (code.length !== 6) return;
        setError(null);
        setVerifying(true);
        try {
          setSession(await api.post<Session>("/auth/admin/verify", { email, code }));
          router.push(next);
        } catch (err) {
          setError(errorMessage(err));
          setVerifying(false);
        }
      }}
      className="relative flex min-h-[571px] w-full flex-col justify-between gap-8 overflow-hidden rounded-xl border border-dak-cta bg-dak-surface px-[clamp(12px,3.7%,21px)] py-[41px] shadow-[0px_0px_10px_0px_rgba(148,54,251,0.5)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-dak-cta" />

      <div className="flex flex-col items-center">
        <div className="pb-6">
          <div className="flex size-16 items-center justify-center rounded-xl border border-[rgba(198,198,205,0.2)] bg-dak-cta drop-shadow-[0px_4px_8px_rgba(148,54,251,0.5)]">
            <Image src="/icons/mail-badge.png" alt="" width={40} height={40} />
          </div>
        </div>
        <h2 className="pb-3 text-center text-[clamp(26px,calc(2.4*var(--vw)),32px)] font-semibold leading-10 tracking-[-0.32px] text-dak-heading">Check your inbox</h2>
        <p className="max-w-[428px] px-2 text-center text-base leading-6 text-dak-body">
          If <span className="font-medium">{email}</span> belongs to an admin account, we&apos;ve sent it a 6-digit verification code.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <CodeInput value={code} onChange={setCode} />
        {error && <p className="text-center text-sm font-medium text-adm-danger">{error}</p>}
        <div className="pt-4">
          <button
            type="submit"
            disabled={code.length !== 6 || verifying}
            className="h-14 w-full rounded-2xl bg-dak-cta text-base font-medium leading-4 tracking-[0.28px] text-white drop-shadow-[0px_8px_6px_rgba(148,54,251,0.4)] disabled:opacity-60"
          >
            {verifying ? "Verifying…" : "Verify Email"}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 border-t border-dak-border/40 pt-[25px]">
        <p className="text-sm leading-5 text-dak-body">{resent ? "A new code is on its way." : "Didn't receive the email?"}</p>
        <button
          type="button"
          onClick={async () => {
            setError(null);
            try {
              await api.post("/auth/admin/login", { email });
              setResent(true);
            } catch (err) {
              setError(errorMessage(err));
            }
          }}
          className="flex items-center gap-1 text-sm font-medium leading-4 tracking-[0.28px] text-dak-heading"
        >
          <Image src="/icons/refresh.svg" alt="" width={9} height={9} />
          Resend Email
        </button>
      </div>
    </form>
  );
}
