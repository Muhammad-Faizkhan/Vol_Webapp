"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthHeading, AuthShell } from "@/components/auth/AuthShell";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <AuthShell>
      <AuthHeading title="Admin sign in">Restricted access. Unauthorized attempts are recorded.</AuthHeading>

      <form
        className="flex w-full flex-col gap-10"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/verify?email=${encodeURIComponent(email.trim())}`);
        }}
      >
        <label className="flex flex-col gap-4">
          <span className="text-lg font-medium text-dak-heading">Email</span>
          <span className="flex h-14 items-center gap-0.5 rounded-xl border border-dak-heading pl-6 pr-4 focus-within:border-dak-cta">
            <Image src="/icons/gmail.svg" alt="" width={24} height={24} className="shrink-0" />
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="User@domain.com"
              className="h-full min-w-0 flex-1 bg-transparent p-2.5 text-base text-dak-heading placeholder:text-dak-body focus:outline-none"
            />
          </span>
        </label>

        <button
          type="submit"
          className="h-14 w-full rounded-2xl bg-dak-cta text-base font-medium leading-6 text-white drop-shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
        >
          Login
        </button>
      </form>
    </AuthShell>
  );
}
