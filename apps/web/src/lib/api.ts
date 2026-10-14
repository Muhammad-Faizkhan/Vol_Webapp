import { createApiClient, type Me } from "@vol/api-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const api = createApiClient({ baseUrl: API_URL, scope: "app" });

/** Where a signed-in user belongs: the next onboarding step, or their home screen. */
export function homeFor(user: Me) {
  const business = user.accountType === "BUSINESS";
  if (!user.onboarded) {
    if (business ? !user.business : !user.profile) return business ? "/create-profile?persona=business" : "/create-profile";
    return business ? "/network-visibility?persona=business" : "/network-visibility";
  }
  return business ? "/business/home" : "/home";
}

/** sessionStorage key carrying the reset token from the OTP screen to the reset-password screen. */
export const RESET_TOKEN_KEY = "vol-reset-token";

/** Only same-site relative paths are honoured as ?next= targets (no open redirects). */
export function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}
