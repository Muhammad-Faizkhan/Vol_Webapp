"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { errorMessage, type Me } from "@vol/api-client";
import { useAuth, useInvalidate } from "@vol/api-client/react";
import { TagInput } from "@/components/ui/TagInput";
import { useToast } from "@/components/ui/Toast";
import { Avatar, UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";
import { useUpload } from "@/lib/useUpload";

const input =
  "h-12 w-full rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted";

function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`flex flex-col gap-2 text-sm font-medium text-auth-navy dark:text-dak-heading ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}

/** Cover + avatar pickers shared by both forms. */
function ImagesEditor({
  cover,
  avatar,
  name,
  onCover,
  onAvatar,
  onError,
}: {
  cover: string | null;
  avatar: string | null;
  name: string;
  onCover: (url: string) => void;
  onAvatar: (url: string) => void;
  onError: (m: string) => void;
}) {
  const coverInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload(onError);
  return (
    <div className="overflow-hidden rounded-lg border border-light-border bg-white dark:border-dak-border dark:bg-dak-surface">
      <input ref={coverInput} type="file" accept="image/*" className="hidden" onChange={async (e) => { const u = await upload(e.target.files?.[0]); if (u) onCover(u); e.target.value = ""; }} />
      <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={async (e) => { const u = await upload(e.target.files?.[0]); if (u) onAvatar(u); e.target.value = ""; }} />
      <div className="relative h-[160px] w-full">
        <UserImage src={cover} fallback="/illustrations/profile-cover.png" />
        <button type="button" onClick={() => coverInput.current?.click()} disabled={uploading} className="absolute right-4 top-4 rounded-lg bg-black/60 px-3 py-2 text-sm text-white">
          {uploading ? "Uploading…" : "Change cover"}
        </button>
      </div>
      <div className="flex items-end gap-4 p-6">
        <span className="-mt-14 rounded-full border-4 border-white dark:border-dak-surface">
          <Avatar src={avatar} name={name || "?"} size={96} />
        </span>
        <button type="button" onClick={() => avatarInput.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-lg border border-light-border px-4 py-2 text-sm font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading">
          <Image src="/icons/camera.svg" alt="" width={18} height={16} className="invert dark:invert-0" />
          Change photo
        </button>
      </div>
    </div>
  );
}

function Shell({ title, error, saving, onSubmit, children }: { title: string; error: string | null; saving: boolean; onSubmit: (e: FormEvent) => void; children: ReactNode }) {
  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-[900px] flex-col gap-6">
      <Link href="/profile" className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </Link>
      <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">{title}</h1>
      {children}
      {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}
      <div className="flex justify-end gap-3">
        <Link href="/profile" className="rounded-2xl border border-light-border px-6 py-3 text-base font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading">
          Cancel
        </Link>
        <button type="submit" disabled={saving} className="rounded-2xl bg-dak-cta px-8 py-3 text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)] disabled:opacity-60">
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </form>
  );
}

const card = "grid gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface sm:grid-cols-2";

export function IndividualProfileEditForm() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const p = user?.profile;
  const [form, setForm] = useState({
    fullName: p?.fullName ?? "",
    username: user?.username ?? "",
    bio: p?.bio ?? "",
    specialty: p?.specialty ?? "",
    portfolioUrl: p?.portfolioUrl ?? "",
    phone: p?.phone ?? "",
    city: p?.city ?? "",
    country: p?.country ?? "",
  });
  const [interests, setInterests] = useState(p?.interests ?? []);
  const [tags, setTags] = useState(p?.tags ?? []);
  const [avatarUrl, setAvatarUrl] = useState(p?.avatarUrl ?? null);
  const [coverUrl, setCoverUrl] = useState(p?.coverUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim()) return setError("Your name can't be empty.");
    setError(null);
    setSaving(true);
    try {
      if (form.username.trim() !== (user?.username ?? "")) {
        await api.patch("/users/me", { username: form.username.trim() || undefined });
      }
      const { fullName, bio, specialty, portfolioUrl, phone, city, country } = form;
      const updated = await api.put<Me>("/users/me/profile", {
        fullName,
        bio,
        specialty,
        portfolioUrl,
        phone,
        city,
        country,
        interests,
        tags,
        avatarUrl,
        coverUrl,
      });
      setUser(updated);
      await invalidate("/users/");
      toast("Profile saved");
      router.push("/profile");
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <Shell title="Edit Personal Profile" error={error} saving={saving} onSubmit={submit}>
      <ImagesEditor cover={coverUrl} avatar={avatarUrl} name={form.fullName} onCover={setCoverUrl} onAvatar={setAvatarUrl} onError={setError} />
      <div className={card}>
        <Field label="Full Name">
          <input value={form.fullName} onChange={set("fullName")} className={input} />
        </Field>
        <Field label="Username">
          <input value={form.username} onChange={set("username")} placeholder="e.g. jane.builds" className={input} />
        </Field>
        <Field label="Profile Type / Specialty">
          <input value={form.specialty} onChange={set("specialty")} placeholder="e.g. Contractor, Student, Instructor" className={input} />
        </Field>
        <Field label="Portfolio URL">
          <input type="url" value={form.portfolioUrl} onChange={set("portfolioUrl")} placeholder="https://" className={input} />
        </Field>
        <Field label="Bio" wide>
          <textarea value={form.bio} onChange={set("bio")} rows={4} className={`${input} h-auto py-3`} />
        </Field>
        <Field label="City">
          <input value={form.city} onChange={set("city")} className={input} />
        </Field>
        <Field label="Country">
          <input value={form.country} onChange={set("country")} className={input} />
        </Field>
        <Field label="Phone">
          <input value={form.phone} onChange={set("phone")} className={input} />
        </Field>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
        <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">Trade Interests</span>
        <TagInput tags={interests} onChange={setInterests} />
        <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">Category Tags</span>
        <TagInput tags={tags} onChange={setTags} />
      </div>
    </Shell>
  );
}

export function BusinessProfileEditForm() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const b = user?.business;
  const [form, setForm] = useState({
    legalName: b?.legalName ?? "",
    description: b?.description ?? "",
    industry: b?.industry ?? "",
    specialty: b?.specialty ?? "",
    contactEmail: b?.contactEmail ?? "",
    phone: b?.phone ?? "",
    website: b?.website ?? "",
  });
  const [tags, setTags] = useState(b?.categoryTags ?? []);
  const [logoUrl, setLogoUrl] = useState(b?.logoUrl ?? null);
  const [coverUrl, setCoverUrl] = useState(b?.coverUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.legalName.trim()) return setError("Your business name can't be empty.");
    setError(null);
    setSaving(true);
    try {
      const updated = await api.put<Me>("/users/me/business", { ...form, categoryTags: tags, logoUrl, coverUrl });
      setUser(updated);
      await invalidate("/users/");
      toast("Business profile saved");
      router.push("/profile");
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <Shell title="Edit Business Profile" error={error} saving={saving} onSubmit={submit}>
      <ImagesEditor cover={coverUrl} avatar={logoUrl} name={form.legalName} onCover={setCoverUrl} onAvatar={setLogoUrl} onError={setError} />
      {b && (
        <p className="rounded-lg bg-[#f3e8ff] px-4 py-3 text-sm text-dak-cta dark:bg-dak-cta/10">
          Verification: <strong>{b.verification.toLowerCase()}</strong>
          {b.verification === "PENDING" && " — our team is reviewing your documents."}
        </p>
      )}
      <div className={card}>
        <Field label="Legal Business Name">
          <input value={form.legalName} onChange={set("legalName")} className={input} />
        </Field>
        <Field label="Industry Segment">
          <input value={form.industry} onChange={set("industry")} placeholder="e.g. Distributor, Manufacturer" className={input} />
        </Field>
        <Field label="Primary Specialty">
          <input value={form.specialty} onChange={set("specialty")} className={input} />
        </Field>
        <Field label="Website">
          <input type="url" value={form.website} onChange={set("website")} placeholder="https://" className={input} />
        </Field>
        <Field label="Professional Bio" wide>
          <textarea value={form.description} onChange={set("description")} rows={4} className={`${input} h-auto py-3`} />
        </Field>
        <Field label="Contact Email">
          <input type="email" value={form.contactEmail} onChange={set("contactEmail")} className={input} />
        </Field>
        <Field label="Phone Number">
          <input value={form.phone} onChange={set("phone")} className={input} />
        </Field>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
        <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">Professional Expertise</span>
        <TagInput tags={tags} onChange={setTags} />
      </div>
    </Shell>
  );
}
