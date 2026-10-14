"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@vol/api-client/react";
import { homeFor } from "@/lib/api";

/**
 * Gate for signed-in screens. Anonymous visitors go to /login (and come back afterwards);
 * people who haven't finished onboarding are sent to their next onboarding step.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const needsOnboarding = status === "authenticated" && !user.onboarded;

  useEffect(() => {
    if (status === "anonymous") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (needsOnboarding) router.replace(homeFor(user));
  }, [status, needsOnboarding, user, router, pathname]);

  if (status !== "authenticated" || needsOnboarding) return <FullPageSpinner />;
  return <>{children}</>;
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-[60dvh] flex-1 items-center justify-center" role="status" aria-label="Loading">
      <span className="size-10 animate-spin rounded-full border-4 border-dak-cta/30 border-t-dak-cta" />
    </div>
  );
}
