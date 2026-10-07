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

export const userGrowthYearly = [
  { label: "Jan", total: 1200, active: 900 },
  { label: "Feb", total: 2600, active: 1500 },
  { label: "Mar", total: 5200, active: 2600 },
  { label: "Apr", total: 9000, active: 4200 },
  { label: "May", total: 22000, active: 9000 },
  { label: "Jun", total: 13000, active: 6500 },
  { label: "July", total: 20000, active: 4000 },
  { label: "Aug", total: 5400, active: 1400 },
  { label: "Sep", total: 26000, active: 3500 },
  { label: "Oct", total: 32000, active: 9000 },
  { label: "Nov", total: 45000, active: 22000 },
  { label: "Dec", total: 100000, active: 50000 },
];

export const businessGrowthMonthly = [
  { label: "Jan", business: 300 },
  { label: "Feb", business: 650 },
  { label: "Mar", business: 1100 },
  { label: "Apr", business: 2600 },
  { label: "May", business: 9000 },
  { label: "Jun", business: 1540 },
  { label: "Jul", business: 5200 },
  { label: "Aug", business: 7500 },
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
