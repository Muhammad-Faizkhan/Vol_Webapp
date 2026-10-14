"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { errorMessage, type ClassroomDetail, type SkillLevel } from "@vol/api-client";
import { useApiQuery, useInvalidate } from "@vol/api-client/react";
import { DropZone } from "@/components/ui/DropZone";
import { Stepper } from "@/components/ui/Stepper";
import { UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";
import { useUpload } from "@/lib/useUpload";

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];
const CATEGORIES = ["Structural Engineering", "Electrical Systems", "Mechanical Design", "Tiling & Flooring", "Architecture", "HVAC"];

export default function CreateClassroomPage() {
  return (
    <Suspense fallback={null}>
      <IdentityStep />
    </Suspense>
  );
}

function IdentityStep() {
  const id = useSearchParams().get("id");
  const { data: existing } = useApiQuery<ClassroomDetail>(id ? `/classrooms/${id}` : null);
  // Editing an existing draft waits for it to load so the form starts with its values.
  if (id && !existing) return null;
  return <IdentityForm key={existing?.id ?? "new"} existing={existing ?? null} />;
}

function IdentityForm({ existing }: { existing: ClassroomDetail | null }) {
  const router = useRouter();
  const invalidate = useInvalidate();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [skill, setSkill] = useState<SkillLevel>(existing?.skillLevel ?? "INTERMEDIATE");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload(setError);

  async function pick(file?: File) {
    const url = await upload(file);
    if (url) setImageUrl(url);
  }

  async function next(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !category || !description.trim()) {
      setError("Fill in the course title, trade category and description.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const body = { title: title.trim(), category, skillLevel: skill, description: description.trim(), imageUrl };
      const classroom = existing
        ? await api.patch<ClassroomDetail>(`/classrooms/${existing.id}`, body)
        : await api.post<ClassroomDetail>("/classrooms", body);
      await invalidate("/classrooms");
      router.push(`/classrooms/create/curriculum?id=${classroom.id}`);
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <div className="flex w-full max-w-[929px] flex-col gap-6">
      <Link href="/classrooms/manage" className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">Course Identity &amp; Structure</h1>
        <p className="text-base text-[#4f626e] dark:text-dak-body">Define the foundational details of your new training module.</p>
      </div>

      <Stepper steps={["Identity", "Curriculum", "Publish"]} currentStep={0} />

      <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
      <DropZone
        onFile={pick}
        onClick={() => fileInput.current?.click()}
        className="relative flex h-[130px] flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border-2 border-dashed border-light-border bg-[#dcdcdc] dark:border-dak-border dark:bg-dak-surface"
      >
        {imageUrl && <UserImage src={imageUrl} className="opacity-50" />}
        <Image src="/icons/new-canvas.svg" alt="" width={24} height={24} className="relative dark:invert" />
        <p className="relative text-sm text-auth-navy dark:text-dak-heading">
          <span className="font-semibold">{uploading ? "Uploading…" : imageUrl ? "Change image" : "Upload image"}</span>{" "}
          <span className="text-[#929292] dark:text-dak-muted">or drag and drop</span>
        </p>
        <span className="relative text-xs text-[#929292] dark:text-dak-muted">PNG, JPG up to 10MB</span>
      </DropZone>

      <form onSubmit={next} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex min-w-0 flex-[2] flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(244,244,246,0.15)] dark:bg-dak-surface">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Primary Definition</h3>
              <p className="text-sm text-[#4f626e] dark:text-dak-body">The public-facing name and trade categorization.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="course-title" className="text-sm font-medium text-auth-navy dark:text-dak-body">
                Course Title *
              </label>
              <input
                id="course-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Advanced Commercial Wiring Diagnostics"
                className="h-14 w-full rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-[rgba(244,244,246,0.15)] dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="course-category" className="text-sm font-medium text-auth-navy dark:text-dak-body">
                Trade Category *
              </label>
              <div className="relative">
                <select
                  id="course-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`h-14 w-full appearance-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base focus:outline-none dark:border-[rgba(244,244,246,0.15)] dark:bg-transparent ${category ? "text-auth-navy dark:text-dak-heading" : "text-[#929292] dark:text-dak-muted"}`}
                >
                  <option value="" disabled>
                    Select primary discipline...
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <Image src="/icons/dropdown-arrow.svg" alt="" width={20} height={20} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 dark:invert" />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(244,244,246,0.15)] dark:bg-dak-surface">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Parameters</h3>
              <p className="text-sm text-[#4f626e] dark:text-dak-body">Difficulty and Levels</p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-auth-navy dark:text-dak-body">Skill Level</span>
              <div className="flex flex-col gap-3" role="radiogroup" aria-label="Skill level">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    role="radio"
                    aria-checked={skill === level.value}
                    onClick={() => setSkill(level.value)}
                    className={`w-full rounded-md px-4 py-2 text-center text-sm font-medium ${
                      skill === level.value ? "bg-dak-cta text-white" : "border border-light-border text-auth-navy dark:border-[rgba(244,244,246,0.3)] dark:text-dak-body"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(244,244,246,0.15)] dark:bg-dak-surface">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Context &amp; Narrative</h3>
            <p className="text-sm text-[#4f626e] dark:text-dak-body">Provide detailed context about the course material and your expertise.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="course-description" className="text-sm font-medium text-auth-navy dark:text-dak-body">
              Course Description *
            </label>
            <textarea
              id="course-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the learning objectives, practical applications, and core syllabus components..."
              className="w-full resize-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 py-3 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-dak-border dark:text-dak-heading dark:placeholder:text-dak-muted"
            />
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

        <div className="flex items-center justify-between border-t border-light-border pt-6 dark:border-[rgba(43,43,49,0.6)]">
          <Link href="/classrooms/manage" className="rounded border border-[#4f626e] px-8 py-4 text-center text-base font-medium text-auth-navy dark:border-dak-body dark:text-dak-body">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="rounded bg-dak-cta px-8 py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)] disabled:opacity-60">
            {saving ? "Saving…" : "Next: Build Curriculum"}
          </button>
        </div>
      </form>
    </div>
  );
}
