import Image from "next/image";
import Link from "next/link";

const tags = ["Thermal", "Simulation", "Q3 Roadmap", "Needs Review"];

export default function PostDetailPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Link href="/discover" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
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
        Back to feed
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Abc Title</h1>
        <p className="text-base text-auth-navy dark:text-dak-body">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&rsquo;s standard dummy
          text ever since 1966, when designers at Letraset and Ja.
        </p>
      </div>

      <Link
        href="/discover-canvas/1"
        className="flex w-fit items-center gap-2 rounded-lg bg-auth-navy px-4 py-2.5 text-base font-medium text-white dark:bg-dak-cta"
      >
        ⧉ Open Canvas
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-col lg:flex-[2]">
          <div className="flex h-[380px] items-center justify-center rounded-t-md border border-b-0 border-light-border bg-[#c2c2c2] dark:border-dak-border dark:bg-dak-bg">
            <Image src="/illustrations/auth-placeholder.svg" alt="" width={73} height={73} />
          </div>
          <div className="flex gap-6 rounded-b-md border border-t-0 border-light-border bg-white px-4 py-3 text-sm font-medium text-auth-navy dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading">
            <span className="flex items-center gap-1.5">♡ 248 Likes</span>
            <span className="flex items-center gap-1.5">💬 42 Comments</span>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[360px]">
          <div className="rounded-lg border border-light-border bg-white p-5 dark:border-dak-border dark:bg-dak-surface">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-[#929292] dark:text-dak-muted">
              Author
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-auth-navy/15 dark:bg-dak-cta/20">
                <Image src="/icons/user-rounded-small.svg" alt="" width={20} height={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-auth-navy dark:text-dak-heading">Mark Williams</span>
                <span className="text-sm text-[#929292] dark:text-dak-muted">Technical Lead, Propulsion</span>
              </div>
            </div>
            <Link href="/profile" className="mt-3 block text-sm font-medium text-dak-cta">
              View Profile →
            </Link>
          </div>

          <div className="rounded-lg border border-light-border bg-white p-5 dark:border-dak-border dark:bg-dak-surface">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#929292] dark:text-dak-muted">
              Details
            </h3>
            <div className="flex flex-col">
              {[
                ["Version", "3.0.4 (Latest)"],
                ["Last Modified", "2 hours ago"],
                ["Project", "Project Orion"],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex justify-between py-2.5 text-sm text-auth-navy dark:text-dak-body ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}
                >
                  <span>{label}</span>
                  <span className="font-medium text-auth-navy dark:text-dak-heading">{value}</span>
                </div>
              ))}
            </div>
            <h3 className="mb-3 mt-4 text-xs font-medium uppercase tracking-wide text-[#929292] dark:text-dak-muted">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl border border-light-border bg-[#f2f2f3] px-3 py-1 text-sm text-auth-navy dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Add a comment..."
        className="h-14 w-full rounded-lg border border-light-border bg-white px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading dark:placeholder:text-dak-muted lg:max-w-[66.6%]"
      />
    </div>
  );
}
