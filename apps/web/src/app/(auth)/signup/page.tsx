"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { TextField } from "@/components/ui/TextField";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const persona = searchParams.get("persona");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    const agree = data.get("agree");

    if (!email || !password || !confirmPassword) {
      setError("Fill in every field to continue.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!agree) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setError(null);
    setSubmitting(true);
    const next = persona ? `/create-profile?persona=${persona}` : "/join-network";
    router.push(
      `/otp-verification?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`
    );
  }

  return (
    <AuthShell backHref={persona ? `/login?persona=${persona}` : "/login"}>
      <div className="flex w-full flex-col items-center gap-[clamp(0.5rem,2dvh,2.5rem)]">
        <div className="flex w-full flex-col items-start gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full max-w-[380px] flex-col items-center gap-[clamp(0.375rem,1dvh,1.5rem)]">
              <div className="relative size-[clamp(36px,7dvh,100px)]">
                <Image src="/illustrations/vol-logo.png" alt="VÔL" fill className="object-contain" />
              </div>
              <div className="flex w-full flex-col items-center gap-2">
                <h1 className="text-center text-2xl font-bold text-[#020204] dark:text-dak-heading sm:text-[clamp(1.25rem,4dvh,2rem)]">
                  Let&rsquo;s Sign Up
                </h1>
                <p className="text-center text-base font-medium leading-[23px] text-[#2b2b31] dark:text-dak-body">
                  Enter your details below to sign up your account
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col items-start gap-[clamp(0.75rem,2dvh,2rem)]">
            <div className="flex w-full flex-col items-start gap-3">
              <div className="flex w-full flex-col items-start gap-2">
                <div className="flex w-full flex-col items-start gap-1.5">
                  <label className="text-base font-medium text-[#020204] dark:text-dak-heading">
                    Email
                  </label>
                  <TextField
                    icon={
                      <Image src="/icons/gmail.svg" alt="" width={22} height={22} />
                    }
                    type="email"
                    name="email"
                    placeholder="User@domain.com"
                  />
                </div>
                <div className="flex w-full flex-col items-start gap-1.5">
                  <label className="text-base font-medium text-[#020204] dark:text-dak-heading">
                    Create Password
                  </label>
                  <TextField
                    icon={
                      <Image
                        src="/icons/lock-keyhole.svg"
                        alt=""
                        width={22}
                        height={22}
                        className="invert dark:invert-0"
                      />
                    }
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex w-full flex-col items-start gap-1.5">
                  <label className="text-base font-medium text-[#020204] dark:text-dak-heading">
                    Confirm Password
                  </label>
                  <TextField
                    icon={
                      <Image
                        src="/icons/lock-keyhole.svg"
                        alt=""
                        width={22}
                        height={22}
                        className="invert dark:invert-0"
                      />
                    }
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <label className="flex min-h-11 items-start gap-2.5 py-1 text-sm text-[#2b2b31] dark:text-dak-body">
                <Checkbox name="agree" className="mt-0.5" />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="font-bold text-dak-cta underline dark:no-underline">
                    Terms &amp; Conditions
                  </Link>{" "}
                  |{" "}
                  <Link href="/privacy" className="font-bold text-dak-cta underline dark:no-underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {error && <p className="w-full text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

            <Button type="submit" variant="dark" disabled={submitting}>
              {submitting ? "Creating account…" : "Sign Up"}
            </Button>
          </form>
        </div>

        <Link
          href="/login"
          className="block w-full text-center text-sm font-medium text-[#2b2b31] dark:text-dak-heading"
        >
          Already have an account? <span className="font-bold text-dak-cta underline dark:no-underline">Sign In</span>
        </Link>
      </div>
    </AuthShell>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
