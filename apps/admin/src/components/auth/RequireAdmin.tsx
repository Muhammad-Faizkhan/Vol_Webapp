"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@vol/api-client/react";

const STAFF = new Set(["ADMIN", "MODERATOR"]);

/** Panel screens need a signed-in admin or moderator; everyone else goes to /login. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = status === "authenticated" && STAFF.has(user.role);

  useEffect(() => {
    if (status === "anonymous" || (status === "authenticated" && !STAFF.has(user.role))) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, user, router, pathname]);

  if (!allowed) {
    return (
      <div className="flex min-h-[calc(100*var(--vh))] items-center justify-center bg-dak-bg" role="status" aria-label="Loading">
        <span className="size-10 animate-spin rounded-full border-4 border-dak-cta/30 border-t-dak-cta" />
      </div>
    );
  }
  return <>{children}</>;
}

/** Only ADMIN (not MODERATOR) can open platform configuration screens. */
export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === "ADMIN";
}
