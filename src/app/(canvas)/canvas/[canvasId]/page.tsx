import Image from "next/image";
import Link from "next/link";

const toolbarIcons = ["cursor", "hand", "pen", "shapes", "text", "comment", "image"];

const products = [
  { name: "Abc Product", by: "By Abc Distributor", qty: "x2" },
  { name: "Abc Product", by: "By Abc Distributor", qty: "x2" },
  { name: "Abc Product", by: "By Abc Distributor", qty: "x2" },
];

export default function CanvasEditorPage() {
  return (
    <div className="flex h-dvh w-full flex-col bg-white">
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-light-border bg-white px-4 py-2 dark:border-dak-border dark:bg-dak-bg sm:flex-nowrap sm:px-6 sm:py-0">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/workspaces/1/canvases"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f2f2f3] text-auth-navy dark:bg-dak-cta dark:text-white"
          >
            <Image
              src="/icons/arrow-narrow-right.svg"
              alt=""
              width={18}
              height={18}
              className="-scale-y-100 rotate-180 dark:invert"
            />
          </Link>
          <span className="hidden truncate text-base text-auth-navy dark:text-dak-heading sm:inline">Lorem Ipsum Workspace</span>
          <span className="truncate text-base font-medium text-auth-navy dark:text-dak-heading">/ Abc Canvas</span>
        </div>

        <div className="hidden items-center gap-2 text-base font-medium text-auth-navy dark:text-dak-body md:flex">
          <div className="flex size-8 items-center justify-center rounded-full bg-auth-navy/15 dark:bg-dak-cta/20">
            <Image src="/icons/user-rounded-small.svg" alt="" width={16} height={16} />
          </div>
          Invited by Abc Business
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="rounded-lg bg-[#efefef] px-3 py-1.5 text-sm font-semibold text-auth-navy dark:bg-dak-surface dark:text-dak-heading">
            Synced
          </span>
          <div className="flex items-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{ marginLeft: i === 0 ? 0 : -10 }}
                className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-auth-navy/70 dark:border-dak-bg dark:bg-dak-cta/70"
              >
                <Image src="/icons/user-rounded-small.svg" alt="" width={16} height={16} />
              </div>
            ))}
            <div
              style={{ marginLeft: -10 }}
              className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#e0dfe0] text-xs font-semibold text-auth-navy dark:border-dak-bg dark:bg-dak-surface dark:text-dak-heading"
            >
              3+
            </div>
          </div>
        </div>
      </header>

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

        <div className="absolute left-40 right-[520px] top-10 bottom-10">
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
            <span className="absolute left-5 top-[236px] whitespace-nowrap rounded bg-auth-navy px-3 py-1 text-xs font-medium text-white">
              John S.
            </span>

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

          <div className="absolute right-[60px] top-20 w-[163px] rounded-bl-lg border border-[#80939e] bg-[#f4f4f4] p-3.5 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-auth-navy">
              Note - Mark
            </p>
            <p className="text-xs leading-snug text-auth-navy">
              Confirm substrate prep here before laying the initial row.
              Tolerance is extremely tight.
            </p>
          </div>
          <span className="absolute right-[70px] top-[192px] whitespace-nowrap rounded bg-auth-navy px-3 py-1 text-xs font-medium text-white">
            Mark W.
          </span>
        </div>

        <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-auth-navy shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
          <span>−</span>
          <span>70%</span>
          <span>+</span>
          <span className="text-light-border">|</span>
          <span>Fit</span>
        </div>
        <div className="absolute bottom-6 right-[420px] flex items-center gap-2 rounded-lg bg-auth-navy px-4 py-2 text-sm text-white">
          <span className="size-2 rounded-full bg-[#22c55e]" />
          3 Collaboratives Live
        </div>

        <aside className="absolute right-0 top-0 flex h-full w-[400px] flex-col gap-6 overflow-y-auto bg-[#d9d9d9] p-6 dark:bg-dak-bg">
          <div>
            <h3 className="mb-3 text-base font-semibold text-auth-navy dark:text-dak-heading">
              Selected Product
            </h3>
            <div className="overflow-hidden rounded-lg border border-light-border bg-[#f8f9ff] dark:border-dak-border dark:bg-dak-surface">
              <div className="flex h-[130px] items-center justify-center bg-auth-navy dark:bg-dak-surface">
                <Image src="/illustrations/auth-placeholder.svg" alt="" width={40} height={40} />
              </div>
              <div className="p-4">
                <p className="text-base font-semibold text-auth-navy dark:text-dak-heading">Lorem Ipsum Product</p>
                <p className="text-sm text-[#929292] dark:text-dak-muted">By Abc Distributor</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl bg-[#f8f9ff] p-4 dark:bg-dak-surface">
            {[
              ["True Size", "600×1200 MM"],
              ["Thickness", "9 mm"],
              ["Coverage", "1.44 m² / box"],
              ["Rotation", "0°"],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={`flex justify-between py-2.5 text-sm text-auth-navy dark:text-dak-body ${i !== 3 ? "border-b border-light-border dark:border-dak-border" : ""}`}
              >
                <span>{label}</span>
                <span className="font-medium dark:text-dak-heading">{value}</span>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-light-border bg-white dark:border-dak-border dark:bg-dak-surface">
            <div className="bg-[#cdced0] px-4 py-3 text-sm font-medium text-auth-navy dark:bg-dak-bg dark:text-dak-heading">
              Products on this canvas · 14
            </div>
            <div className="flex flex-col gap-4 p-4">
              {products.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-light-border bg-[#f8f9ff] px-4 py-3 dark:border-dak-border dark:bg-dak-bg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-8 items-center justify-center rounded-sm bg-auth-navy dark:bg-dak-cta">
                      <Image src="/illustrations/auth-placeholder.svg" alt="" width={16} height={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">{p.name}</span>
                      <span className="text-xs text-[#929292] dark:text-dak-muted">{p.by}</span>
                    </div>
                  </div>
                  <span className="text-sm text-auth-navy dark:text-dak-body">{p.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
