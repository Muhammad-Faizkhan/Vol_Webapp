"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { formatMinutes, type Lesson, type LessonKind } from "@vol/api-client";
import { CanvasPicker } from "@/components/canvas/CanvasPicker";
import { useUpload } from "@/lib/useUpload";

export const lessonIcon: Record<LessonKind, string> = {
  VIDEO: "/icons/play.svg",
  DOCUMENT: "/icons/document.svg",
  CANVAS: "/icons/new-canvas.svg",
  QUIZ: "/icons/checkmark-circle.svg",
};

const KIND_LABEL: Record<LessonKind, string> = { VIDEO: "Video", DOCUMENT: "Document", CANVAS: "Canvas", QUIZ: "Quiz" };

export type LessonInput = {
  title: string;
  kind: LessonKind;
  durationMinutes?: number;
  resourceUrl?: string | null;
  canvasId?: string | null;
  body?: string;
  /** Display only: the linked canvas's title. */
  canvasTitle?: string;
};

/** The API body for a lesson (drops display-only fields). */
export function lessonBody(l: LessonInput) {
  return { title: l.title, kind: l.kind, durationMinutes: l.durationMinutes, resourceUrl: l.resourceUrl, canvasId: l.canvasId, body: l.body };
}

/** "Video • 12 mins", "Canvas Template Linked: 'Standard Truss Setup A'"… */
export function lessonMeta(l: Pick<Lesson, "kind" | "durationMinutes" | "resourceUrl"> & { canvas?: { title: string } | null; canvasTitle?: string }) {
  const parts = [KIND_LABEL[l.kind]];
  const minutes = formatMinutes(l.durationMinutes);
  if (minutes) parts.push(minutes);
  if (l.kind === "CANVAS" && (l.canvas || l.canvasTitle)) return `Canvas Linked: '${l.canvas?.title ?? l.canvasTitle}'`;
  if (l.kind === "DOCUMENT" && l.resourceUrl) parts.push("File attached");
  return parts.join(" • ");
}

export function LessonRow({ lesson, onDelete }: { lesson: LessonInput | Lesson; onDelete?: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded border border-light-border bg-[#f8f9ff] p-3 dark:border-[rgba(198,198,205,0.2)] dark:bg-dak-border">
      <div className="flex size-10 shrink-0 items-center justify-center rounded bg-[rgba(79,98,110,0.1)] dark:bg-[rgba(244,244,246,0.1)]">
        <Image src={lessonIcon[lesson.kind]} alt="" width={20} height={20} className="dark:invert" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{lesson.title}</span>
        <span className="truncate text-xs text-[#4f626e] dark:text-dak-body">
          {lessonMeta({ ...lesson, durationMinutes: lesson.durationMinutes ?? null, resourceUrl: lesson.resourceUrl ?? null })}
        </span>
      </div>
      {onDelete && (
        <button type="button" onClick={onDelete} aria-label={`Delete ${lesson.title}`} className="rounded px-2 py-1 text-sm text-[#929292] hover:bg-red-50 hover:text-red-500">
          ✕
        </button>
      )}
    </div>
  );
}

const field =
  "h-11 w-full rounded-lg border border-light-border bg-white px-3 text-sm text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading";

/** Inline "Add Lesson" form. */
export function LessonForm({ onSubmit, onCancel }: { onSubmit: (lesson: LessonInput) => Promise<void> | void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<LessonKind>("VIDEO");
  const [duration, setDuration] = useState("");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [canvas, setCanvas] = useState<{ id: string; title: string } | null>(null);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload(setError);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Give the lesson a title.");
    if (kind === "CANVAS" && !canvas) return setError("Pick a canvas to link.");
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        kind,
        durationMinutes: duration ? Math.max(0, Math.round(Number(duration))) : undefined,
        resourceUrl: kind === "VIDEO" || kind === "DOCUMENT" ? url.trim() || null : null,
        canvasId: kind === "CANVAS" ? canvas?.id : null,
        canvasTitle: canvas?.title,
        body: body.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add the lesson");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded border border-dak-cta bg-white p-4 dark:bg-dak-surface">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" aria-label="Lesson title" className={field} />
        <select value={kind} onChange={(e) => setKind(e.target.value as LessonKind)} aria-label="Lesson type" className={field}>
          {(Object.keys(KIND_LABEL) as LessonKind[]).map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
        <input type="number" min={0} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Minutes" aria-label="Duration in minutes" className={field} />
      </div>

      {(kind === "VIDEO" || kind === "DOCUMENT") && (
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={kind === "VIDEO" ? "Video URL (or upload an MP4)" : "Document URL (or upload a PDF)"}
            aria-label="Resource URL"
            className={field}
          />
          <input
            ref={fileInput}
            type="file"
            accept={kind === "VIDEO" ? "video/mp4,video/webm" : "application/pdf,image/*"}
            className="hidden"
            onChange={async (e) => {
              const u = await upload(e.target.files?.[0], kind === "VIDEO" ? "media" : "document");
              if (u) setUrl(u);
              e.target.value = "";
            }}
          />
          <button type="button" onClick={() => fileInput.current?.click()} disabled={uploading} className="shrink-0 rounded-lg border border-light-border px-3 text-sm text-auth-navy disabled:opacity-60 dark:border-dak-border dark:text-dak-heading">
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      )}

      {kind === "CANVAS" && (
        <button type="button" onClick={() => setPicking(true)} className="h-11 rounded-lg border border-dashed border-dak-cta text-sm font-medium text-dak-cta">
          {canvas ? `Linked: ${canvas.title} (change)` : "Link a canvas…"}
        </button>
      )}

      {(kind === "QUIZ" || kind === "DOCUMENT" || kind === "VIDEO") && (
        <textarea
          rows={kind === "QUIZ" ? 4 : 2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={kind === "QUIZ" ? "Questions, one per line…" : "Notes for students (optional)"}
          aria-label="Lesson notes"
          className="resize-none rounded-lg border border-light-border bg-white p-3 text-sm text-auth-navy focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-auth-navy dark:text-dak-heading">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="rounded-lg bg-dak-cta px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {saving ? "Adding…" : "Add Lesson"}
        </button>
      </div>

      {picking && (
        <CanvasPicker
          title="Link a canvas"
          onClose={() => setPicking(false)}
          onPick={(c) => {
            setCanvas({ id: c.id, title: c.title });
            setPicking(false);
          }}
        />
      )}
    </form>
  );
}
