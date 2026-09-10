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
      <div className="w-full overflow-hidden rounded-2xl border border-light-border">
        <div className="flex bg-[#e7e8e9] px-6 py-4 text-base text-auth-navy">
          <span className="w-[300px]">Member</span>
          <span className="w-[300px]">Profile Type</span>
          <span>Action</span>
        </div>
        <div className="flex flex-col bg-white">
          {members.map((member, i) => (
            <div
              key={i}
              className={`flex items-center px-6 py-4 ${i !== 0 ? "border-t border-light-border" : ""}`}
            >
              <div className="flex w-[300px] items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-auth-navy/15">
                  <Image src="/icons/user-rounded-small.svg" alt="" width={20} height={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-auth-navy">{member.name}</span>
                  <span className="text-sm text-[#929292]">{member.email}</span>
                </div>
              </div>
              <span className="w-[300px] text-base text-[#929292]">{member.type}</span>
              <button className="rounded-lg border border-light-border px-4 py-2 text-sm text-[#929292]">
                {member.role}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[463px] rounded-lg border border-light-border bg-white p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <h2 className="mb-6 text-2xl font-semibold text-auth-navy">Visibility</h2>
        <div className="flex flex-col gap-6">
          <label className="flex cursor-pointer items-start gap-4">
            <input
              type="radio"
              name="workspace-visibility"
              defaultChecked
              className="mt-2 size-5 shrink-0 accent-auth-navy"
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image src="/icons/globe.svg" alt="" width={17} height={17} />
                <span className="text-base font-medium tracking-[0.28px] text-auth-navy">
                  Public to explore
                </span>
              </div>
              <p className="text-sm text-[#45464d]">
                Your profile, projects, and credentials will be visible to all
                platform users.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-4">
            <input
              type="radio"
              name="workspace-visibility"
              className="mt-2 size-5 shrink-0 accent-auth-navy"
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Image src="/icons/lock-small.svg" alt="" width={14} height={18} />
                <span className="text-base font-medium tracking-[0.28px] text-auth-navy">
                  Private to members
                </span>
              </div>
              <p className="text-sm text-[#45464d]">
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
