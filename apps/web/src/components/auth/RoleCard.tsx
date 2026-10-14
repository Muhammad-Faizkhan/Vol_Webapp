"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessage, type Me } from "@vol/api-client";
import { useAuth } from "@vol/api-client/react";
import { api, homeFor } from "@/lib/api";

type RoleCardProps = {
  iconSrc: string;
  iconClassName?: string;
  title: string;
  description: string;
  buttonLabel: string;
  /** Where visitors who aren't signed in go, e.g. "/signup?persona=business". */
  href: string;
  /** "cta" (bright purple) for the primary/individual card, "muted" (black button, neutral border) for the secondary/business card — same in both themes. */
  accent?: "cta" | "muted";
};

export function RoleCard({
  iconSrc,
  iconClassName = "rounded-full object-cover",
  title,
  description,
  buttonLabel,
  href,
  accent = "cta",
}: RoleCardProps) {
  const isCta = accent === "cta";
  const { status, user, setUser } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persona = new URLSearchParams(href.split("?")[1] ?? "").get("persona") === "business" ? "BUSINESS" : "INDIVIDUAL";
  // Signed in but still onboarding (signed up without picking a persona): this card sets the account type.
  const choosing = status === "authenticated" && !user.onboarded;

  async function choose() {
    setSaving(true);
    setError(null);
    try {
      const updated = await api.patch<Me>("/users/me", { accountType: persona });
      setUser(updated);
      router.push(homeFor(updated));
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  const buttonClass = `mt-auto flex h-14 w-full items-center justify-center rounded-2xl text-base font-medium text-white disabled:opacity-60 ${
    isCta
      ? "bg-dak-cta shadow-[0px_8px_16px_rgba(148,54,251,0.4)] dark:shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
      : "bg-[#020202] shadow-[0px_8px_16px_rgba(2,2,2,0.4)]"
  }`;

  return (
    <div
      className={`relative flex min-h-[clamp(120px,17dvh,280px)] w-full flex-col gap-1.5 overflow-hidden rounded-2xl border bg-white px-6 py-[clamp(0.625rem,1.6dvh,1.5625rem)] dark:bg-[#1e1e22] sm:px-[41px] ${
        isCta
          ? "border-dak-cta dark:border-dak-cta"
          : "border-light-border dark:border-dak-border dark:bg-dak-surface"
      }`}
    >
      <div className={`absolute left-0 right-0 top-0 h-1 ${isCta ? "bg-dak-cta" : "bg-auth-navy dark:bg-dak-body"}`} />
      <Image src={iconSrc} alt="" width={60} height={60} className={iconClassName} />
      <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">{title}</h3>
      <p className="text-base leading-[23px] text-auth-navy dark:text-dak-body">{description}</p>
      {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}
      {choosing ? (
        <button type="button" onClick={choose} disabled={saving} className={buttonClass}>
          {saving ? "Saving…" : `Continue as ${persona === "BUSINESS" ? "Business" : "Individual"}`}
        </button>
      ) : (
        <Link href={status === "authenticated" ? homeFor(user) : href} className={buttonClass}>
          {buttonLabel}
        </Link>
      )}
    </div>
  );
}
