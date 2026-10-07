// System Settings content, one entry per Figma tab frame (841:217, 845:672, 846:857, 846:1019,
// 846:1300, 848:1981, 846:1593, 846:1757). Values are the Figma defaults; the backend will own them.

export type SettingField =
  | { kind: "text"; label: string; value: string }
  | { kind: "select"; label: string; value: string; options: string[] }
  | { kind: "number"; label: string; value: string }
  | { kind: "toggle"; label: string; value: boolean };

export type SettingsCard = { title: string; fields: SettingField[] };

export type SettingsTab = { value: string; label: string; cards: SettingsCard[] };

export const settingsTabs: SettingsTab[] = [
  {
    value: "overview",
    label: "Overview",
    cards: [
      {
        title: "Platform overview",
        fields: [
          { kind: "text", label: "Platform Name", value: "Vol" },
          { kind: "text", label: "Support Email", value: "Support@vol.com" },
          { kind: "text", label: "Primary Domain", value: "Vol.design" },
          { kind: "select", label: "Default Language", value: "English (US)", options: ["English (US)", "English (UK)", "French", "Spanish", "Arabic"] },
          { kind: "select", label: "Default Timezone", value: "UTC", options: ["UTC", "GMT+1", "EST", "PST"] },
        ],
      },
      {
        title: "Data & retention",
        fields: [
          { kind: "number", label: "Deleted account retention", value: "30" },
          { kind: "number", label: "Canvas revision history", value: "30" },
          { kind: "number", label: "Max upload size (MB)", value: "10mb" },
          { kind: "number", label: "Max concurrent canvas editors", value: "30" },
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
          { kind: "toggle", label: "Email verification required", value: false },
          { kind: "select", label: "Allowed sign-in methods", value: "Email + Google", options: ["Email + Google", "Email only", "Email + Google + Apple"] },
          { kind: "select", label: "Default profile visibility", value: "Public", options: ["Public", "Private"] },
          { kind: "toggle", label: "Self-service account deletion", value: false },
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
          { kind: "toggle", label: "Manual verification required", value: false },
          { kind: "toggle", label: "Documents required", value: false },
          { kind: "toggle", label: "Unverified businesses may publish", value: false },
          { kind: "number", label: "Max team members", value: "30" },
          { kind: "number", label: "Max catalogs", value: "30" },
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
          { kind: "number", label: "Workspaces per individual account", value: "30" },
          { kind: "number", label: "Workspaces per business", value: "30" },
          { kind: "number", label: "Members per workspace", value: "30" },
        ],
      },
      {
        title: "Infinite Canvas",
        fields: [
          { kind: "number", label: "Objects per canvas", value: "30" },
          { kind: "toggle", label: "Realtime cursors", value: false },
          { kind: "toggle", label: "Guest view links", value: false },
          { kind: "toggle", label: "Export to PDF / image", value: false },
          { kind: "number", label: "Autosave interval (seconds)", value: "30" },
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
          { kind: "select", label: "Who can create classrooms", value: "Business only", options: ["Business only", "Everyone"] },
          { kind: "number", label: "Students per classroom", value: "30" },
          { kind: "number", label: "Instructors per classroom", value: "02" },
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
          { kind: "toggle", label: "Review before first publish", value: false },
          { kind: "number", label: "Images per product", value: "4" },
          { kind: "toggle", label: "Trademark keyword screening", value: false },
          { kind: "toggle", label: "Duplicate SKU detection", value: false },
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
          { kind: "toggle", label: "In-app notifications", value: false },
          { kind: "toggle", label: "Email notifications", value: false },
          { kind: "toggle", label: "Push notifications", value: false },
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
          { kind: "number", label: "Minimum password length", value: "08" },
          { kind: "toggle", label: "Require 2FA for business owners", value: false },
          { kind: "toggle", label: "Bot protection on sign-up", value: false },
          { kind: "toggle", label: "Suspicious login alerts", value: false },
        ],
      },
    ],
  },
];
