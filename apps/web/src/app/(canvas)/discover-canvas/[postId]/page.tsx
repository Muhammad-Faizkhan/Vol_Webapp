import Image from "next/image";
import Link from "next/link";

const toolbarIcons = ["cursor", "hand", "pen", "shapes", "text", "comment", "image"];

export default function CanvasFromPostPage() {
  return (
    <div className="flex h-dvh w-full flex-col bg-white dark:bg-dak-bg">
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-light-border bg-white px-4 py-2 dark:border-dak-border dark:bg-dak-surface sm:flex-nowrap sm:px-6 sm:py-0">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/discover"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#f2f2f3] px-4 py-2 text-sm font-medium text-auth-navy dark:bg-dak-bg dark:text-dak-heading"
          >
            <Image
              src="/icons/arrow-narrow-right.svg"
              alt=""
              width={16}
              height={16}
              className="-scale-y-100 rotate-180 dark:hidden"
            />
            <Image
              src="/icons/arrow-narrow-right-light.svg"
              alt=""
              width={16}
              height={16}
              className="hidden -scale-y-100 rotate-180 dark:block"
            />
            Back to post
          </Link>
          <span className="truncate text-base font-medium text-auth-navy dark:text-dak-heading">/ Abc Canvas</span>
        </div>

        <div className="hidden items-center gap-2 text-base font-medium text-auth-navy dark:text-dak-heading md:flex">
          <div className="flex size-8 items-center justify-center rounded-full bg-auth-navy/15 dark:bg-dak-cta/20">
            <Image src="/icons/user-rounded-small.svg" alt="" width={16} height={16} />
          </div>
          Invited by Abc Business
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="rounded-lg bg-[#efefef] px-3 py-1.5 text-sm font-semibold text-auth-navy dark:bg-dak-bg dark:text-dak-heading">
            Synced
          </span>
          <div className="flex items-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{ marginLeft: i === 0 ? 0 : -10 }}
                className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-auth-navy/70 dark:border-dak-surface dark:bg-dak-cta/70"
              >
                <Image src="/icons/user-rounded-small.svg" alt="" width={16} height={16} />
              </div>
            ))}
            <div
              style={{ marginLeft: -10 }}
              className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#e0dfe0] text-xs font-semibold text-auth-navy dark:border-dak-surface dark:bg-dak-border dark:text-dak-heading"
            >
              3+
            </div>
          </div>
        </div>
      </header>

      {/* Canvas surface intentionally kept on its own light "drafting paper" palette in both themes,
          matching the pattern established for the other canvas-editor screens. */}
      <div className="relative flex-1 overflow-hidden bg-[#f2f0ec]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#e3e0da 1px,transparent 1px),linear-gradient(90deg,#e3e0da 1px,transparent 1px)",
            backgroundSize: "68px 68px",
          }}
        />

        <div className="absolute left-10 top-1/2 flex w-20 -translate-y-1/2 flex-col items-center gap-3 rounded-xl border border-light-border bg-[#f8f9ff] p-2 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]">
          {toolbarIcons.map((tool, i) => (
            <div key={tool} className="flex w-full flex-col items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-xl text-auth-navy ${i === 0 ? "bg-auth-navy/20" : ""}`}
              >
                <div className="size-4 rounded-sm border-2 border-auth-navy" />
              </div>
              {(i === 1 || i === 4) && <div className="h-px w-8 bg-light-border" />}
            </div>
          ))}
        </div>

        <div className="absolute left-40 right-10 top-10 bottom-10">
          <div className="absolute left-[170px] top-[120px] h-[399px] w-[591px] border-2 border-auth-navy bg-[rgba(251,251,250,0.69)]">
            <span className="absolute -top-8 left-10 whitespace-nowrap rounded bg-[#f2f0ec] px-4 py-1 text-xs font-medium text-auth-navy">
              Abc Canvas. 3.9 M x 3.0 M
            </span>

            <div className="absolute left-0 top-0 h-[220px] w-[320px] bg-[#e3e3e3]">
              <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-auth-navy">
                <Image src="/illustrations/auth-placeholder.svg" alt="" width={28} height={28} />
              </div>
              <span className="absolute bottom-3 left-3 whitespace-nowrap rounded bg-auth-navy px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                600×1200 · True scale
              </span>
            </div>

            <div className="absolute left-[390px] top-[92px] flex size-[100px] items-center justify-center rounded-full border border-[#c9c8c8] bg-[#e0dfe0]" />
            <span className="absolute left-[390px] top-[202px] w-[100px] text-center text-sm font-medium text-auth-navy">
              420 MM
            </span>
            <span className="absolute left-[400px] top-[228px] whitespace-nowrap rounded bg-auth-navy px-3 py-1 text-xs font-medium text-white">
              Sarah J.
            </span>

            <div className="absolute left-5 top-[320px] w-[262px]">
              <div className="h-[21px] bg-[#cfd8dd]" />
              <span className="mt-1 block text-center text-sm font-medium text-auth-navy">
                Linear Drain 900 MM
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-auth-navy shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
          <span>−</span>
          <span>70%</span>
          <span>+</span>
          <span className="text-light-border">|</span>
          <span>Fit</span>
        </div>
      </div>
    </div>
  );
}
