import Image from "next/image";

type Member = {
  name: string;
  role: string;
  badge: "Admin" | "Collaborator" | "Viewer";
};

const members: Member[] = [
  { name: "Alex Morgan", role: "You", badge: "Admin" },
  { name: "John Smith", role: "Contractor", badge: "Collaborator" },
  { name: "Sarah Lewis", role: "Contractor", badge: "Collaborator" },
  { name: "Sarah Williams", role: "Student", badge: "Viewer" },
  { name: "Mark Williams", role: "Customer", badge: "Viewer" },
];

export function MembersPanel({ showManageRoles = true }: { showManageRoles?: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border border-light-border dark:border-dak-border">
      <div className="bg-app-dark-surface px-6 py-3 text-sm font-medium tracking-[0.28px] text-white">
        Members ({members.length})
      </div>
      <div className="flex flex-col bg-white dark:bg-dak-surface">
        {members.map((member, i) => (
          <div
            key={member.name + i}
            className={`flex items-center gap-3 p-4 ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-auth-navy/15 dark:bg-dak-cta/20">
              <Image
                src="/icons/user-rounded-small.svg"
                alt=""
                width={20}
                height={20}
                className="invert dark:invert-0"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">{member.name}</span>
              <span className="text-sm text-[#929292] dark:text-dak-muted">{member.role}</span>
            </div>
            {member.badge === "Admin" ? (
              <span className="rounded-lg bg-app-dark-surface px-3 py-1.5 text-sm text-white">
                Admin
              </span>
            ) : (
              <span className="rounded-lg border border-light-border px-3 py-1.5 text-sm text-auth-navy dark:border-dak-border dark:text-dak-heading">
                {member.badge}
              </span>
            )}
          </div>
        ))}
        {showManageRoles && (
          <div className="p-4 pt-2">
            <button className="w-full rounded-2xl bg-dak-cta py-3 text-base font-medium tracking-[0.28px] text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)]">
              Manage Roles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
