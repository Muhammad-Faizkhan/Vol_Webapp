"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@vol/api-client/react";
import { homeFor } from "@/lib/api";

/** On the landing/login/signup screens, sends people who are already signed in to where they belong. */
export function RedirectIfSignedIn() {
  const { status, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") router.replace(homeFor(user));
  }, [status, user, router]);
  return null;
}
