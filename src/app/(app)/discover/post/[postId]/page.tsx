import Image from "next/image";
import Link from "next/link";

const tags = ["Thermal", "Simulation", "Q3 Roadmap", "Needs Review"];

export default function PostDetailPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Link href="/discover" className="flex items-center gap-1.5 text-base font-medium text-auth-navy">
        <Image
          src="/icons/arrow-narrow-right.svg"
          alt=""
          width={20}
          height={20}
          className="-scale-y-100 rotate-180"
        />
        Back to feed
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-auth-navy">Abc Title</h1>
        <p className="text-base text-auth-navy">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&rsquo;s standard dummy
          text ever since 1966, when designers at Letraset and Ja.
        </p>
      </div>

      <Link
        href="/discover-canvas/1"
        className="flex w-fit items-center gap-2 rounded-lg bg-auth-navy px-4 py-2.5 text-base font-medium text-white"
      >
        ⧉ Open Canvas
      </Link>

      <div className="flex gap-6">
        <div className="flex flex-[2] flex-col">
          <div className="flex h-[380px] items-center justify-center rounded-t-md border border-b-0 border-light-border bg-[#c2c2c2]">
            <Image src="/illustrations/auth-placeholder.svg" alt="" width={73} height={73} />
          </div>
          <div className="flex gap-6 rounded-b-md border border-t-0 border-light-border bg-white px-4 py-3 text-sm font-medium text-auth-navy">
            <span className="flex items-center gap-1.5">♡ 248 Likes</span>
            <span className="flex items-center gap-1.5">💬 42 Comments</span>
          </div>
        </div>

        <div className="flex w-[360px] shrink-0 flex-col gap-4">
          <div className="rounded-lg border border-light-border bg-white p-5">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-[#929292]">
              Author
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-auth-navy/15">
                <Image src="/icons/user-rounded-small.svg" alt="" width={20} height={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-auth-navy">Mark Williams</span>
                <span className="text-sm text-[#929292]">Technical Lead, Propulsion</span>
              </div>
            </div>
            <Link href="/profile" className="mt-3 block text-sm font-medium text-auth-navy">
              View Profile →
            </Link>
          </div>

          <div className="rounded-lg border border-light-border bg-white p-5">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#929292]">
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
                  className={`flex justify-between py-2.5 text-sm text-auth-navy ${i !== 0 ? "border-t border-light-border" : ""}`}
                >
                  <span>{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <h3 className="mb-3 mt-4 text-xs font-medium uppercase tracking-wide text-[#929292]">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl border border-light-border bg-[#f2f2f3] px-3 py-1 text-sm text-auth-navy"
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
        className="h-14 w-full max-w-[calc(66.6%)] rounded-lg border border-light-border bg-white px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none"
      />
    </div>
  );
}
