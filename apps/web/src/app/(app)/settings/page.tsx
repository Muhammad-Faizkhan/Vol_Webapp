"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { errorMessage, type Me } from "@vol/api-client";
import { useApiQuery, useAuth } from "@vol/api-client/react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Toggle } from "@/components/ui/Toggle";
import { api } from "@/lib/api";

type Platform = { name: string; supportEmail: string; domain: string; selfServiceDeletion: boolean };
type Dialog = "password" | "delete" | "notifications" | "about" | null;

type SettingsItem = { icon: string; label: string; danger?: boolean; open?: Dialog; href?: string };

const sections: { title: string; items: SettingsItem[] }[] = [
  {
    title: "Account",
    items: [
      { icon: "settings-lock", label: "Change password", open: "password" },
      { icon: "settings-delete", label: "Delete account", danger: true, open: "delete" },
    ],
  },
  { title: "Preferences", items: [{ icon: "settings-bell", label: "Notifications", open: "notifications" }] },
  {
    title: "Privacy & Legal",
    items: [
      { icon: "settings-privacy", label: "Privacy policy", href: "/privacy" },
      { icon: "settings-terms", label: "Terms & Conditions", href: "/terms" },
      { icon: "settings-about", label: "About Volt", open: "about" },
    ],
  },
  { title: "Support", items: [{ icon: "settings-help", label: "Help & Feedback", href: "mailto:" }] },
];

const rowClass =
  "flex h-[60px] w-full items-center justify-between rounded-[14px] border border-[rgba(43,43,49,0.4)] bg-[#251437] px-4 py-[11px] dark:bg-[#121212]";

export default function SettingsPage() {
  const [dialog, setDialog] = useState<Dialog>(null);
  const { data: platform } = useApiQuery<Platform>("/platform");

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[32px]">Settings</h1>
        <p className="text-sm text-[#2b2b31] dark:text-dak-body">Manage your account, preferences, privacy, and workspace experience.</p>
      </div>

      <div className="flex w-full max-w-[570px] flex-col gap-6 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-[25px] shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:rounded-3xl dark:border-[#c793ff] dark:border-[0.5px] dark:bg-[#0f090c] dark:p-10 dark:shadow-[0px_32px_32px_-16px_rgba(148,54,251,0.5)]">
        {sections.map((section) => (
          <div key={section.title} className="flex w-full flex-col gap-3">
            <h2 className="text-base font-semibold text-[#020204] dark:text-dak-heading">{section.title}</h2>
            {section.items
              .filter((item) => item.open !== "delete" || platform?.selfServiceDeletion !== false)
              .map((item) => {
                const content = (
                  <>
                    <span className="flex items-center gap-3">
                      <span className={`flex size-[34px] shrink-0 items-center justify-center rounded-lg ${item.danger ? "bg-[rgba(195,35,35,0.1)]" : "bg-white/10"}`}>
                        <Image src={`/icons/${item.icon}.svg`} alt="" width={16} height={16} />
                      </span>
                      <span className="text-base text-white">{item.label}</span>
                    </span>
                    <Image src="/icons/settings-chevron.svg" alt="" width={16} height={16} />
                  </>
                );
                if (item.href === "mailto:") {
                  return (
                    <a key={item.label} href={`mailto:${platform?.supportEmail ?? ""}?subject=Feedback`} className={rowClass}>
                      {content}
                    </a>
                  );
                }
                return item.href ? (
                  <Link key={item.label} href={item.href} className={rowClass}>
                    {content}
                  </Link>
                ) : (
                  <button key={item.label} type="button" onClick={() => setDialog(item.open ?? null)} className={rowClass}>
                    {content}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {dialog === "password" && <ChangePassword onClose={() => setDialog(null)} />}
      {dialog === "delete" && <DeleteAccount onClose={() => setDialog(null)} />}
      {dialog === "notifications" && <Preferences onClose={() => setDialog(null)} />}
      {dialog === "about" && (
        <DialogShell title={`About ${platform?.name ?? "VÔL"}`} onClose={() => setDialog(null)}>
          <p className="text-base text-[#2b2b31] dark:text-dak-body">
            {platform?.name ?? "VÔL"} connects instructors, engineers and trade businesses through shared digital canvases, classrooms and product catalogs.
          </p>
          <p className="text-sm text-[#929292] dark:text-dak-muted">
            {platform?.domain} · Support: {platform?.supportEmail}
          </p>
        </DialogShell>
      )}
    </div>
  );
}

function DialogShell({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <Modal maxWidth={480}>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#020204] dark:text-dak-heading">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-xl text-[#020204] dark:text-dak-heading">
            ✕
          </button>
        </div>
        {children}
      </div>
    </Modal>
  );
}

const field = "h-12 w-full rounded-lg border border-light-border bg-white px-4 text-base text-[#020204] focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading";

function ChangePassword({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (form.next !== form.confirm) return setError("New passwords don't match.");
    setBusy(true);
    setError(null);
    try {
      await api.post("/auth/change-password", { currentPassword: form.current, newPassword: form.next });
      toast("Password changed. Other devices were signed out.");
      onClose();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <DialogShell title="Change password" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input type="password" required autoComplete="current-password" placeholder="Current password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} className={field} />
        <input type="password" required autoComplete="new-password" minLength={8} placeholder="New password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} className={field} />
        <input type="password" required autoComplete="new-password" placeholder="Confirm new password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={field} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={busy} className="h-12 rounded-xl bg-dak-cta font-medium text-white disabled:opacity-60">
          {busy ? "Saving…" : "Update password"}
        </button>
      </form>
    </DialogShell>
  );
}

function DeleteAccount({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [password, setPassword] = useState("");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post("/users/me/delete", { password });
      await logout();
      router.push("/");
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <DialogShell title="Delete account" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <p className="text-sm text-[#2b2b31] dark:text-dak-body">
          This permanently erases your profile and signs you out everywhere. Workspaces you own are deleted for all members. This can&apos;t be undone.
        </p>
        <input type="password" required autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
        <input placeholder='Type "DELETE" to confirm' value={typed} onChange={(e) => setTyped(e.target.value)} className={field} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={busy || typed !== "DELETE" || !password} className="h-12 rounded-xl bg-red-600 font-medium text-white disabled:opacity-50">
          {busy ? "Deleting…" : "Delete my account"}
        </button>
      </form>
    </DialogShell>
  );
}

function Preferences({ onClose }: { onClose: () => void }) {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const p = user?.profile;

  async function update(patch: Record<string, unknown>) {
    try {
      setUser(await api.patch<Me>("/users/me/preferences", patch));
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  const row = (label: string, hint: string, checked: boolean, onChange: (v: boolean) => void) => (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-light-border p-4 dark:border-dak-border">
      <span className="flex flex-col">
        <span className="text-base font-medium text-[#020204] dark:text-dak-heading">{label}</span>
        <span className="text-sm text-[#929292] dark:text-dak-muted">{hint}</span>
      </span>
      <Toggle checked={checked} onChange={(e) => onChange(e.target.checked)} className="!bg-[#020204] dark:!bg-dak-cta" />
    </label>
  );

  return (
    <DialogShell title="Notifications & privacy" onClose={onClose}>
      {!p ? (
        <p className="text-sm text-[#929292]">Finish your profile to manage preferences.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {row("Email notifications", "Invites, warnings and security alerts by email", p.emailNotifications, (v) => update({ emailNotifications: v }))}
          {row("Public profile", "Anyone on VÔL can see your profile", p.visibility === "PUBLIC", (v) => update({ visibility: v ? "PUBLIC" : "PRIVATE" }))}
          {row("Search indexing", "Show up in Explore and search", p.searchIndexing, (v) => update({ searchIndexing: v }))}
        </div>
      )}
    </DialogShell>
  );
}
