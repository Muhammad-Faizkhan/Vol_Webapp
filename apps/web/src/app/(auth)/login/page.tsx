"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

function LoginForm() {
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

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      localStorage.setItem("vol-persona", persona === "business" ? "business" : "individual");
    } catch {
      // ignore write failures (private browsing, etc.)
    }
    router.push(persona === "business" ? "/business/home" : "/home");
  }

  return (
    <AuthShell backHref="/">
      <div className="flex w-full flex-col items-center gap-[clamp(0.5rem,2dvh,2.5rem)]">
        <div className="flex w-full flex-col items-start gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
          <div className="flex w-full flex-col items-start gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
            <div className="flex w-full flex-col items-center gap-[clamp(0.75rem,2.5dvh,3.125rem)]">
              <div className="flex w-full max-w-[380px] flex-col items-center gap-[clamp(0.375rem,1dvh,1.5rem)]">
                <div className="relative size-[clamp(36px,7dvh,100px)]">
                  <Image src="/illustrations/vol-logo.png" alt="VÔL" fill className="object-contain" />
                </div>
                <div className="flex w-full flex-col items-center gap-2">
                  <h1 className="text-center text-2xl font-bold text-[#020204] dark:text-dak-heading sm:text-[clamp(1.25rem,4dvh,2rem)]">
                    Welcome Back
                  </h1>
                  <p className="text-center text-base font-medium leading-[23px] text-[#2b2b31] dark:text-dak-body">
                    Enter your email below to login your account
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-3">
                <Button
                  type="button"
                  variant="google"
                  icon={
                    <Image src="/icons/google.svg" alt="" width={24} height={24} />
                  }
                >
                  Login with google
                </Button>
                <Button
                  type="button"
                  variant="apple"
                  icon={
                    <Image src="/icons/apple.svg" alt="" width={20} height={24} />
                  }
                >
                  Login with Apple
                </Button>
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-2">
              <div className="h-px min-w-6 flex-1 bg-[#2b2b31]/20 dark:bg-dak-border" />
              <span className="shrink-0 text-sm text-[#020204] dark:text-dak-body">
                Or continue with
              </span>
              <div className="h-px min-w-6 flex-1 bg-[#2b2b31]/20 dark:bg-dak-border" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col items-start gap-[clamp(0.75rem,2dvh,2rem)]">
            <div className="flex w-full flex-col items-end gap-2">
              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex w-full flex-col items-start gap-2">
                  <label className="text-base font-medium text-[#020204] dark:text-dak-heading">
                    Email
                  </label>
                  <TextField
                    icon={
                      <Image
                        src="/icons/gmail.svg"
                        alt=""
                        width={22}
                        height={22}
                      />
                    }
                    type="email"
                    name="email"
                    placeholder="User@domain.com"
                  />
                </div>
                <div className="flex w-full flex-col items-start gap-2">
                  <label className="text-base font-medium text-[#020204] dark:text-dak-heading">
                    Password
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
              </div>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#2b2b31] dark:text-dak-heading"
              >
                Can&apos;t login? <span className="font-bold text-dak-cta underline dark:no-underline">Reset Password</span>
              </Link>
            </div>

            {error && <p className="w-full text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

            <Button type="submit" variant="dark" disabled={submitting}>
              {submitting ? "Logging in…" : "Login"}
            </Button>
          </form>
        </div>

        <Link
          href={persona ? `/signup?persona=${persona}` : "/signup"}
          className="block w-full text-center text-sm font-medium text-[#2b2b31] dark:text-dak-heading"
        >
          Don&apos;t have an account? <span className="font-bold text-dak-cta underline dark:no-underline">Sign Up</span>
        </Link>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
