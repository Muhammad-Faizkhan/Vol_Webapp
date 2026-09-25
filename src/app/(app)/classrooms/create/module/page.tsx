import Image from "next/image";
import Link from "next/link";

const PLANNER_ITEMS = [
  { title: "1. Introduction to Hooks", meta: "Video • 12 mins", icon: "/icons/play.svg" },
  { title: "2. Component Lifecycle Diagram", meta: "Interactive Diagram", icon: "/icons/new-canvas.svg" },
  { title: "3. Knowledge Check: State Management", meta: "Quiz • 5 Questions", icon: "/icons/checkmark-circle.svg" },
];

export default function CreateModulePage() {
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
        <h1 className="text-2xl font-semibold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Create New Module
        </h1>
        <p className="text-base text-[#4f626e] dark:text-dak-body">
          Add a new curriculum item and place it within your course structure.
        </p>
      </div>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(198,198,205,0.4)] dark:bg-dak-surface">
          <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Module Identity</h3>

          <button
            type="button"
            className="flex flex-col items-center gap-1 rounded border-2 border-dashed border-light-border p-6 dark:border-[rgba(198,198,205,0.4)]"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#f8f9ff]">
              <Image src="/icons/plus-small.svg" alt="" width={14} height={14} />
            </span>
            <span className="pt-1 text-sm font-medium text-auth-navy dark:text-dak-heading">Add Curriculum Item</span>
            <span className="text-sm text-[#4f626e] dark:text-dak-body">Video, Document, Diagram, or Assessment</span>
          </button>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Placement</label>
              <div className="relative">
                <select
                  defaultValue="Module 4"
                  className="h-12 w-full appearance-none rounded border border-light-border px-4 text-sm text-[#929292] focus:outline-none dark:border-dak-heading dark:bg-transparent dark:text-dak-muted"
                >
                  <option>Module 4</option>
                  <option>Module 3</option>
                  <option>Module 2</option>
                </select>
                <Image
                  src="/icons/dropdown-arrow.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 dark:invert"
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Estimate Duration</label>
              <input
                type="text"
                defaultValue="45mins"
                className="h-12 w-full rounded border border-light-border px-4 text-sm text-[#929292] focus:outline-none dark:border-dak-heading dark:bg-transparent dark:text-dak-muted"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Description</label>
            <textarea
              rows={3}
              placeholder="Provide a brief overview of the module content..."
              className="w-full resize-none rounded border border-light-border px-4 py-3 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-heading dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-lg border border-light-border bg-white p-6 dark:border-[rgba(198,198,205,0.4)] dark:bg-dak-surface">
          <h3 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Curriculum Planner</h3>
          <div className="flex flex-col gap-3">
            {PLANNER_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded border border-light-border bg-[#f8f9ff] p-4 dark:border-[rgba(198,198,205,0.4)] dark:bg-dak-border"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded bg-[rgba(79,98,110,0.1)] dark:bg-[rgba(255,255,255,0.1)]">
                  <Image src={item.icon} alt="" width={20} height={20} className="dark:invert" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">
                    {item.title}
                  </span>
                  <span className="truncate text-sm text-[#4f626e] dark:text-dak-body">{item.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/classrooms/create/curriculum"
          className="flex items-center justify-center rounded-lg bg-dak-cta px-8 py-4 text-center text-base font-medium text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]"
        >
          Add Module
        </Link>
      </form>
    </div>
  );
}
