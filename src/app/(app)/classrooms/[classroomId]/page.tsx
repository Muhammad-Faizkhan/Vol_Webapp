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
      <p className="text-sm text-auth-navy">
        Classroom <span className="mx-1">›</span> Abc Classroom
        <span className="mx-1">›</span> Curriculum
      </p>

      <Link href="/classrooms" className="flex items-center gap-1.5 text-base font-medium text-auth-navy">
        <Image
          src="/icons/arrow-narrow-right.svg"
          alt=""
          width={20}
          height={20}
          className="-scale-y-100 rotate-180"
        />
        Back
      </Link>

      <div className="flex justify-between rounded-lg border border-light-border bg-white p-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#f2f2f3] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-auth-navy">
              Active Course
            </span>
            <span className="text-sm text-[#929292]">✓ MasterTile Inc.</span>
          </div>
          <h1 className="text-[32px] font-bold text-auth-navy">
            Mastering Large Format Tile Installation
          </h1>
          <p className="max-w-[600px] text-base text-auth-navy">
            Advanced techniques for handling, cutting, and setting gauged
            porcelain tile panels and large format slabs.
          </p>
        </div>
        <div className="flex flex-col gap-1 self-start rounded-lg border border-light-border bg-[#f8f9ff] px-6 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-[#929292]">
            Join Code
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-auth-navy">MTL-892</span>
            <span className="text-auth-navy">⧉</span>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex flex-[2] flex-col gap-6">
          <div className="flex gap-8 border-b border-light-border">
            <button className="border-b-4 border-auth-navy pb-3 text-base font-semibold text-auth-navy">
              Curriculum
            </button>
            <button className="pb-3 text-base font-medium text-[#929292]">Shared Canvas</button>
            <button className="pb-3 text-base font-medium text-[#929292]">Resources</button>
            <button className="flex items-center gap-1.5 pb-3 text-base font-medium text-[#929292]">
              Discussions
              <span className="flex size-5 items-center justify-center rounded-full bg-auth-navy text-xs text-white">
                4
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-lg border border-light-border bg-[#f8f9ff]">
              <div className="flex items-center justify-between bg-white p-4">
                <div className="flex items-center gap-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-auth-navy text-sm font-medium text-white">
                    1
                  </span>
                  <h3 className="text-2xl font-medium text-auth-navy">Substrate Preparation</h3>
                </div>
                <span className="text-auth-navy">⌃</span>
              </div>
              <div className="flex flex-col">
                {lessons.map((lesson, i) => (
                  <div
                    key={lesson.title}
                    className={`flex items-center justify-between p-3 ${
                      lesson.state === "resume" ? "border-l-2 border-auth-navy bg-[#f4f4f4]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-auth-navy/20 text-base">
                        {lesson.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-auth-navy">{lesson.title}</span>
                        <span className="text-sm text-auth-navy">{lesson.meta}</span>
                      </div>
                    </div>
                    {lesson.state === "done" ? (
                      <span className="text-auth-navy">✓</span>
                    ) : (
                      <button className="rounded-sm bg-auth-navy px-3 py-1 text-xs font-semibold text-white">
                        Resume
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-light-border bg-[#f6f6f6] p-4">
              <div className="flex items-center gap-4">
                <span className="flex size-8 items-center justify-center rounded-full border border-light-border bg-white text-sm font-medium text-[#929292]">
                  2
                </span>
                <h3 className="text-2xl font-medium text-auth-navy">
                  Setting Materials &amp; Mortar Coverage
                </h3>
              </div>
              <span className="text-auth-navy">⌄</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-light-border bg-[#f6f6f6] p-4 opacity-60">
              <div className="flex items-center gap-4">
                <span className="flex size-8 items-center justify-center rounded-full border border-dashed border-light-border bg-[#f4f4f4] text-sm">
                  🔒
                </span>
                <h3 className="text-2xl font-medium text-auth-navy">
                  Handling &amp; Placement Techniques
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-[360px] shrink-0 flex-col gap-6">
          <div className="rounded-lg border border-light-border bg-[#f6f6f6] p-6">
            <h3 className="mb-4 text-2xl font-medium text-auth-navy">Your Progress</h3>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-2xl font-bold text-auth-navy">33%</span>
              <span className="text-sm text-[#929292]">4 of 12 lessons</span>
            </div>
            <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-[#e0e0e0]">
              <div className="h-full w-1/3 rounded-full bg-auth-navy" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wide text-[#929292]">
              Next Up
            </span>
            <div className="mt-2 flex items-center gap-3 rounded-lg bg-white p-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-auth-navy/15">
                ▶
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-auth-navy">
                  Trowel Ridges &amp; Air Evacuation
                </span>
                <span className="text-sm text-[#929292]">Module 2 · Video</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-light-border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-medium text-auth-navy">Resources</h3>
              <span className="text-auth-navy">📁</span>
            </div>
            <div className="flex flex-col gap-4">
              {resources.map((r) => (
                <div key={r.title} className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-sm bg-auth-navy/15 text-sm">
                    📄
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-auth-navy">{r.title}</span>
                    <span className="text-sm text-[#929292]">{r.meta}</span>
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
