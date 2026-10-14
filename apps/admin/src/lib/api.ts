import { createApiClient } from "@vol/api-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// "admin" scope: sessions use the admin refresh cookie and /auth/admin/* endpoints, so signing
// into the admin panel never affects a user-app session in the same browser.
export const api = createApiClient({ baseUrl: API_URL, scope: "admin" });

