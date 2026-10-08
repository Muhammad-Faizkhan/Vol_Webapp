"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();

    if (!email) {
      setError("Enter your email address to continue.");
      return;
    }

    setError(null);
    setSubmitting(true);
    router.push(
      `/otp-verification?email=${encodeURIComponent(email)}&next=${encodeURIComponent("/reset-password")}`
    );
  }

  return (
    <AuthShell>
      <div className="flex w-full flex-col items-start gap-[clamp(0.75rem,2dvh,1.5rem)]">
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full max-w-[380px] flex-col items-center gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
            <div className="relative size-[clamp(48px,9dvh,100px)]">
              <Image src="/illustrations/vol-logo.png" alt="VÔL" fill className="object-contain" />
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <h1 className="w-full text-center text-2xl font-bold text-[#020204] dark:text-dak-heading sm:text-[clamp(1.25rem,4dvh,2rem)]">
                Forgot Password?
              </h1>
              <p className="w-full text-center text-base font-medium leading-[23px] text-[#2b2b31] dark:text-dak-body">
                Enter email to get One-Time Password to verify your account.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col items-start gap-[clamp(1rem,3dvh,2rem)]">
          <div className="flex w-full flex-col items-start gap-2">
            <label className="text-base font-medium text-[#020204] dark:text-dak-heading">Email</label>
            <TextField
              icon={<Image src="/icons/gmail.svg" alt="" width={22} height={22} />}
              type="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>

          {error && <p className="w-full text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

          <Button type="submit" variant="dark" disabled={submitting}>
            {submitting ? "Sending…" : "Get OTP"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
