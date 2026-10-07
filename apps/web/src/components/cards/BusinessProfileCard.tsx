import Image from "next/image";
import Link from "next/link";

type BusinessProfileCardProps = {
  href: string;
  name: string;
  role: string;
  bio: string;
  avatarSrc: string;
  projects: string;
  classrooms: string;
  team: string;
};

export function BusinessProfileCard({
  href,
  name,
  role,
  bio,
  avatarSrc,
  projects,
  classrooms,
  team,
}: BusinessProfileCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white px-6 py-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
            <Image src={avatarSrc} alt="" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{name}</h3>
            <span className="text-sm font-medium uppercase tracking-[0.6px] text-[#929292] dark:text-dak-muted">
              {role}
            </span>
          </div>
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-dak-cta">
          <Image src="/icons/verified-badge.svg" alt="" width={22} height={21} />
        </div>
      </div>

      <p className="text-sm text-[#2b2b31] dark:text-dak-body">{bio}</p>

      <div className="flex items-start justify-center gap-4 border-t border-[#c793ff] pt-[17px] dark:border-dak-border">
        <div className="flex flex-1 flex-col items-center">
          <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{projects}</span>
          <span className="text-sm text-[#2b2b31] dark:text-dak-muted">Projects</span>
        </div>
        <div className="flex flex-1 flex-col items-center border-x border-[#c793ff] px-1 dark:border-dak-border">
          <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{classrooms}</span>
          <span className="text-sm text-[#2b2b31] dark:text-dak-muted">Classrooms</span>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{team}</span>
          <span className="text-sm text-[#2b2b31] dark:text-dak-muted">Team</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={href}
          className="flex h-10 flex-1 items-center justify-center rounded-2xl bg-dak-cta text-sm font-medium text-white shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
        >
          View Profile
        </Link>
        <button className="h-10 w-[127px] shrink-0 rounded-lg bg-[#2b2b31] text-sm font-medium text-white">
          Follow
        </button>
      </div>
    </div>
  );
}
