import Image from "next/image";

type Member = {
  name: string;
  role: string;
  badge: "Admin" | "Collaborator" | "Viewer";
  avatar: string;
};

const members: Member[] = [
  { name: "Alex Morgan", role: "You", badge: "Admin", avatar: "/avatars/avatar-1.jpg" },
  { name: "John Smith", role: "Contractor", badge: "Collaborator", avatar: "/avatars/avatar-2.jpg" },
  { name: "Sarah Lewis", role: "Contractor", badge: "Collaborator", avatar: "/avatars/avatar-3.jpg" },
  { name: "Sarah Williams", role: "Student", badge: "Viewer", avatar: "/avatars/avatar-2.jpg" },
  { name: "Mark Williams", role: "Customer", badge: "Viewer", avatar: "/avatars/avatar-1.jpg" },
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
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
              <Image src={member.avatar} alt="" fill className="object-cover" />
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
