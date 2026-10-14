"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { errorMessage, titleCase, type InviteLink, type WorkspaceDetail, type WorkspaceRole } from "@vol/api-client";
import { useApiQuery, useAuth, useInvalidate } from "@vol/api-client/react";
import { useToast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

const roleDefinitions = [
  { role: "Viewer", desc: "View only access to workspaces and assets." },
  { role: "Collaborator", desc: "View and Edit capabilities for all active projects." },
  { role: "Admin", desc: "Full management, user roles." },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Pending = { email: string; role: WorkspaceRole };
type InviteResult = { email: string; status: "invited" | "already_member" | "updated" };

export default function InviteTeamMembersPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const { user } = useAuth();
  const { data: ws } = useApiQuery<WorkspaceDetail>(`/workspaces/${id}`);
  const isAdmin = ws?.myRole === "OWNER" || ws?.myRole === "ADMIN";
  const { data: link, mutate: mutateLink } = useApiQuery<InviteLink>(isAdmin ? `/workspaces/${id}/invite-link` : null);

  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  function add(e: FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL.test(value)) return setError("Enter a valid email address.");
    if (value === user?.email) return setError("That's you — you're already in this workspace.");
    if (pending.some((p) => p.email === value)) return setError("Already in the list.");
    setError(null);
    setPending([...pending, { email: value, role: "COLLABORATOR" }]);
    setEmail("");
  }

  async function save() {
    if (!pending.length) return setError("Add at least one email address.");
    setSaving(true);
    try {
      const results = await api.post<InviteResult[]>(`/workspaces/${id}/invites`, { invites: pending });
      const invited = results.filter((r) => r.status !== "already_member").length;
      const already = results.length - invited;
      toast(`${invited} invite${invited === 1 ? "" : "s"} sent${already ? ` · ${already} already a member` : ""}`);
      await invalidate(`/workspaces/${id}`);
      router.push(`/workspaces/${id}/members`);
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  async function copyLink() {
    if (!link) return;
    await navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function resetLink() {
    if (!window.confirm("Reset the link? The old link stops working.")) return;
    try {
      await mutateLink(api.post<InviteLink>(`/workspaces/${id}/invite-link`, {}), { revalidate: false });
      toast("New invite link created");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  async function setLinkRole(role: WorkspaceRole) {
    try {
      await mutateLink(api.post<InviteLink>(`/workspaces/${id}/invite-link`, { role }), { revalidate: false });
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  if (ws && !isAdmin) {
    return <p className="text-base text-auth-slate dark:text-dak-body">Only workspace admins can invite members.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <Link href={`/workspaces/${id}/members`} className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
          <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
          Back
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading">Invite Team Members</h1>
        <p className="text-base text-auth-slate dark:text-dak-body">
          Add collaborators to {ws?.name ?? "your workspace"} and assign their permission levels.
        </p>
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-6 xl:max-w-[560px] xl:flex-1">
          <form onSubmit={add} className="relative flex gap-2">
            <div className="relative flex-1">
              <Image src="/icons/search.svg" alt="" width={15} height={15} className="absolute left-[17px] top-1/2 -translate-y-1/2 dark:invert" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Add by email and press Enter"
                className="h-14 w-full rounded-lg border border-light-border bg-white pl-[41px] pr-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
              />
            </div>
            <button type="submit" className="h-14 shrink-0 rounded-lg bg-app-dark-surface px-5 text-base text-white">
              Add
            </button>
          </form>
          {error && <p className="-mt-3 text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

          <div className="overflow-hidden rounded-lg border border-light-border dark:border-dak-border">
            <div className="bg-app-dark-surface px-6 py-3 text-sm font-medium tracking-[0.28px] text-white">Selected Members ({pending.length + 1})</div>
            <div className="flex flex-col bg-white dark:bg-dak-surface">
              {pending.map((member) => (
                <div key={member.email} className="flex items-center gap-3 border-b border-light-border p-4 dark:border-dak-border">
                  <Avatar src={null} name={member.email} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{member.email}</span>
                    <span className="truncate text-sm text-[#929292] dark:text-dak-muted">Invitation</span>
                  </div>
                  <div className="relative">
                    <select
                      aria-label={`Role for ${member.email}`}
                      value={member.role}
                      onChange={(e) =>
                        setPending(pending.map((p) => (p.email === member.email ? { ...p, role: e.target.value as WorkspaceRole } : p)))
                      }
                      className="h-10 appearance-none rounded-lg border border-light-border bg-[#f2f2f3] py-2 pl-3 pr-8 text-sm text-auth-navy focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="COLLABORATOR">Collaborator</option>
                      {ws?.myRole === "OWNER" && <option value="ADMIN">Admin</option>}
                    </select>
                    <Image src="/icons/dropdown-arrow.svg" alt="" width={16} height={16} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 dark:invert" />
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${member.email}`}
                    onClick={() => setPending(pending.filter((p) => p.email !== member.email))}
                    className="text-auth-navy dark:text-dak-heading"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-3 p-4">
                <Avatar src={user?.avatarUrl} name={user?.name ?? ""} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{user?.name}</span>
                  <span className="truncate text-sm text-[#929292] dark:text-dak-muted">You</span>
                </div>
                <span className="rounded-lg border border-light-border px-3 py-1.5 text-sm text-auth-navy dark:border-dak-border dark:text-dak-heading">
                  {ws?.myRole ? titleCase(ws.myRole) : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-medium text-auth-navy dark:text-dak-heading">Invite via link</span>
              {link && (
                <select
                  aria-label="Role for people who join by link"
                  value={link.role}
                  onChange={(e) => setLinkRole(e.target.value as WorkspaceRole)}
                  className="h-9 rounded-lg border border-light-border bg-[#f2f2f3] px-2 text-sm text-auth-navy dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
                >
                  <option value="VIEWER">Joins as Viewer</option>
                  <option value="COLLABORATOR">Joins as Collaborator</option>
                </select>
              )}
            </div>
            <p className="text-sm text-[#929292] dark:text-dak-muted">Anyone with this link can request to join. You approve each request.</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={link?.url ?? "Loading…"}
                onFocus={(e) => e.target.select()}
                className="h-11 min-w-0 flex-1 rounded-lg border border-light-border bg-[#f8f9ff] px-3 text-sm text-auth-navy focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
              />
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy invite link"
                className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-light-border bg-[#f2f2f3] text-auth-navy dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
              >
                {copied ? (
                  "✓"
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" />
                    <path d="M3 10.5V3.5C3 2.94772 3.44772 2.5 4 2.5H10.5" stroke="currentColor" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
            <button type="button" onClick={resetLink} className="self-start text-sm font-medium text-dak-cta">
              Reset link
            </button>
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="h-14 rounded-2xl bg-dak-cta text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)] disabled:opacity-60"
          >
            {saving ? "Sending invites…" : "Save Changes"}
          </button>
        </div>

        <div className="w-full shrink-0 self-start rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface xl:w-[400px]">
          <h3 className="mb-4 text-2xl font-semibold text-auth-navy dark:text-dak-heading">Role Definitions</h3>
          <div className="flex flex-col gap-4">
            {roleDefinitions.map((r) => (
              <div key={r.role} className="flex flex-col gap-1">
                <span className="text-base font-semibold text-auth-navy dark:text-dak-heading">{r.role}</span>
                <p className="text-base text-auth-slate dark:text-dak-body">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
