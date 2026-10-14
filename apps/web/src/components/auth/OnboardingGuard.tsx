"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@vol/api-client/react";
import { FullPageSpinner } from "@/components/auth/RequireAuth";
import { homeFor } from "@/lib/api";

/** Onboarding screens need a signed-in user who hasn't finished onboarding yet. */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
    else if (status === "authenticated" && user.onboarded) router.replace(homeFor(user));
  }, [status, user, router]);

  if (status !== "authenticated" || user.onboarded) return <FullPageSpinner />;
  return <>{children}</>;
}
