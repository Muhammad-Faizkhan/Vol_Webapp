import Image from "next/image";
import Link from "next/link";
import { Stepper } from "@/components/ui/Stepper";

const MODULES = [
  {
    title: "Fundamentals of Dynamic Loading",
    lessons: 6,
    open: true,
    preview: ["1.1 Introduction to Harmonic Motion", "1.2 Damping Mechanisms in Steel"],
    more: 4,
  },
  { title: "Seismic Response Analysis", lessons: 8, open: false, preview: [], more: 0 },
  { title: "Fatigue & Fracture Mechanics", lessons: 5, open: false, preview: [], more: 0 },
  { title: "Capstone Structural Review", lessons: 4, open: false, preview: [], more: 0 },
];

export default function ReviewAndPublishPage() {
  return (
    <div className="flex w-full max-w-[929px] flex-col gap-6">
      <Link
        href="/classrooms/create/curriculum"
        className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading"
      >
        <Image
          src="/icons/arrow-narrow-right.svg"
          alt=""
          width={20}
          height={20}
          className="-scale-y-100 rotate-180 dark:invert"
        />
        Back
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Review &amp; Publish
        </h1>
        <p className="text-base text-[#4f626e] dark:text-dak-body">
          Final structural overview before deployment to the student portal. Verify all components and technical
          requirements.
        </p>
      </div>

      <Stepper steps={["Identity", "Curriculum", "Publish"]} currentStep={2} />

      <div className="flex flex-col gap-6 rounded-lg border border-light-border bg-white p-6 dark:border-0 dark:bg-dak-surface">
        <div className="flex flex-col gap-1 border-b border-light-border pb-4 dark:border-[rgba(43,43,49,0.6)]">
          <h3 className="text-2xl font-medium text-auth-navy dark:text-dak-heading">Course Identity</h3>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex h-[179px] w-full shrink-0 items-center justify-center rounded-lg border border-light-border bg-[#eaeaea] dark:border-[rgba(198,198,205,0.2)] dark:bg-[rgba(244,244,246,0.06)] sm:w-[154px]">
            <Image src="/icons/image-insert.svg" alt="" width={40} height={40} className="opacity-60 dark:invert" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h4 className="text-2xl font-normal text-auth-navy dark:text-dak-heading">
              Advanced Structural Analysis: Steel Dynamics
            </h4>
            <p className="text-sm text-[#4f626e] dark:text-dak-body">
              This course delves into the non-linear behavior of structural steel under dynamic loading conditions.
              Designed for senior engineering students, it covers seismic response and fatigue mechanics.
            </p>
            <div className="flex gap-6 pt-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#4f626e] dark:text-dak-body">
                  Target Audience
                </span>
                <span className="flex items-center gap-1.5 text-sm text-auth-navy dark:text-dak-heading">
                  <span className="size-2 rounded-full bg-auth-navy dark:bg-white" />
                  Senior / Grad
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#4f626e] dark:text-dak-body">
                  Est. Duration
                </span>
                <span className="flex items-center gap-1.5 text-sm text-auth-navy dark:text-dak-heading">
                  <Image src="/icons/clock-small.svg" alt="" width={13} height={13} />
                  12 Weeks (40 hrs)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-lg border border-light-border bg-white p-6 dark:border-0 dark:bg-dak-surface">
        <div className="flex items-center justify-between gap-4 border-b border-light-border pb-4 dark:border-[rgba(43,43,49,0.6)]">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-normal text-auth-navy dark:text-dak-heading">Curriculum Topology</h3>
            <p className="text-sm text-[#4f626e] dark:text-dak-body">Structural hierarchy of modules and lessons.</p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">4</span>
              <span className="text-xs font-semibold uppercase text-[#4f626e] dark:text-dak-body">Modules</span>
            </div>
            <div className="h-8 w-px bg-[rgba(43,43,49,0.4)]" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">23</span>
              <span className="text-xs font-semibold uppercase text-[#4f626e] dark:text-dak-body">Lessons</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {MODULES.map((module, i) => (
            <div
              key={module.title}
              className="overflow-hidden rounded border border-light-border dark:border-[rgba(244,244,246,0.15)]"
            >
              <div className="flex items-center justify-between gap-4 bg-[#f8f9ff] px-4 py-3 dark:bg-dak-border">
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/chevron-down-small.svg"
                    alt=""
                    width={12}
                    height={12}
                    className={`dark:invert ${module.open ? "" : "-rotate-90"}`}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#4f626e] dark:text-dak-body">
                      Module {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-auth-navy dark:text-dak-heading">
                      {module.title}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 rounded bg-[#dcdcdc] px-2 py-1 text-xs font-semibold text-auth-navy dark:bg-[#45464d] dark:text-dak-heading">
                  {module.lessons} Lessons
                </span>
              </div>
              {module.open && (
                <div className="flex flex-col gap-2 bg-white px-6 py-3 dark:bg-dak-border">
                  {module.preview.map((lesson) => (
                    <span key={lesson} className="text-sm text-[#4f626e] dark:text-dak-body">
                      {lesson}
                    </span>
                  ))}
                  {module.more > 0 && (
                    <span className="text-sm italic text-[#4f626e] dark:text-dak-body">
                      ... {module.more} more lessons
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/classrooms/1"
        className="flex items-center justify-center rounded-lg bg-dak-cta px-8 py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]"
      >
        Publish Course
      </Link>
    </div>
  );
}
