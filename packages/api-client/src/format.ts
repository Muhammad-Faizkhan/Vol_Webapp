// Display helpers shared by both apps.

const UNITS: [number, string][] = [
  [60, "s"],
  [60, "min"],
  [24, "h"],
  [7, "d"],
  [4.35, "w"],
  [12, "mo"],
];

/** "12min ago", "3d ago", "just now". */
export function timeAgo(date: string | Date | null | undefined) {
  if (!date) return "never";
  let value = (Date.now() - new Date(date).getTime()) / 1000;
  if (value < 45) return "just now";
  for (const [size, unit] of UNITS) {
    if (value < size) return `${Math.floor(value)}${unit} ago`;
    value /= size;
  }
  return `${Math.floor(value)}y ago`;
}

/** 1431 → "1,431". */
export const formatNumber = (n: number) => n.toLocaleString("en-US");

/** 2400 → "2.4k". */
export function compactNumber(n: number) {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, "")}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "—";
  return new Date(date).toISOString().slice(0, 10);
}

/** "John Smith" → "JS". */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/** "COLLABORATOR" → "Collaborator". */
export const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");

/** "ABC123" → "ABC-123" (classroom join codes). */
export const formatJoinCode = (code: string) => (code.length === 6 ? `${code.slice(0, 3)}-${code.slice(3)}` : code);

export function formatMinutes(minutes: number | null | undefined) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} mins`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
