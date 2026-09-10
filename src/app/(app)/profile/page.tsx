import Image from "next/image";
import Link from "next/link";

const stats = [
  { icon: "📈", value: "24", note: "+12%", label: "Active Canvases" },
  { icon: "💬", value: "142", note: "+5 this week", label: "Total Products" },
  { icon: "👥", value: "890", note: "", label: "Followers" },
];

export default function ProfilePage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
          My Personal Profile
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
              <h2 className="text-2xl font-bold text-auth-navy">John Smith</h2>
              <span className="text-base text-[#929292]">Instructor</span>
              <span className="text-base text-[#929292]">johnsmith@domain.com</span>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="flex items-center gap-2 rounded-lg border border-light-border px-4 py-2.5 text-base font-medium text-auth-navy"
          >
            ✎ Edit Profile
          </Link>
        </div>
      </div>

      <div className="flex gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-1 flex-col gap-4 rounded-lg border border-light-border bg-white p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between">
              <span>{stat.icon}</span>
              {stat.note && (
                <span className="rounded-lg bg-[#f2f2f3] px-2 py-1 text-xs text-auth-navy">
                  {stat.note}
                </span>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-auth-navy">{stat.value}</p>
              <span className="text-sm text-auth-navy">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-[2] rounded-lg border border-light-border bg-white p-6">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-[#929292]">
            Business Information
          </h3>
          <p className="mb-4 border-b border-light-border pb-4 text-base text-auth-navy">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&rsquo;s standard dummy
            text ever since 1966, when designers at Letraset and James Mosley,
            the librarian at St Bride Printing Library in London, took a 1914
            Cicero.
          </p>
          <div className="flex flex-col gap-2 text-base">
            {[
              ["Industry", "Abc Tiles"],
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
            <h3 className="text-xs font-medium uppercase tracking-wide text-[#929292]">
              Active Canvases
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
    </div>
  );
}
