"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { errorMessage } from "@vol/api-client";
import { useAuth } from "@vol/api-client/react";
import { AuthHeading, AuthShell } from "@/components/auth/AuthShell";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const { status, user } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Already signed in as staff: skip straight to the panel.
  useEffect(() => {
    if (status === "authenticated" && (user.role === "ADMIN" || user.role === "MODERATOR")) router.replace("/dashboard");
  }, [status, user, router]);

  return (
    <AuthShell>
      <AuthHeading title="Admin sign in">Restricted access. Unauthorized attempts are recorded.</AuthHeading>

      <form
        className="flex w-full flex-col gap-10"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setSending(true);
          try {
            const address = email.trim();
            // The API answers the same way for every address, so it can't be used to find admin emails.
            await api.post("/auth/admin/login", { email: address });
            const next = new URLSearchParams(window.location.search).get("next");
            router.push(`/verify?${new URLSearchParams({ email: address, ...(next ? { next } : {}) })}`);
          } catch (err) {
            setError(errorMessage(err));
            setSending(false);
          }
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

        {error && <p className="-mt-6 text-sm font-medium text-adm-danger">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="h-14 w-full rounded-2xl bg-dak-cta text-base font-medium leading-6 text-white drop-shadow-[0px_8px_6px_rgba(148,54,251,0.4)] disabled:opacity-60"
        >
          {sending ? "Sending code…" : "Login"}
        </button>
      </form>
    </AuthShell>
  );
}
