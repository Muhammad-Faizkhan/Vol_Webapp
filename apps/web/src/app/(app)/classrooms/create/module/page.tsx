"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { errorMessage, type ClassroomDetail } from "@vol/api-client";
import { useApiQuery, useInvalidate } from "@vol/api-client/react";
import { lessonBody, LessonForm, LessonRow, type LessonInput } from "@/components/classrooms/Curriculum";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";

export default function CreateModulePage() {
  return (
    <Suspense fallback={null}>
      <CreateModule />
    </Suspense>
  );
}

const inputClass =
  "h-12 w-full rounded border border-light-border px-4 text-sm text-auth-navy focus:outline-none dark:border-dak-heading dark:bg-transparent dark:text-dak-heading";

function CreateModule() {
  const id = useSearchParams().get("id");
  const router = useRouter();
  const invalidate = useInvalidate();
  const { data: classroom } = useApiQuery<ClassroomDetail>(id ? `/classrooms/${id}` : null);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState<number | null>(null);
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<LessonInput[]>([]);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!id) return <EmptyState title="Start with the course identity" action={{ label: "Create a classroom", href: "/classrooms/create" }} />;
  if (!classroom) return null;
  const slots = classroom.modules.length + 1;
  const placement = position ?? slots;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Give the module a name.");
    setError(null);
    setSaving(true);
    try {
      const minutes = Number(duration.replace(/[^\d.]/g, ""));
      const updated = await api.post<ClassroomDetail>(`/classrooms/${id}/modules`, {
        title: title.trim(),
        description: description.trim() || undefined,
        durationMinutes: minutes ? Math.round(minutes) : undefined,
        position: placement,
      });
      const created = updated.modules.find((m) => m.position === placement);
      for (const lesson of items) {
        if (created) await api.post(`/modules/${created.id}/lessons`, lessonBody(lesson));
      }
      await invalidate(`/classrooms/${id}`);
      router.push(`/classrooms/create/curriculum?id=${id}`);
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <div className="flex w-full max-w-[929px] flex-col gap-6">
      <Link href={`/classrooms/create/curriculum?id=${id}`} className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">Create New Module</h1>
        <p className="text-base text-[#4f626e] dark:text-dak-body">Add a new curriculum item and place it within your course structure.</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(198,198,205,0.4)] dark:bg-dak-surface">
          <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Module Identity</h3>

          <div className="flex flex-col gap-2">
            <label htmlFor="module-title" className="text-sm font-medium text-auth-navy dark:text-dak-heading">
              Module Title
            </label>
            <input id="module-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Foundations of Structural Analysis" className={inputClass} />
          </div>

          {adding ? (
            <LessonForm
              onSubmit={(lesson) => {
                setItems([...items, lesson]);
                setAdding(false);
              }}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <button type="button" onClick={() => setAdding(true)} className="flex flex-col items-center gap-1 rounded border-2 border-dashed border-light-border p-6 dark:border-[rgba(198,198,205,0.4)]">
              <span className="flex size-12 items-center justify-center rounded-xl bg-[#f8f9ff]">
                <Image src="/icons/plus-small.svg" alt="" width={14} height={14} />
              </span>
              <span className="pt-1 text-sm font-medium text-auth-navy dark:text-dak-heading">Add Curriculum Item</span>
              <span className="text-sm text-[#4f626e] dark:text-dak-body">Video, Document, Diagram, or Assessment</span>
            </button>
          )}

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label htmlFor="module-placement" className="text-sm font-medium text-auth-navy dark:text-dak-heading">
                Placement
              </label>
              <div className="relative">
                <select id="module-placement" value={placement} onChange={(e) => setPosition(Number(e.target.value))} className={`${inputClass} appearance-none`}>
                  {Array.from({ length: slots }, (_, i) => slots - i).map((n) => (
                    <option key={n} value={n}>
                      Module {n}
                      {n === slots ? " (last)" : ""}
                    </option>
                  ))}
                </select>
                <Image src="/icons/dropdown-arrow.svg" alt="" width={16} height={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 dark:invert" />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label htmlFor="module-duration" className="text-sm font-medium text-auth-navy dark:text-dak-heading">
                Estimate Duration (minutes)
              </label>
              <input id="module-duration" inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="45" className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="module-description" className="text-sm font-medium text-auth-navy dark:text-dak-heading">
              Description
            </label>
            <textarea
              id="module-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief overview of the module content..."
              className="w-full resize-none rounded border border-light-border px-4 py-3 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-heading dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(198,198,205,0.4)] dark:bg-dak-surface">
          <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Curriculum Planner</h3>
          <div className="flex flex-col gap-3">
            {items.length === 0 && <p className="text-sm text-[#4f626e] dark:text-dak-body">Items you add appear here. You can also add lessons later.</p>}
            {items.map((item, i) => (
              <LessonRow key={i} lesson={{ ...item, title: `${i + 1}. ${item.title}` }} onDelete={() => setItems(items.filter((_, j) => j !== i))} />
            ))}
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center rounded-lg bg-dak-cta px-8 py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)] disabled:opacity-60"
        >
          {saving ? "Adding…" : "Add Module"}
        </button>
      </form>
    </div>
  );
}
