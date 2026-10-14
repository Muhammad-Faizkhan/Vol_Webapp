// Display helpers for admin screens (labels and stat card shape).
import { formatNumber, type AccountStatus, type CaseStatus } from "@vol/api-client";

export type StatTone = "up" | "down";

export type Stat = {
  label: string;
  value: string;
  delta: string;
  tone: StatTone;
  icon: string;
};

/** The labels the Figma tables use. */
export const accountStatusLabel: Record<AccountStatus, "Active" | "Suspended" | "Ban"> = {
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  BANNED: "Ban",
};

export const caseStatusLabel: Record<CaseStatus, string> = {
  OPEN: "Open",
  IN_REVIEW: "In review",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
};

export const accountTypeLabel = (t: "INDIVIDUAL" | "BUSINESS") => (t === "BUSINESS" ? "Business" : "Individual");

/** A stat card from an API number and an optional "+8.7%"-style change. */
export function stat(label: string, icon: string, value: number, delta?: string, note?: string): Stat {
  const down = delta?.startsWith("-") ?? false;
  return {
    label,
    icon,
    value: formatNumber(value),
    delta: note ?? (delta ? `${delta} vs last month` : ""),
    tone: down ? "down" : "up",
  };
}
