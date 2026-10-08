// Placeholder data matching the Figma "Admin Panel" frames. Swap these for real API calls once
// the backend exists; page components only depend on the shapes exported here.

export type StatTone = "up" | "down";

export type Stat = {
  label: string;
  value: string;
  delta: string;
  tone: StatTone;
  icon: string;
};

export const dashboardStats: Stat[] = [
  { label: "Total Users", value: "14,803", delta: "+8.7% Increases", tone: "up", icon: "/icons/nav/users.svg" },
  { label: "Individual Users", value: "9,431", delta: "+7.7%", tone: "up", icon: "/icons/stats/user.svg" },
  { label: "Business Users", value: "4,803", delta: "+8.7% Increases", tone: "up", icon: "/icons/stats/business-users.svg" },
  { label: "Active Users (30d)", value: "1,431", delta: "+7.7%", tone: "up", icon: "/icons/stats/activity.svg" },
  { label: "New Registrations (7d)", value: "14,803", delta: "+8.7% Increases", tone: "up", icon: "/icons/stats/user-plus.svg" },
  { label: "Total Workspaces", value: "9,431", delta: "+7.7%", tone: "up", icon: "/icons/stats/workspaces.svg" },
  { label: "Total Classrooms", value: "4,803", delta: "+8.7% Increases", tone: "up", icon: "/icons/stats/classrooms.svg" },
  { label: "Total Catalogs", value: "1,431", delta: "+7.7%", tone: "up", icon: "/icons/stats/catalogs.svg" },
  { label: "Total Canvases", value: "1,431", delta: "12 critical", tone: "down", icon: "/icons/stats/canvases.svg" },
  { label: "Suspended Users", value: "803", delta: "+11 this week", tone: "down", icon: "/icons/stats/user-minus.svg" },
  { label: "Banned Users", value: "431", delta: "+64 this week", tone: "down", icon: "/icons/stats/banned.svg" },
];

// Curves traced from the Figma chart vectors (705:3181) so the shapes match the design.
export const userGrowthYearly = [
  { label: "Jan", total: 7000, active: 4800 },
  { label: "Feb", total: 11800, active: 6300 },
  { label: "Mar", total: 17400, active: 9500 },
  { label: "Apr", total: 30400, active: 15800 },
  { label: "May", total: 44400, active: 19800 },
  { label: "Jun", total: 59600, active: 26800 },
  { label: "July", total: 42400, active: 12100 },
  { label: "Aug", total: 29000, active: 6500 },
  { label: "Sep", total: 39800, active: 9200 },
  { label: "Oct", total: 49200, active: 15000 },
  { label: "Nov", total: 60000, active: 27100 },
  { label: "Dec", total: 83800, active: 37600 },
  // Figma draws the area past Dec to the plot edge; this unlabeled point reproduces that.
  { label: "", total: 100000, active: 45000 },
];

export const businessGrowthMonthly = [
  { label: "Jan", business: 10100 },
  { label: "Feb", business: 16500 },
  { label: "Mar", business: 33700 },
  { label: "Apr", business: 53000 },
  { label: "May", business: 47600 },
  { label: "Jun", business: 35600 },
  { label: "Jul", business: 51100 },
  { label: "Aug", business: 68500 },
  { label: "Sep", business: 100000 },
];

export const activityByWeek = [
  { label: "WEEK 1", workspaces: 450, canvases: 120, classrooms: 850, catalog: 120 },
  { label: "WEEK 2", workspaces: 450, canvases: 820, classrooms: 300, catalog: 120 },
  { label: "WEEK 3", workspaces: 450, canvases: 820, classrooms: 300, catalog: 120 },
  { label: "WEEK 4", workspaces: 450, canvases: 820, classrooms: 300, catalog: 120 },
];

export const platformHealth = [
  { label: "Open critical cases", value: 12, tone: "danger" as const },
  { label: "Security alerts (24 h)", value: 12, tone: "warning" as const },
  { label: "Failed admin logins (24 h)", value: 12, tone: "warning" as const },
];

export type AccountType = "Individual" | "Business";
export type AccountStatus = "Active" | "Suspended" | "Ban";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  type: AccountType;
  status: AccountStatus;
  reports: number;
  lastActive: string;
  phone: string;
  country: string;
  city: string;
  joined: string;
  visibility: "Public" | "Private";
};

const baseUser = {
  reports: 0,
  lastActive: "2min ago",
  phone: "+1 23456789",
  country: "USA",
  city: "New York",
  joined: "2026-03-14",
  visibility: "Public" as const,
};

export const users: AdminUser[] = [
  { ...baseUser, id: "USR-10241", name: "John Smith", email: "Johnsmith@domain.com", username: "@johnsmith", avatar: "/avatars/john-smith.png", type: "Individual", status: "Active" },
  { ...baseUser, id: "USR-10242", name: "Alex Morgan", email: "Alexmorgan@domain.com", username: "@alexmorgan", avatar: "/avatars/alex-morgan.png", type: "Individual", status: "Active" },
  { ...baseUser, id: "USR-10243", name: "Sara Jane", email: "Sarajane@domain.com", username: "@sarajane", avatar: "/avatars/sara-jane.png", type: "Business", status: "Suspended" },
  { ...baseUser, id: "USR-10244", name: "Alex Morgan", email: "Alexmorgan@domain.com", username: "@alexmorgan2", avatar: "/avatars/alex-morgan.png", type: "Individual", status: "Ban" },
  { ...baseUser, id: "USR-10245", name: "Mark Williams", email: "Markwilliams@domain.com", username: "@markwilliams", avatar: "/avatars/mark-williams.png", type: "Individual", status: "Active" },
  { ...baseUser, id: "USR-10246", name: "Alex Morgan", email: "Alexmorgan@domain.com", username: "@alexmorgan3", avatar: "/avatars/alex-morgan.png", type: "Individual", status: "Active" },
];

// A second page of mock accounts so Previous/Next pagination works like the Figma table.
users.push(
  ...users.map((u, i) => ({ ...u, id: `USR-${10247 + i}`, username: `${u.username}-2`, lastActive: "1h ago" })),
);

export const totalUsers = "15,620";

export function getUser(id: string) {
  return users.find((u) => u.id === id);
}

export const userWorkspaces = [
  { name: "Abc Workspace", role: "Viewer", members: "05", canvases: "18", visibility: "Private", updated: "4d ago" },
  { name: "Abc Workspace", role: "Editor", members: "03", canvases: "7", visibility: "Private", updated: "4d ago" },
  { name: "Abc Workspace", role: "Owner", members: "04", canvases: "05", visibility: "Public", updated: "4d ago" },
  { name: "Abc Workspace", role: "Viewer", members: "06", canvases: "14", visibility: "Private", updated: "4d ago" },
  { name: "Abc Workspace", role: "Viewer", members: "10", canvases: "8", visibility: "Public", updated: "4d ago" },
];

export const userClassrooms = [
  { name: "Abc Classroom", role: "Student", progress: "43%", status: "Active" },
  { name: "Abc Classroom", role: "Student", progress: "43%", status: "Active" },
  { name: "Abc Classroom", role: "Student", progress: "43%", status: "Inactive" },
  { name: "Abc Classroom", role: "Student", progress: "43%", status: "Active" },
  { name: "Abc Classroom", role: "Student", progress: "43%", status: "Active" },
];

export type CaseStatus = "Open" | "In review";

export type AdminCase = {
  id: string;
  title: string;
  reporter: string;
  opened: string;
  status: CaseStatus;
  reportedAccount: string;
  violation: string;
  // Figma 799:9198 shows these two values as written; kept verbatim until real case data exists.
  escalatedBy: string;
  openedLocation: string;
  recommendation: string;
  evidence: string[];
};

const harassment = {
  title: "Repeated harassment in Workspace comments",
  reporter: "John smith",
  opened: "2026-09-15",
  reportedAccount: "Mark Williams",
  violation: "Harassment",
  escalatedBy: "2026-09-15",
  openedLocation: "New York",
  recommendation: "Permanent ban recommended",
  evidence: ["3 comment threads", "2 direct messages", "Canvas annotation log"],
};

export const cases: AdminCase[] = [
  { ...harassment, id: "ESC-0001", status: "Open" },
  { ...harassment, id: "ESC-0003", status: "Open" },
  {
    ...harassment,
    id: "ESC-0002",
    title: "Counterfeit product listings in catalog",
    status: "In review",
    violation: "Counterfeit goods",
    recommendation: "Catalog takedown recommended",
    evidence: ["4 product listings", "Trademark complaint", "Seller message history"],
  },
  { ...harassment, id: "ESC-0004", status: "Open" },
];

export const caseStats = [
  { label: "Open escalations", value: "02" },
  { label: "In review", value: "02" },
  { label: "Reopened this month", value: "03" },
];

export function getCase(id: string) {
  return cases.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export const analyticsStats: Stat[] = [
  { label: "Total Users", value: "14,803", delta: "+8.7% Increases", tone: "up", icon: "/icons/nav/users.svg" },
  { label: "Active workspaces", value: "9,431", delta: "+7.7%", tone: "up", icon: "/icons/stats/workspaces.svg" },
  { label: "Classrooms running", value: "4,803", delta: "+8.7% Increases", tone: "up", icon: "/icons/stats/classrooms.svg" },
  { label: "Total products", value: "1,431", delta: "+7.7%", tone: "up", icon: "/icons/stats/products.svg" },
];

export const accountShare = [
  { name: "Individual Users", value: 4500, color: "#4285f4" },
  { name: "Distributor", value: 760, color: "#fbbc05" },
  { name: "Contractor", value: 520, color: "#3bcc92" },
];

// Placeholder copy from Figma 792:7285 / 792:7364 until the real legal text is supplied.
export const policyPlaceholder =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.";
