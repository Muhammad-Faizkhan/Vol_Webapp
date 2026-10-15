"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { errorMessage, type Session } from "@vol/api-client";
import { useAuth } from "@vol/api-client/react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/OtpInput";
import { api, DEV_OTP_KEY, homeFor, RESET_TOKEN_KEY, safeNext } from "@/lib/api";

type Mode = "verify" | "login" | "reset";

const SUBMIT_LABEL: Record<Mode, string> = { verify: "Verify Email", login: "Verify & Log In", reset: "Continue" };

function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const email = searchParams.get("email") ?? "";
  const rawMode = searchParams.get("mode");
  const mode: Mode = rawMode === "login" || rawMode === "reset" ? rawMode : "verify";
  const next = safeNext(searchParams.get("next"));

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Temporary, until emails are delivered: the code the API sent back, shown on screen.
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DEV_OTP_KEY) ?? "null") as { email: string; code: string } | null;
      if (mode === "verify" && saved?.email === email) setDevCode(saved.code);
    } catch {
      // Nothing saved, or storage unavailable: the user waits for the email as usual.
    }
  }, [email, mode]);

  async function handleSubmit() {
    if (code.length < 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "reset") {
        const { resetToken } = await api.post<{ resetToken: string }>("/auth/forgot-password/verify", { email, code });
        // Kept out of the URL so it never lands in browser history.
        sessionStorage.setItem(RESET_TOKEN_KEY, resetToken);
        router.push("/reset-password");
        return;
      }
      const session = await api.post<Session>(mode === "login" ? "/auth/login/verify" : "/auth/verify-email", { email, code });
      sessionStorage.removeItem(DEV_OTP_KEY);
      setSession(session);
      router.push(next ?? homeFor(session.user));
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  async function resend() {
    setError(null);
    try {
      // A login code can only be re-sent by logging in again, which needs the password.
      if (mode === "login") return router.push("/login");
      const result = await api.post<{ devCode?: string }>(mode === "reset" ? "/auth/forgot-password" : "/auth/resend-verification", { email });
      if (result.devCode) {
        sessionStorage.setItem(DEV_OTP_KEY, JSON.stringify({ email, code: result.devCode }));
        setDevCode(result.devCode);
      }
      setResent(true);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  // Shared by signup, login (2FA) and forgot-password: "Back" retraces whichever flow led here.
  const persona = searchParams.get("persona");
  const signupHref = persona === "individual" || persona === "business" ? `/signup?persona=${persona}` : "/signup";
  const backHref = mode === "reset" ? "/forgot-password" : mode === "login" ? "/login" : signupHref;

  return (
    <AuthShell backHref={backHref}>
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[380px] flex-col items-center gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
          <div className="relative size-[clamp(40px,8dvh,100px)]">
            <Image src="/illustrations/vol-logo.png" alt="VÔL" fill className="object-contain" />
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <h1 className="w-full text-center text-2xl font-bold text-[#020204] dark:text-dak-heading sm:text-[clamp(1.25rem,4dvh,2rem)]">
              OTP Verification
            </h1>
            <p className="w-full text-center text-base font-medium leading-[23px] text-[#2b2b31] dark:text-dak-body">
              Enter your email below to login your account
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-[clamp(0.75rem,2.5dvh,2.5rem)] w-full rounded-lg border border-dak-cta bg-white/70 px-6 py-[clamp(1rem,3.5dvh,2.5625rem)] backdrop-blur-[5px] dark:bg-dak-surface/60 sm:px-[41px]">
        <div className="flex flex-col items-center gap-[clamp(0.75rem,2.5dvh,2rem)]">
          <div className="flex flex-col items-center">
            <div className="mb-3 flex size-[clamp(40px,6dvh,64px)] items-center justify-center rounded-xl bg-dak-cta">
              <Image src="/icons/envelope.svg" alt="" width={26} height={23} />
            </div>
            <h2 className="mb-1.5 font-heading text-2xl font-semibold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[clamp(1.125rem,3dvh,1.75rem)]">
              Check your inbox
            </h2>
            <p className="px-2 text-center text-base leading-6 text-[#2b2b31] dark:text-dak-body sm:px-12">
              We&rsquo;ve sent a 6-digit verification code to{" "}
              <span className="font-medium text-[#2b2b31] dark:text-dak-heading">{email}</span>.
            </p>
          </div>

          {devCode && (
            <p className="w-full rounded-lg border border-dashed border-dak-cta px-4 py-3 text-center text-sm text-[#2b2b31] dark:text-dak-body">
              Email delivery isn&rsquo;t set up yet. Your code is{" "}
              <span className="font-mono text-base font-semibold tracking-[0.2em] text-[#020204] dark:text-dak-heading">{devCode}</span>
            </p>
          )}

          <div className="flex w-full flex-col items-start gap-3">
            <OtpInput onChange={setCode} />
            {error && <p className="w-full text-center text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}
            <div className="w-full pt-2">
              <Button type="button" variant="dark" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Verifying…" : SUBMIT_LABEL[mode]}
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-2 border-t border-[#c793ff] pt-[clamp(0.75rem,2dvh,1.5625rem)] dark:border-dak-border">
            <p className="text-center text-sm text-[#2b2b31] dark:text-dak-body">
              Didn&rsquo;t receive the email?
            </p>
            <button
              type="button"
              onClick={resend}
              className="flex items-center gap-1 text-sm font-medium tracking-[0.28px] text-[#020204] dark:text-dak-cta"
            >
              <Image src="/icons/refresh-small.svg" alt="" width={9} height={9} className="invert dark:invert-0" />
              {resent ? "Email sent again" : "Resend Email"}
            </button>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={null}>
      <OtpVerificationForm />
    </Suspense>
  );
}
