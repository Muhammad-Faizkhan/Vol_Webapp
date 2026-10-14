"use client";

import Link from "next/link";
import { formatMinutes, type Lesson } from "@vol/api-client";
import { Modal } from "@/components/ui/Modal";

const isVideoFile = (url: string) => /\.(mp4|webm)(\?|$)/i.test(url);
const isPdf = (url: string) => /\.pdf(\?|$)/i.test(url);

/** Opens a lesson: plays the video, links the document or canvas, shows quiz questions. */
export function LessonViewer({
  lesson,
  canTrack,
  busy,
  onToggleComplete,
  onClose,
}: {
  lesson: Lesson;
  canTrack: boolean;
  busy: boolean;
  onToggleComplete: () => void;
  onClose: () => void;
}) {
  return (
    <Modal maxWidth={860}>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#929292] dark:text-dak-muted">
              {lesson.kind.toLowerCase()}
              {formatMinutes(lesson.durationMinutes) ? ` · ${formatMinutes(lesson.durationMinutes)}` : ""}
            </span>
            <h2 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{lesson.title}</h2>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="text-xl text-[#020204] dark:text-dak-heading">
            ✕
          </button>
        </div>

        {lesson.kind === "VIDEO" &&
          lesson.resourceUrl &&
          (isVideoFile(lesson.resourceUrl) ? (
            <video src={lesson.resourceUrl} controls className="aspect-video w-full rounded-lg bg-black" />
          ) : (
            <a href={lesson.resourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#2b2b31] px-4 py-3 text-center text-white">
              Watch video ↗
            </a>
          ))}

        {lesson.kind === "DOCUMENT" &&
          lesson.resourceUrl &&
          (isPdf(lesson.resourceUrl) ? (
            <iframe src={lesson.resourceUrl} title={lesson.title} className="h-[60dvh] w-full rounded-lg border border-light-border dark:border-dak-border" />
          ) : (
            <a href={lesson.resourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#2b2b31] px-4 py-3 text-center text-white">
              Open document ↗
            </a>
          ))}

        {lesson.kind === "CANVAS" && lesson.canvas && (
          <Link href={`/canvas/${lesson.canvas.id}`} className="rounded-lg bg-dak-cta px-4 py-3 text-center font-medium text-white">
            Open canvas: {lesson.canvas.title}
          </Link>
        )}

        {lesson.body && (
          <div className="rounded-lg bg-[#f8f9ff] p-4 dark:bg-dak-bg">
            {lesson.kind === "QUIZ" ? (
              <ol className="list-decimal space-y-2 pl-5 text-base text-[#2b2b31] dark:text-dak-body">
                {lesson.body
                  .split("\n")
                  .filter((q) => q.trim())
                  .map((q, i) => (
                    <li key={i}>{q.replace(/^\d+[.)]\s*/, "")}</li>
                  ))}
              </ol>
            ) : (
              <p className="whitespace-pre-wrap text-base text-[#2b2b31] dark:text-dak-body">{lesson.body}</p>
            )}
          </div>
        )}

        {!lesson.resourceUrl && !lesson.canvas && !lesson.body && (
          <p className="text-sm text-[#929292] dark:text-dak-muted">The instructor hasn&apos;t attached content to this lesson yet.</p>
        )}

        {canTrack && (
          <button
            type="button"
            onClick={onToggleComplete}
            disabled={busy}
            className={`self-end rounded-lg px-5 py-3 text-sm font-medium disabled:opacity-60 ${
              lesson.completed ? "border border-light-border text-[#020204] dark:border-dak-border dark:text-dak-heading" : "bg-[#020204] text-white dark:bg-dak-cta"
            }`}
          >
            {lesson.completed ? "Mark as not done" : "Mark complete ✓"}
          </button>
        )}
      </div>
    </Modal>
  );
}
