import type { AccountStatus } from "../generated/prisma/enums.js";

/** Why this account may not sign in or call the API right now, or null if it may. */
export function accountBlockReason(user: { status: AccountStatus; suspendedUntil: Date | null }) {
  if (user.status === "BANNED") return "Account banned";
  // A suspension with no end date lasts until an admin reinstates the account.
  if (user.status === "SUSPENDED" && (!user.suspendedUntil || user.suspendedUntil > new Date())) {
    return "Account suspended";
  }
  return null;
}
