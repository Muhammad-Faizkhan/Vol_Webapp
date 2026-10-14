// Every platform setting, grouped the way the admin "System Settings" and "Security Center" screens
// show them. Values live in the SystemSetting table; a key with no row uses its default here.
// Settings marked `enforced` change API behaviour; the rest are stored for features not built yet.

type Base = { key: string; label: string; enforced?: boolean };
export type SettingDef =
  | (Base & { kind: "text"; default: string })
  | (Base & { kind: "number"; default: number; min?: number; max?: number })
  | (Base & { kind: "toggle"; default: boolean; hint?: string })
  | (Base & { kind: "select"; default: string; options: string[] });

export type SettingsCard = { title: string; fields: SettingDef[] };
export type SettingsTab = { value: string; label: string; cards: SettingsCard[] };

export const settingsTabs: SettingsTab[] = [
  {
    value: "overview",
    label: "Overview",
    cards: [
      {
        title: "Platform overview",
        fields: [
          { key: "platform.name", kind: "text", label: "Platform Name", default: "Vol" },
          { key: "platform.supportEmail", kind: "text", label: "Support Email", default: "support@vol.com" },
          { key: "platform.domain", kind: "text", label: "Primary Domain", default: "vol.design" },
          {
            key: "platform.language",
            kind: "select",
            label: "Default Language",
            default: "English (US)",
            options: ["English (US)", "English (UK)", "French", "Spanish", "Arabic"],
          },
          { key: "platform.timezone", kind: "select", label: "Default Timezone", default: "UTC", options: ["UTC", "GMT+1", "EST", "PST"] },
        ],
      },
      {
        title: "Data & retention",
        fields: [
          { key: "data.deletedAccountRetentionDays", kind: "number", label: "Deleted account retention", default: 30, min: 0 },
          { key: "data.canvasRevisionHistory", kind: "number", label: "Canvas revision history", default: 30, min: 1, enforced: true },
          { key: "data.maxUploadMb", kind: "number", label: "Max upload size (MB)", default: 10, min: 1, max: 100, enforced: true },
          { key: "data.maxConcurrentEditors", kind: "number", label: "Max concurrent canvas editors", default: 30, min: 1 },
        ],
      },
    ],
  },
  {
    value: "users",
    label: "Users",
    cards: [
      {
        title: "Registration",
        fields: [
          { key: "users.emailVerificationRequired", kind: "toggle", label: "Email verification required", default: true, enforced: true },
          {
            key: "users.signInMethods",
            kind: "select",
            label: "Allowed sign-in methods",
            default: "Email only",
            options: ["Email + Google", "Email only", "Email + Google + Apple"],
          },
          {
            key: "users.defaultVisibility",
            kind: "select",
            label: "Default profile visibility",
            default: "Public",
            options: ["Public", "Private"],
            enforced: true,
          },
          { key: "users.selfServiceDeletion", kind: "toggle", label: "Self-service account deletion", default: true, enforced: true },
        ],
      },
    ],
  },
  {
    value: "businesses",
    label: "Businesses",
    cards: [
      {
        title: "Registration",
        fields: [
          { key: "business.manualVerification", kind: "toggle", label: "Manual verification required", default: true, enforced: true },
          { key: "business.documentsRequired", kind: "toggle", label: "Documents required", default: false, enforced: true },
          { key: "business.unverifiedMayPublish", kind: "toggle", label: "Unverified businesses may publish", default: true, enforced: true },
          { key: "business.maxTeamMembers", kind: "number", label: "Max team members", default: 30, min: 1 },
          { key: "business.maxCatalogs", kind: "number", label: "Max catalogs", default: 500, min: 1, enforced: true },
        ],
      },
    ],
  },
  {
    value: "workspaces",
    label: "Workspaces",
    cards: [
      {
        title: "Workspace limits",
        fields: [
          { key: "workspaces.perIndividual", kind: "number", label: "Workspaces per individual account", default: 30, min: 1, enforced: true },
          { key: "workspaces.perBusiness", kind: "number", label: "Workspaces per business", default: 30, min: 1, enforced: true },
          { key: "workspaces.membersPerWorkspace", kind: "number", label: "Members per workspace", default: 30, min: 1, enforced: true },
        ],
      },
      {
        title: "Infinite Canvas",
        fields: [
          { key: "canvas.maxObjects", kind: "number", label: "Objects per canvas", default: 2000, min: 10, enforced: true },
          { key: "canvas.realtimeCursors", kind: "toggle", label: "Realtime cursors", default: false },
          { key: "canvas.guestViewLinks", kind: "toggle", label: "Guest view links", default: false },
          { key: "canvas.export", kind: "toggle", label: "Export to PDF / image", default: false },
          { key: "canvas.autosaveSeconds", kind: "number", label: "Autosave interval (seconds)", default: 30, min: 5, enforced: true },
        ],
      },
    ],
  },
  {
    value: "classrooms",
    label: "Classrooms",
    cards: [
      {
        title: "Classroom setup",
        fields: [
          {
            key: "classrooms.whoCanCreate",
            kind: "select",
            label: "Who can create classrooms",
            default: "Everyone",
            options: ["Business only", "Everyone"],
            enforced: true,
          },
          { key: "classrooms.maxStudents", kind: "number", label: "Students per classroom", default: 100, min: 1, enforced: true },
          { key: "classrooms.maxInstructors", kind: "number", label: "Instructors per classroom", default: 2, min: 1 },
        ],
      },
    ],
  },
  {
    value: "catalogs",
    label: "Catalogs",
    cards: [
      {
        title: "Catalog publishing",
        fields: [
          { key: "catalog.reviewBeforeFirstPublish", kind: "toggle", label: "Review before first publish", default: false },
          { key: "catalog.imagesPerProduct", kind: "number", label: "Images per product", default: 4, min: 1, max: 20, enforced: true },
          { key: "catalog.trademarkScreening", kind: "toggle", label: "Trademark keyword screening", default: false },
          { key: "catalog.duplicateSkuDetection", kind: "toggle", label: "Duplicate SKU detection", default: false },
        ],
      },
    ],
  },
  {
    value: "notifications",
    label: "Notifications",
    cards: [
      {
        title: "Notifications",
        fields: [
          { key: "notifications.inApp", kind: "toggle", label: "In-app notifications", default: true, enforced: true },
          { key: "notifications.email", kind: "toggle", label: "Email notifications", default: true, enforced: true },
          { key: "notifications.push", kind: "toggle", label: "Push notifications", default: false },
        ],
      },
    ],
  },
  {
    value: "security",
    label: "Security",
    cards: [
      {
        title: "Authentication",
        fields: [
          { key: "security.minPasswordLength", kind: "number", label: "Minimum password length", default: 8, min: 8, max: 64, enforced: true },
          { key: "security.businessOwner2fa", kind: "toggle", label: "Require 2FA for business owners", default: false, enforced: true },
          { key: "security.botProtection", kind: "toggle", label: "Bot protection on sign-up", default: false },
          { key: "security.suspiciousLoginAlerts", kind: "toggle", label: "Suspicious login alerts", default: false, enforced: true },
        ],
      },
    ],
  },
];

// The Security Center "Access policy" list. Same storage, separate screen.
export const accessPolicies: Extract<SettingDef, { kind: "toggle" }>[] = [
  { key: "access.require2fa", kind: "toggle", label: "Require 2FA for all Users", hint: "Blocks sign-in until enrolment is complete", default: false, enforced: true },
  { key: "access.reauthDestructive", kind: "toggle", label: "Re-auth for destructive actions", hint: "Password prompt before bans and deletions", default: true },
  { key: "access.accountSecurity", kind: "toggle", label: "Account & security", hint: "Manage account credentials", default: false },
  { key: "access.lockout", kind: "toggle", label: "Lock account after failed attempts", hint: "Consecutive failures before lockout", default: true, enforced: true },
  { key: "access.sessionTimeout", kind: "toggle", label: "Session timeout", hint: "Idle 30 minutes before automatic sign-out", default: false, enforced: true },
  { key: "access.newDeviceAlert", kind: "toggle", label: "Alert on new device sign-in", hint: "Alert every user by notifications", default: false, enforced: true },
];

export const allSettings: SettingDef[] = [...settingsTabs.flatMap((t) => t.cards.flatMap((c) => c.fields)), ...accessPolicies];
export const settingsByKey = new Map(allSettings.map((s) => [s.key, s]));

export type SettingValue = string | number | boolean;
