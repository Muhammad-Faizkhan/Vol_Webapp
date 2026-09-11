import Image from "next/image";

const members = [
  { name: "Alex Morgan", email: "Alexmorgan@domain.com", type: "Instructor", role: "Admin", you: false },
  { name: "Mark Williams", email: "markwilliams@domain.com", type: "Contractor", role: "Viewer", you: false },
  { name: "John Smith", email: "You", type: "Contractor", role: "Collaborator", you: true },
  { name: "Mark Williams", email: "markwilliams@domain.com", type: "Contractor", role: "Collaborator", you: false },
];

export default function WorkspaceMembersPage() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="w-full overflow-hidden rounded-2xl border border-light-border dark:border-dak-border">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="flex bg-app-dark-surface px-6 py-4 text-base text-white">
              <span className="w-[300px] shrink-0 whitespace-nowrap">Member</span>
              <span className="w-[300px] shrink-0 whitespace-nowrap">Profile Type</span>
              <span className="whitespace-nowrap">Action</span>
            </div>
            <div className="flex flex-col bg-white dark:bg-dak-surface">
              {members.map((member, i) => (
                <div
                  key={i}
                  className={`flex items-center px-6 py-4 ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}
                >
                  <div className="flex w-[300px] shrink-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-auth-navy/15 dark:bg-dak-cta/20">
                      <Image
                        src="/icons/user-rounded-small.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="invert dark:invert-0"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{member.name}</span>
                      <span className="truncate text-sm text-[#929292] dark:text-dak-muted">{member.email}</span>
                    </div>
                  </div>
                  <span className="w-[300px] shrink-0 truncate text-base text-[#929292] dark:text-dak-muted">{member.type}</span>
                  <button
                    className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm ${
                      member.role === "Admin"
                        ? "bg-app-dark-surface text-white"
                        : "border border-light-border text-[#929292] dark:border-dak-border dark:text-dak-heading"
                    }`}
                  >
                    {member.role}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[463px] rounded-lg border border-light-border bg-white p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-dak-border dark:bg-dak-surface">
        <h2 className="mb-6 text-2xl font-semibold text-auth-navy dark:text-dak-heading">Visibility</h2>
        <div className="flex flex-col gap-6">
          <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-light-border p-4 has-checked:border-auth-navy dark:border-dak-border dark:has-checked:border-dak-line">
            <input
              type="radio"
              name="workspace-visibility"
              defaultChecked
              className="mt-2 size-5 shrink-0 accent-auth-navy dark:accent-dak-cta"
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/globe.svg"
                  alt=""
                  width={17}
                  height={17}
                  className="invert dark:invert-0"
                />
                <span className="text-base font-medium tracking-[0.28px] text-auth-navy dark:text-dak-heading">
                  Public to explore
                </span>
              </div>
              <p className="text-sm text-[#45464d] dark:text-dak-body">
                Your profile, projects, and credentials will be visible to all
                platform users.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-light-border p-4 has-checked:border-auth-navy dark:border-dak-border dark:has-checked:border-dak-line">
            <input
              type="radio"
              name="workspace-visibility"
              className="mt-2 size-5 shrink-0 accent-auth-navy dark:accent-dak-cta"
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/lock-small.svg"
                  alt=""
                  width={14}
                  height={18}
                  className="dark:brightness-0 dark:invert"
                />
                <span className="text-base font-medium tracking-[0.28px] text-auth-navy dark:text-dak-heading">
                  Private to members
                </span>
              </div>
              <p className="text-sm text-[#45464d] dark:text-dak-body">
                You can only collaborate via direct invites from existing
                workspaces or verified connections.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
