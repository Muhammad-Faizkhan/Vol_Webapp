import Image from "next/image";
import Link from "next/link";

const members = [
  { name: "Alex Morgan", email: "alex.morgan@example.com", role: "Collaborator", editable: true },
  { name: "Sarah Lewis", email: "sarah.lewis@example.com", role: "Viewer", editable: true },
  { name: "John Smith", email: "You", role: "Admin", editable: false },
];

const roleDefinitions = [
  { role: "Viewer", desc: "View only access to workspaces and assets." },
  { role: "Collaborator", desc: "View and Edit capabilities for all active projects." },
  { role: "Admin", desc: "Full management, user roles." },
];

export default async function InviteTeamMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <Link
          href={`/workspaces/${id}/members`}
          className="flex items-center gap-1.5 text-base font-medium text-auth-navy"
        >
          <Image
            src="/icons/arrow-narrow-right.svg"
            alt=""
            width={20}
            height={20}
            className="-scale-y-100 rotate-180"
          />
          Back
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
          Invite Team Members
        </h1>
        <p className="text-base text-auth-slate">
          Add collaborators to your workspace and assign their permission levels.
        </p>
      </div>

      <div className="flex gap-6">
        <div className="flex max-w-[560px] flex-1 flex-col gap-6">
          <div className="relative">
            <Image
              src="/icons/search.svg"
              alt=""
              width={15}
              height={15}
              className="absolute left-[17px] top-1/2 -translate-y-1/2"
            />
            <input
              type="search"
              placeholder="Search by email"
              className="h-14 w-full rounded-lg border border-light-border bg-white pl-[41px] pr-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none"
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-light-border">
            <div className="bg-[#e7e8e9] px-6 py-3 text-sm font-medium tracking-[0.28px] text-auth-navy">
              Selected Members ({members.length})
            </div>
            <div className="flex flex-col bg-white">
              {members.map((member, i) => (
                <div
                  key={member.name}
                  className={`flex items-center gap-3 p-4 ${i !== 0 ? "border-t border-light-border" : ""}`}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-auth-navy/15">
                    <Image src="/icons/user-rounded-small.svg" alt="" width={20} height={20} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-auth-navy">{member.name}</span>
                    <span className="text-sm text-[#929292]">{member.email}</span>
                  </div>
                  {member.editable ? (
                    <div className="relative">
                      <select
                        defaultValue={member.role}
                        className="h-10 appearance-none rounded-lg border border-light-border bg-[#f2f2f3] py-2 pl-3 pr-8 text-sm text-auth-navy focus:outline-none"
                      >
                        <option>Viewer</option>
                        <option>Collaborator</option>
                        <option>Admin</option>
                      </select>
                      <Image
                        src="/icons/dropdown-arrow.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                      />
                    </div>
                  ) : (
                    <span className="rounded-lg border border-light-border px-3 py-1.5 text-sm text-auth-navy">
                      {member.role}
                    </span>
                  )}
                  <button aria-label="Remove" className="text-auth-navy">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-light-border bg-white p-6">
            <span className="text-base font-medium text-auth-navy">Invite via link</span>
            <p className="text-sm text-[#929292]">
              Anyone with this link canrequest to join.
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value="https://engilink.pro/inv/w/x7y9z"
                className="h-11 flex-1 rounded-lg border border-light-border bg-[#f8f9ff] px-3 text-sm text-auth-navy focus:outline-none"
              />
              <button className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-light-border bg-[#f2f2f3] text-auth-navy">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" />
                  <path
                    d="M3 10.5V3.5C3 2.94772 3.44772 2.5 4 2.5H10.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <button className="h-14 rounded-2xl bg-auth-slate text-base font-medium text-white shadow-[0px_8px_16px_rgba(99,117,139,0.4)]">
            Save Changes
          </button>
        </div>

        <div className="w-[400px] shrink-0 rounded-lg border border-light-border bg-white p-6">
          <h3 className="mb-4 text-2xl font-semibold text-auth-navy">Role Definitions</h3>
          <div className="flex flex-col gap-4">
            {roleDefinitions.map((r) => (
              <div key={r.role} className="flex flex-col gap-1">
                <span className="text-base font-semibold text-auth-navy">{r.role}</span>
                <p className="text-base text-auth-slate">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
