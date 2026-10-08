import Image from "next/image";
import Link from "next/link";
import { Stepper } from "@/components/ui/Stepper";

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function CreateClassroomPage() {
  return (
    <div className="flex w-full max-w-[929px] flex-col gap-6">
      <Link
        href="/classrooms/manage"
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
        <h1 className="text-2xl font-semibold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Course Identity &amp; Structure
        </h1>
        <p className="text-base text-[#4f626e] dark:text-dak-body">
          Define the foundational details of your new training module.
        </p>
      </div>

      <Stepper steps={["Identity", "Curriculum", "Publish"]} currentStep={0} />

      <div className="flex h-[130px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-light-border bg-[#dcdcdc] dark:border-dak-border dark:bg-dak-surface">
        <Image src="/icons/new-canvas.svg" alt="" width={24} height={24} className="dark:invert" />
        <p className="text-sm text-auth-navy dark:text-dak-heading">
          <span className="font-semibold">Upload image</span>{" "}
          <span className="text-[#929292] dark:text-dak-muted">or drag and drop</span>
        </p>
        <span className="text-xs text-[#929292] dark:text-dak-muted">PDF, PNG, JPG up to 10MB</span>
      </div>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex min-w-0 flex-[2] flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(244,244,246,0.15)] dark:bg-dak-surface">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Primary Definition</h3>
              <p className="text-sm text-[#4f626e] dark:text-dak-body">
                The public-facing name and trade categorization.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-auth-navy dark:text-dak-body">Course Title *</label>
              <input
                type="text"
                placeholder="e.g., Advanced Commercial Wiring Diagnostics"
                className="h-14 w-full rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-[rgba(244,244,246,0.15)] dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-auth-navy dark:text-dak-body">Trade Category *</label>
              <div className="relative">
                <select
                  defaultValue=""
                  className="h-14 w-full appearance-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-[#929292] focus:outline-none dark:border-[rgba(244,244,246,0.15)] dark:bg-transparent dark:text-dak-muted"
                >
                  <option value="" disabled>
                    Select primary discipline...
                  </option>
                  <option>Structural Engineering</option>
                  <option>Electrical Systems</option>
                  <option>Mechanical Design</option>
                </select>
                <Image
                  src="/icons/dropdown-arrow.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 dark:invert"
                />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(244,244,246,0.15)] dark:bg-dak-surface">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Parameters</h3>
              <p className="text-sm text-[#4f626e] dark:text-dak-body">Difficulty and Levels</p>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-auth-navy dark:text-dak-body">Skill Level</label>
              <div className="flex flex-col gap-3">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`w-full rounded-md px-4 py-2 text-center text-sm font-medium ${
                      level === "Intermediate"
                        ? "bg-dak-cta text-white"
                        : "border border-light-border text-auth-navy dark:border-[rgba(244,244,246,0.3)] dark:text-dak-body"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(244,244,246,0.15)] dark:bg-dak-surface">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Context &amp; Narrative</h3>
            <p className="text-sm text-[#4f626e] dark:text-dak-body">
              Provide detailed context about the course material and your expertise.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy dark:text-dak-body">Course Description *</label>
            <textarea
              rows={4}
              placeholder="Detail the learning objectives, practical applications, and core syllabus components..."
              className="w-full resize-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 py-3 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-dak-border dark:text-dak-heading dark:placeholder:text-dak-muted"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-light-border pt-6 dark:border-[rgba(43,43,49,0.6)]">
          <Link
            href="/classrooms/manage"
            className="rounded border border-[#4f626e] px-8 py-4 text-center text-base font-medium text-auth-navy dark:border-dak-body dark:text-dak-body"
          >
            Cancel
          </Link>
          <Link
            href="/classrooms/create/curriculum"
            className="rounded bg-dak-cta px-8 py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]"
          >
            Next: Build Curriculum
          </Link>
        </div>
      </form>
    </div>
  );
}
