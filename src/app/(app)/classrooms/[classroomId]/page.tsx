import Image from "next/image";
import Link from "next/link";

const lessons = [
  { icon: "▶", title: "Assessing Floor Flatness (FF/FL)", meta: "Video · 12:45", state: "done" },
  { icon: "📄", title: "ANSI A108.19 Standards Overview", meta: "Document · 5 pages", state: "done" },
  { icon: "🖥", title: "Self-Leveling Underlayment Plan", meta: "Interactive Canvas · In Progress", state: "resume" },
];

const resources = [
  { title: "Master Tool List V3", meta: "Canvas · Shared" },
  { title: "Layout Calculation Sheet", meta: "Spreadsheet · 1.2MB" },
  { title: "Approved Mortar Matrix", meta: "PDF · 450KB" },
];

export default function ClassroomDetailPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-sm text-auth-navy dark:text-dak-body">
        Classroom <span className="mx-1">›</span> Abc Classroom
        <span className="mx-1">›</span> Curriculum
      </p>

      <Link href="/classrooms" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image
          src="/icons/arrow-narrow-right.svg"
          alt=""
          width={20}
          height={20}
          className="-scale-y-100 rotate-180 dark:hidden"
        />
        <Image
          src="/icons/arrow-narrow-right-light.svg"
          alt=""
          width={20}
          height={20}
          className="hidden -scale-y-100 rotate-180 dark:block"
        />
        Back
      </Link>

      <div className="flex flex-col gap-6 rounded-lg border border-light-border bg-white p-5 dark:border-dak-border dark:bg-dak-surface sm:p-8 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-[#f2f2f3] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-auth-navy dark:bg-dak-bg dark:text-dak-heading">
              Active Course
            </span>
            <span className="text-sm text-[#929292] dark:text-dak-muted">✓ MasterTile Inc.</span>
          </div>
          <h1 className="text-2xl font-bold text-auth-navy dark:text-dak-heading sm:text-[32px]">
            Mastering Large Format Tile Installation
          </h1>
          <p className="max-w-[600px] text-base text-auth-navy dark:text-dak-body">
            Advanced techniques for handling, cutting, and setting gauged
            porcelain tile panels and large format slabs.
          </p>
        </div>
        <div className="flex flex-col gap-1 self-start rounded-lg border border-light-border bg-[#f8f9ff] px-6 py-3 dark:border-dak-border dark:bg-dak-bg">
          <span className="text-xs font-medium uppercase tracking-wide text-[#929292] dark:text-dak-muted">
            Join Code
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-auth-navy dark:text-dak-heading">MTL-892</span>
            <span className="text-auth-navy dark:text-dak-heading">⧉</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 xl:flex-row">
        <div className="flex min-w-0 flex-col gap-6 xl:flex-[2]">
          <div className="flex gap-8 overflow-x-auto border-b border-light-border dark:border-dak-border">
            <button className="shrink-0 whitespace-nowrap border-b-4 border-auth-navy pb-3 text-base font-semibold text-auth-navy dark:border-dak-cta dark:text-dak-heading">
              Curriculum
            </button>
            <button className="shrink-0 whitespace-nowrap pb-3 text-base font-medium text-[#929292] dark:text-dak-muted">
              Shared Canvas
            </button>
            <button className="shrink-0 whitespace-nowrap pb-3 text-base font-medium text-[#929292] dark:text-dak-muted">
              Resources
            </button>
            <button className="flex shrink-0 items-center gap-1.5 whitespace-nowrap pb-3 text-base font-medium text-[#929292] dark:text-dak-muted">
              Discussions
              <span className="flex size-5 items-center justify-center rounded-full bg-auth-navy text-xs text-white dark:bg-dak-cta">
                4
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-lg border border-light-border bg-[#f8f9ff] dark:border-dak-border dark:bg-dak-surface">
              <div className="flex items-center justify-between bg-white p-4 dark:bg-dak-surface">
                <div className="flex items-center gap-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-auth-navy text-sm font-medium text-white dark:bg-dak-cta">
                    1
                  </span>
                  <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Substrate Preparation</h3>
                </div>
                <span className="text-auth-navy dark:text-dak-heading">⌃</span>
              </div>
              <div className="flex flex-col">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.title}
                    className={`flex items-center justify-between p-3 ${
                      lesson.state === "resume"
                        ? "border-l-2 border-auth-navy bg-[#f4f4f4] dark:border-dak-cta dark:bg-dak-bg"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-auth-navy/20 text-base dark:bg-dak-cta/20">
                        {lesson.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">{lesson.title}</span>
                        <span className="text-sm text-auth-navy dark:text-dak-body">{lesson.meta}</span>
                      </div>
                    </div>
                    {lesson.state === "done" ? (
                      <span className="text-auth-navy dark:text-dak-heading">✓</span>
                    ) : (
                      <button className="rounded-sm bg-auth-navy px-3 py-1 text-xs font-semibold text-white dark:bg-dak-cta">
                        Resume
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-light-border bg-[#f6f6f6] p-4 dark:border-dak-border dark:bg-dak-surface">
              <div className="flex items-center gap-4">
                <span className="flex size-8 items-center justify-center rounded-full border border-light-border bg-white text-sm font-medium text-[#929292] dark:border-dak-border dark:bg-dak-bg dark:text-dak-muted">
                  2
                </span>
                <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">
                  Setting Materials &amp; Mortar Coverage
                </h3>
              </div>
              <span className="text-auth-navy dark:text-dak-heading">⌄</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-light-border bg-[#f6f6f6] p-4 opacity-60 dark:border-dak-border dark:bg-dak-surface">
              <div className="flex items-center gap-4">
                <span className="flex size-8 items-center justify-center rounded-full border border-dashed border-light-border bg-[#f4f4f4] text-sm dark:border-dak-border dark:bg-dak-bg">
                  🔒
                </span>
                <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">
                  Handling &amp; Placement Techniques
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-6 xl:w-[360px]">
          <div className="rounded-lg border border-light-border bg-[#f6f6f6] p-6 dark:border-dak-border dark:bg-dak-surface">
            <h3 className="mb-4 text-2xl font-medium text-auth-navy dark:text-dak-heading">Your Progress</h3>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-2xl font-bold text-auth-navy dark:text-dak-heading">33%</span>
              <span className="text-sm text-[#929292] dark:text-dak-muted">4 of 12 lessons</span>
            </div>
            <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-[#e0e0e0] dark:bg-dak-border">
              <div className="h-full w-1/3 rounded-full bg-auth-navy dark:bg-dak-cta" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wide text-[#929292] dark:text-dak-muted">
              Next Up
            </span>
            <div className="mt-2 flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-dak-bg">
              <span className="flex size-8 items-center justify-center rounded-full bg-auth-navy/15 dark:bg-dak-cta/20">
                ▶
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">
                  Trowel Ridges &amp; Air Evacuation
                </span>
                <span className="text-sm text-[#929292] dark:text-dak-muted">Module 2 · Video</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Resources</h3>
              <span className="text-auth-navy dark:text-dak-heading">📁</span>
            </div>
            <div className="flex flex-col gap-4">
              {resources.map((r) => (
                <div key={r.title} className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-sm bg-auth-navy/15 text-sm dark:bg-dak-cta/20">
                    📄
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">{r.title}</span>
                    <span className="text-sm text-[#929292] dark:text-dak-muted">{r.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
