import { timeAgo } from "@vol/api-client";

/** "UPDATED 2H AGO" badge for things touched in the last day. */
export function updatedTag(date: string) {
  return Date.now() - new Date(date).getTime() < 24 * 60 * 60 * 1000 ? `UPDATED ${timeAgo(date).toUpperCase()}` : undefined;
}

/** "1 canvas" / "3 canvases". */
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/** Spec rows shown on product cards. */
export function productSpecs(p: {
  size: string | null;
  heightMm: number | null;
  weightKg: number | null;
  trade: string | null;
  status?: string;
}): [string, string][] {
  const rows: [string, string][] = [];
  if (p.size) rows.push(["True Size", p.size]);
  if (p.heightMm != null) rows.push(["Thickness", `${p.heightMm} mm`]);
  if (p.weightKg != null && rows.length < 2) rows.push(["Weight", `${p.weightKg} kg`]);
  if (p.trade && rows.length < 2) rows.push(["Trade", p.trade]);
  if (p.status && p.status !== "PUBLISHED") rows.push(["Status", "Draft"]);
  return rows.length ? rows : [["Details", "Not specified"]];
}

/** sessionStorage key carrying a post draft from create-post to the select-canvas step. */
export const POST_DRAFT_KEY = "vol-create-post-draft";
