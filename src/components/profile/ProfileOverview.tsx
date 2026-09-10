import Image from "next/image";
import Link from "next/link";

const tradeInterests = ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"];

const classrooms = [
  { name: "Lorem Ipsum Class", sub: "Abc Class", tags: ["10 Enrolled", "Public Preview"] },
];

export function ProfileOverview({ persona }: { persona: "individual" | "business" }) {
  const isBusiness = persona === "business";

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
          {isBusiness ? "My Personal Profile" : "Edit Profile"}
        </h1>
        <p className="text-base text-auth-slate">Manage your profile</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-light-border bg-white">
        <div className="flex h-[190px] items-center justify-center bg-[#b3b3b3]">
          <Image src="/illustrations/auth-placeholder.svg" alt="" width={28} height={28} />
        </div>
        <div className="relative flex items-end justify-between p-6">
          <div className="flex items-end gap-4">
            <div className="absolute -top-14 left-6 flex size-28 items-center justify-center rounded-full border-4 border-white bg-auth-navy">
              <Image src="/icons/user-rounded-small.svg" alt="" width={32} height={32} />
            </div>
            <div className="ml-32 flex flex-col">
              <h2 className="text-2xl font-bold text-auth-navy">
                {isBusiness ? "Abc Business" : "John Smith"}
              </h2>
              <span className="text-base text-[#929292]">johnsmith@domain.com</span>
            </div>
          </div>
          <Link
            href={isBusiness ? "/profile/edit-business" : "/profile/edit"}
            className="flex items-center gap-2 rounded-lg border border-light-border px-4 py-2.5 text-base font-medium text-auth-navy"
          >
            ✎ Edit Profile
          </Link>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-[2] rounded-lg border border-light-border bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-auth-navy">
            ⓘ {isBusiness ? "Professional Bio" : "Bio"}
          </h3>
          <p className="mb-4 border-b border-light-border pb-4 text-base text-auth-navy">
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
                <span className="text-auth-navy">{label}</span>
                <span className="font-medium text-auth-navy">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 rounded-lg border border-light-border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-wide text-auth-navy">
              ⓘ Active Canvases
            </h3>
            <Link href="/workspaces" className="text-sm font-medium text-auth-navy">
              View All
            </Link>
          </div>
          <Link
            href="/canvas/1"
            className="block overflow-hidden rounded-lg border border-light-border"
          >
            <div className="flex h-[130px] items-center justify-center bg-auth-navy">
              <Image src="/illustrations/auth-placeholder.svg" alt="" width={28} height={28} />
            </div>
            <div className="bg-white p-4">
              <p className="text-base font-medium text-auth-navy">Abc Canvas</p>
              <span className="text-sm text-[#929292]">Lorem Ipsum canvas details</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-[2] rounded-lg border border-light-border bg-white p-6">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-auth-navy">
            ⊙ Trade Interest
          </h3>
          <div className="flex flex-wrap gap-3">
            {tradeInterests.map((tag, i) => (
              <span
                key={i}
                className="rounded-lg bg-[#f2f2f3] px-4 py-2 text-sm text-auth-navy"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 rounded-lg border border-light-border bg-white p-6">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-auth-navy">
            🎓 Active Classrooms
          </h3>
          <div className="flex flex-col gap-3">
            {classrooms.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-lg border border-light-border p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-auth-navy">
                  <Image src="/illustrations/auth-placeholder.svg" alt="" width={18} height={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-auth-navy">{c.name}</span>
                  <span className="text-xs text-[#929292]">{c.sub}</span>
                  <div className="flex gap-2">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm border border-light-border bg-white px-2 py-0.5 text-[10px] text-auth-navy"
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
