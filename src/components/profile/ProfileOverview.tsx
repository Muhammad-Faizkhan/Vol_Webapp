import Image from "next/image";
import Link from "next/link";

const tradeInterests = ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"];

const classrooms = [
  { name: "Lorem Ipsum Class", sub: "Abc Class", tags: ["10 Enrolled", "Public Preview"] },
  { name: "Lorem Ipsum Class", sub: "Abc Class", tags: ["10 Enrolled", "Public Preview"] },
];

export function ProfileOverview({ persona }: { persona: "individual" | "business" }) {
  const isBusiness = persona === "business";

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          {isBusiness ? "My Business Profile" : "My Personal Profile"}
        </h1>
        <p className="text-base text-auth-slate dark:text-dak-body">Manage your profile</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-light-border bg-white dark:border-dak-border dark:bg-dak-surface">
        <div className="flex h-[190px] items-center justify-center bg-[#b3b3b3] dark:bg-dak-bg">
          <Image src="/illustrations/auth-placeholder.svg" alt="" width={28} height={28} />
        </div>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-white dark:border-dak-surface sm:-mt-14 sm:size-28">
              <Image src={isBusiness ? "/avatars/avatar-3.jpg" : "/avatars/avatar-2.jpg"} alt="" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-auth-navy dark:text-dak-heading">
                {isBusiness ? "Abc Business" : "John Smith"}
              </h2>
              <span className="text-base text-[#929292] dark:text-dak-muted">johnsmith@domain.com</span>
            </div>
          </div>
          <Link
            href={isBusiness ? "/profile/edit-business" : "/profile/edit"}
            className="flex w-fit items-center gap-2 rounded-lg border border-light-border px-4 py-2.5 text-base font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading"
          >
            ✎ Edit Profile
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface lg:flex-[2]">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-auth-navy dark:text-dak-heading">
            ⓘ {isBusiness ? "Professional Bio" : "Bio"}
          </h3>
          <p className="mb-4 border-b border-light-border pb-4 text-base text-auth-navy dark:border-dak-border dark:text-dak-body">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&rsquo;s standard dummy
            text ever since 1966, when designers at Letraset and James
            Mosley, the librarian at St Bride Printing Library in London,
            took a 1914 Cicero.
          </p>
          <div className="flex flex-col gap-2 text-base">
            {[
              ["Location", "Seattle, WA"],
              ["Member Since", "2021"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-auth-navy dark:text-dak-body">{label}</span>
                <span className="font-medium text-auth-navy dark:text-dak-heading">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface lg:flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-wide text-auth-navy dark:text-dak-heading">
              ⓘ Active Canvases
            </h3>
            <Link href="/workspaces" className="text-sm font-medium text-dak-cta">
              View All
            </Link>
          </div>
          <Link
            href="/canvas/1"
            className="block overflow-hidden rounded-lg border border-light-border dark:border-dak-border"
          >
            <div className="relative h-[130px] overflow-hidden bg-auth-navy dark:bg-dak-surface">
              <Image src="/illustrations/canvas-thumb-mortar-pattern.jpg" alt="" fill className="object-cover" />
            </div>
            <div className="bg-white p-4 dark:bg-dak-surface">
              <p className="text-base font-medium text-auth-navy dark:text-dak-heading">Abc Canvas</p>
              <span className="text-sm text-[#929292] dark:text-dak-muted">Lorem Ipsum canvas details</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface lg:flex-[2]">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-auth-navy dark:text-dak-heading">
            ⊙ Trade Interest
          </h3>
          <div className="flex flex-wrap gap-3">
            {tradeInterests.map((tag, i) => (
              <span
                key={i}
                className="rounded-lg bg-[#f2f2f3] px-4 py-2 text-sm text-auth-navy dark:bg-dak-bg dark:text-dak-heading"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface lg:flex-1">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-auth-navy dark:text-dak-heading">
            🎓 Active Classrooms
          </h3>
          <div className="flex flex-col gap-3">
            {classrooms.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-light-border p-3 dark:border-dak-border">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-sm">
                  <Image src="/illustrations/classroom-thumb-engineers.jpg" alt="" fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">{c.name}</span>
                  <span className="text-xs text-[#929292] dark:text-dak-muted">{c.sub}</span>
                  <div className="flex gap-2">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm border border-light-border bg-white px-2 py-0.5 text-[10px] text-auth-navy dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
