"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { errorMessage, formatJoinCode, type ClassroomDetail, type Lesson, type Student } from "@vol/api-client";
import { useApiQuery, useInvalidate } from "@vol/api-client/react";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";
import { lessonIcon, lessonMeta } from "@/components/classrooms/Curriculum";
import { Discussions } from "@/components/classrooms/Discussions";
import { LessonViewer } from "@/components/classrooms/LessonViewer";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

type TabId = "curriculum" | "canvas" | "resources" | "discussions";

export default function ClassroomDetailPage() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const { data: c, error, mutate } = useApiQuery<ClassroomDetail>(`/classrooms/${classroomId}`);
  const { data: students } = useApiQuery<Student[]>(c?.isInstructor ? `/classrooms/${classroomId}/students` : null);
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab") === "discussions" ? "discussions" : "curriculum",
  );
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [viewing, setViewing] = useState<Lesson | null>(null);
  const [busy, setBusy] = useState(false);

  if (error) return <ErrorState error={error} />;
  if (!c) return null;

  const member = c.isInstructor || c.isEnrolled;
  const allLessons = c.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleIndex: m.position })));
  const nextUp = c.isEnrolled ? allLessons.find((l) => !l.completed) : undefined;
  const canvasLessons = allLessons.filter((l) => l.kind === "CANVAS" && l.canvas);
  const documents = allLessons.filter((l) => (l.kind === "DOCUMENT" || l.kind === "VIDEO") && l.resourceUrl);
  const resources = [...documents, ...canvasLessons];
  const tabs: { id: TabId; label: string; badge?: number }[] = [
    { id: "curriculum", label: "Curriculum" },
    { id: "canvas", label: "Shared Canvas" },
    { id: "resources", label: "Resources" },
    ...(member ? [{ id: "discussions" as const, label: "Discussions", badge: c.discussionCount || undefined }] : []),
  ];
  // Open the module the student is working on by default.
  const isOpen = (id: string, index: number) => open[id] ?? (c.currentModuleId ? c.currentModuleId === id : index === 0);

  async function toggleComplete(lesson: Lesson) {
    setBusy(true);
    try {
      const updated = lesson.completed
        ? await api.del<ClassroomDetail>(`/lessons/${lesson.id}/complete`)
        : await api.post<ClassroomDetail>(`/lessons/${lesson.id}/complete`);
      await mutate(updated, { revalidate: false });
      await invalidate("/classrooms?");
      const fresh = updated.modules.flatMap((m) => m.lessons).find((l) => l.id === lesson.id);
      setViewing(fresh ?? null);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function copyJoinCode() {
    if (!c?.joinCode) return;
    try {
      await navigator.clipboard.writeText(formatJoinCode(c.joinCode));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  async function act(action: "leave" | "archive" | "delete") {
    const confirmText = { leave: `Leave "${c!.title}"?`, archive: `Archive "${c!.title}"? Students keep access to finished work but it disappears from lists.`, delete: `Delete "${c!.title}" for everyone? This can't be undone.` }[action];
    if (!window.confirm(confirmText)) return;
    try {
      if (action === "delete") await api.del(`/classrooms/${c!.id}`);
      else await api.post(`/classrooms/${c!.id}/${action}`);
      await invalidate("/classrooms");
      toast(action === "leave" ? "You left the classroom" : action === "archive" ? "Classroom archived" : "Classroom deleted");
      router.push(c!.isInstructor ? "/classrooms/manage" : "/classrooms");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  const statusLabel = c.status === "DRAFT" ? "Draft" : c.status === "ARCHIVED" ? "Archived" : member ? "Active Course" : "Public Preview";

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-sm text-auth-navy dark:text-dak-body">
        Classroom <span className="mx-1">›</span> {c.title}
        <span className="mx-1">›</span> {activeTab === "discussions" ? "Community Discussion" : tabs.find((t) => t.id === activeTab)?.label}
      </p>

      <Link href={c.isInstructor ? "/classrooms/manage" : "/classrooms"} className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:hidden" />
        <Image src="/icons/arrow-narrow-right-light.svg" alt="" width={20} height={20} className="hidden -scale-y-100 rotate-180 dark:block" />
        Back
      </Link>

      {activeTab !== "discussions" && (
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-5 shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface sm:p-8 lg:flex-row lg:justify-between">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-r from-transparent to-[#c793ff]/50 lg:block" />
          <div className="relative flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-sm bg-[rgba(148,54,251,0.1)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-dak-cta">{statusLabel}</span>
              <span className="flex items-center gap-1.5 text-sm text-[#2b2b31] dark:text-dak-body">
                {c.instructor.verified && <Image src="/icons/verified-check-small.svg" alt="Verified" width={14.667} height={14} className="dark:invert" />}
                {c.instructor.name}
              </span>
              {c.category && <span className="text-sm text-[#929292] dark:text-dak-muted">· {c.category}</span>}
            </div>
            <h1 className="text-2xl font-bold text-[#020204] dark:text-dak-heading sm:text-[48px] sm:leading-[56px]">{c.title}</h1>
            {c.description && <p className="max-w-[600px] whitespace-pre-wrap text-base text-[#2b2b31] dark:text-dak-body sm:text-lg">{c.description}</p>}
            {c.isInstructor && (
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={`/classrooms/create/curriculum?id=${c.id}`} className="rounded bg-[#020204] px-4 py-2 text-sm font-medium text-white dark:bg-dak-cta">
                  Edit curriculum
                </Link>
                <Link href={`/classrooms/create?id=${c.id}`} className="rounded border border-[#020204] px-4 py-2 text-sm font-medium text-[#020204] dark:border-dak-border dark:text-dak-heading">
                  Edit details
                </Link>
                {c.status === "DRAFT" && (
                  <Link href={`/classrooms/create/review?id=${c.id}`} className="rounded border border-dak-cta px-4 py-2 text-sm font-medium text-dak-cta">
                    Review &amp; publish
                  </Link>
                )}
              </div>
            )}
          </div>
          {c.joinCode ? (
            <div className="relative flex min-w-[200px] flex-col gap-1 self-start rounded border border-[rgba(43,43,49,0.4)] px-4 py-3 dark:border-dak-border">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase text-[#020204] dark:text-dak-heading">Join Code</span>
                  <span className="text-2xl font-semibold tracking-[2.4px] text-[#020204] dark:text-dak-heading">{formatJoinCode(c.joinCode)}</span>
                </div>
                <button type="button" onClick={copyJoinCode} aria-label="Copy join code" className="shrink-0">
                  <Image src="/icons/copy.svg" alt="" width={17} height={20} className="dark:invert" />
                </button>
              </div>
              {copied && <span className="text-xs font-medium text-dak-cta">Copied!</span>}
            </div>
          ) : (
            <Link href="/classrooms/join" className="relative self-start rounded bg-dak-cta px-5 py-3 text-sm font-medium text-white">
              Have a code? Join this class
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-col gap-8 xl:flex-row">
        <div className="flex min-w-0 flex-col gap-6 xl:flex-[2]">
          <div className="flex gap-8 overflow-x-auto border-b border-[#c793ff] dark:border-dak-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap pb-[15px] text-sm tracking-[0.28px] ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#020204] font-semibold text-[#020204] dark:border-dak-cta dark:text-dak-heading"
                    : "font-normal text-[#2b2b31] dark:text-dak-muted"
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#2b2b31] text-[10px] font-bold text-[#f4f4f4] dark:bg-dak-cta">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "curriculum" && (
            <div className="flex flex-col gap-4">
              {c.modules.length === 0 && <p className="text-sm text-[#2b2b31] dark:text-dak-body">The curriculum hasn&apos;t been published yet.</p>}
              {c.modules.map((m, index) => {
                const expanded = isOpen(m.id, index);
                const done = m.lessons.length > 0 && m.lessons.every((l) => l.completed);
                return (
                  <div key={m.id} className="overflow-hidden rounded border border-[#c6c6cd] bg-[#f8f9ff] dark:border-dak-border dark:bg-dak-surface">
                    <button
                      type="button"
                      onClick={() => setOpen({ ...open, [m.id]: !expanded })}
                      className={`flex w-full items-center justify-between px-4 py-4 text-left ${expanded ? "border-b border-[#c6c6cd] bg-[#45464d] dark:border-dak-border" : "bg-white dark:bg-dak-surface"}`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                            expanded ? "bg-dak-cta text-white" : "border border-[#c6c6cd] bg-[#f4f4f4] text-[#020204] dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
                          }`}
                        >
                          {done ? "✓" : index + 1}
                        </span>
                        <h3 className={`text-xl font-semibold sm:text-2xl ${expanded ? "text-white" : "text-[#020204] dark:text-dak-heading"}`}>{m.title}</h3>
                      </div>
                      <Image
                        src="/icons/chevron-down-small.svg"
                        alt=""
                        width={12}
                        height={7.4}
                        className={`transition-transform ${expanded ? "rotate-180 invert" : "dark:invert"}`}
                      />
                    </button>
                    {expanded && (
                      <div className="flex flex-col gap-2 bg-white px-6 py-4 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:bg-dak-surface">
                        {m.description && <p className="pb-2 text-sm text-[#2b2b31] dark:text-dak-body">{m.description}</p>}
                        {m.lessons.length === 0 && <p className="text-sm text-[#929292]">No lessons in this module yet.</p>}
                        {m.lessons.map((lesson) => {
                          const resume = nextUp?.id === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => (member ? setViewing(lesson) : toast("Join the classroom to open lessons", "error"))}
                              className={`flex items-center gap-4 rounded p-3 text-left ${resume ? "border-l-2 border-[#4f626e] bg-[#2b2b31]" : "hover:bg-[#f4f4f4] dark:hover:bg-dak-bg"}`}
                            >
                              <span className={`flex size-10 shrink-0 items-center justify-center rounded-sm ${resume ? "bg-white/20" : "bg-[rgba(2,2,4,0.2)]"}`}>
                                <Image src={lessonIcon[lesson.kind]} alt="" width={20} height={20} className={resume ? "invert" : "dark:invert"} />
                              </span>
                              <div className="flex min-w-0 flex-1 flex-col">
                                <span className={`text-sm font-medium tracking-[0.28px] ${resume ? "text-white" : "text-[#020204] dark:text-dak-heading"}`}>{lesson.title}</span>
                                <span className={`text-sm ${resume ? "text-white" : "text-[#2b2b31] dark:text-dak-body"}`}>{lessonMeta(lesson)}</span>
                              </div>
                              {lesson.completed ? (
                                <Image src="/icons/checkmark-circle.svg" alt="Completed" width={16.667} height={16.667} className="dark:invert" />
                              ) : resume ? (
                                <span className="shrink-0 rounded border border-white px-3 py-2 text-xs font-semibold text-white">Resume</span>
                              ) : !member ? (
                                <Image src="/icons/lock.svg" alt="Locked" width={10.667} height={14} className="dark:invert" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "canvas" && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {canvasLessons.length === 0 && <p className="text-sm text-[#2b2b31] dark:text-dak-body">No canvases are linked to this course.</p>}
              {canvasLessons.map((l) => (
                <WorkspaceCard
                  key={l.id}
                  href={member ? `/canvas/${l.canvas!.id}` : "#"}
                  title={l.canvas!.title}
                  workspace={`Lesson: ${l.title}`}
                  editedAgo={`Module ${l.moduleIndex}`}
                  updatedTag="Shared"
                  imageSrc={l.canvas!.thumbnailUrl ?? undefined}
                />
              ))}
            </div>
          )}

          {activeTab === "resources" && (
            <div className="flex flex-col gap-4 rounded border border-[rgba(43,43,49,0.4)] bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
              {resources.length === 0 && <p className="text-sm text-[#2b2b31] dark:text-dak-body">{member ? "No resources attached yet." : "Join the classroom to see its resources."}</p>}
              {resources.map((r) => (
                <ResourceRow key={r.id} lesson={r} onOpen={() => setViewing(r)} />
              ))}
            </div>
          )}

          {activeTab === "discussions" && member && <Discussions classroomId={c.id} />}
        </div>

        {activeTab !== "discussions" && (
          <div className="flex w-full shrink-0 flex-col gap-6 xl:w-[380px]">
            {c.isEnrolled && (
              <div className="flex flex-col gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
                <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Your Progress</h3>
                <div className="flex items-end justify-between">
                  <span className="text-[32px] font-bold leading-none text-[#020204] dark:text-dak-heading">{c.progress ?? 0}%</span>
                  <span className="text-sm text-[#2b2b31] dark:text-dak-muted">
                    {c.completedLessons} of {c.lessonCount} lessons
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f2f2f2] dark:bg-dak-border">
                  <div className="h-full rounded-full bg-[#020204] dark:bg-dak-cta" style={{ width: `${c.progress ?? 0}%` }} />
                </div>
                {nextUp ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#2b2b31] dark:text-dak-muted">Next Up</span>
                    <button type="button" onClick={() => setViewing(nextUp)} className="flex items-start gap-3 rounded-lg border border-[#c6c6cd] bg-[#2b2b31] p-3 text-left dark:border-dak-border">
                      <Image src="/icons/play-circle-white.svg" alt="" width={20} height={22} className="shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium tracking-[0.28px] text-white">{nextUp.title}</span>
                        <span className="text-sm text-[#c6c6cd]">
                          Module {nextUp.moduleIndex} • {nextUp.kind.toLowerCase()}
                        </span>
                      </div>
                    </button>
                  </div>
                ) : (
                  c.lessonCount > 0 && <p className="text-sm font-medium text-[#34a853]">Course complete — nice work!</p>
                )}
              </div>
            )}

            {c.isInstructor && (
              <div className="flex flex-col gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
                <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Students ({c.enrolledCount})</h3>
                {students?.length === 0 && <p className="text-sm text-[#2b2b31] dark:text-dak-body">Share the join code to enrol students.</p>}
                <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto">
                  {students?.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <Avatar src={s.avatarUrl} name={s.name} size={32} />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium text-[#020204] dark:text-dak-heading">{s.name}</span>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#f2f2f2] dark:bg-dak-border">
                          <div className="h-full rounded-full bg-dak-cta" style={{ width: `${s.progress}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-[#2b2b31] dark:text-dak-muted">{s.status === "ACTIVE" ? `${s.progress}%` : "Left"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Resources</h3>
                <Image src="/icons/folder.svg" alt="" width={21.5} height={16} className="dark:invert" />
              </div>
              <div className="flex flex-col gap-4">
                {resources.length === 0 && <p className="text-sm text-[#2b2b31] dark:text-dak-body">Nothing attached yet.</p>}
                {resources.slice(0, 4).map((r) => (
                  <ResourceRow key={r.id} lesson={r} onOpen={() => (member ? setViewing(r) : undefined)} />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {c.isEnrolled && (
                <button type="button" onClick={() => act("leave")} className="text-sm text-[#929292] hover:text-red-500">
                  Leave classroom
                </button>
              )}
              {c.isInstructor && c.status === "PUBLISHED" && (
                <button type="button" onClick={() => act("archive")} className="text-sm text-[#929292] hover:text-[#020204] dark:hover:text-dak-heading">
                  Archive
                </button>
              )}
              {c.isInstructor && (
                <button type="button" onClick={() => act("delete")} className="text-sm text-[#929292] hover:text-red-500">
                  Delete classroom
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {viewing && (
        <LessonViewer lesson={viewing} canTrack={c.isEnrolled} busy={busy} onToggleComplete={() => toggleComplete(viewing)} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

function ResourceRow({ lesson, onOpen }: { lesson: Lesson; onOpen: () => void }) {
  const icon = lesson.kind === "CANVAS" ? "/icons/resource-canvas.svg" : lesson.resourceUrl && /\.pdf(\?|$)/i.test(lesson.resourceUrl) ? "/icons/pdf.svg" : lessonIcon[lesson.kind];
  return (
    <button type="button" onClick={onOpen} className="flex items-center gap-3 text-left">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[rgba(43,43,49,0.4)] bg-[rgba(2,2,4,0.1)] dark:border-dak-border">
        <Image src={icon} alt="" width={14} height={14} className="dark:invert" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-[#020204] dark:text-dak-heading">{lesson.kind === "CANVAS" ? lesson.canvas?.title : lesson.title}</span>
        <span className="text-sm text-[#2b2b31] dark:text-dak-body">{lessonMeta(lesson)}</span>
      </div>
    </button>
  );
}
