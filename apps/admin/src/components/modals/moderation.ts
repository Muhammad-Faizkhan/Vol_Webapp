import type { ActionModalProps } from "./ActionModal";

export type ModerationAction = "suspend" | "ban" | "delete" | "warn" | "dismiss";

type ActionCopy = Pick<ActionModalProps, "title" | "description" | "confirmLabel" | "confirmClassName" | "confirmWord">;

// Copy and button colors per Figma's Composer Modal frames (789:4313, 789:4603, 789:4637,
// 801:9574, 801:9548).
export const moderationActions: Record<ModerationAction, ActionCopy> = {
  suspend: {
    title: "Suspend this account?",
    description: "The user loses access to workspaces, classrooms and community until restored.",
    confirmLabel: "Suspend User",
    confirmClassName: "bg-adm-warning",
  },
  ban: {
    title: "Permanently ban this account?",
    description: "The account is permanently closed. Content is hidden and re-registration is blocked.",
    confirmLabel: "Ban user",
    confirmClassName: "bg-adm-danger",
    confirmWord: "BAN",
  },
  delete: {
    title: "Delete this account and all data?",
    description: "Irreversible. Personal data is erased under the platform retention policy",
    confirmLabel: "Delete user",
    confirmClassName: "bg-adm-danger-dark",
    confirmWord: "DELETE",
  },
  warn: {
    title: "Issue formal warning",
    description: "The account holder receives a warning email and an in-app notice.",
    confirmLabel: "Issue Warning",
    confirmClassName: "bg-adm-blue",
  },
  dismiss: {
    title: "Dismiss escalation",
    description: "The report is closed with no action against the account.",
    confirmLabel: "Dismiss Case",
    confirmClassName: "bg-adm-blue",
  },
};
