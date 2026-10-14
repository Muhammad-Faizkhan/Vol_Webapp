"use client";

import Image from "next/image";
import Link from "next/link";
import { compactNumber, titleCase, type PersonCard } from "@vol/api-client";
import { FollowButton } from "@/components/social/FollowButton";
import { Avatar } from "@/components/ui/UserImage";

export function BusinessProfileCard({ person }: { person: PersonCard }) {
  const href = person.accountType === "BUSINESS" ? `/business/${person.id}` : `/profile/${person.id}`;
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white px-6 py-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar src={person.avatarUrl} name={person.name} />
          <div className="flex min-w-0 flex-col gap-1.5">
            <h3 className="truncate text-2xl font-semibold text-[#020204] dark:text-dak-heading">{person.name}</h3>
            <span className="truncate text-sm font-medium uppercase tracking-[0.6px] text-[#929292] dark:text-dak-muted">
              {person.industry ?? person.specialty ?? titleCase(person.accountType)}
            </span>
          </div>
        </div>
        {person.verified && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-dak-cta" title="Verified business">
            <Image src="/icons/verified-badge.svg" alt="Verified" width={22} height={21} />
          </div>
        )}
      </div>

      <p className="line-clamp-3 min-h-[60px] text-sm text-[#2b2b31] dark:text-dak-body">{person.bio ?? "No bio yet."}</p>

      <div className="flex items-start justify-center gap-4 border-t border-[#c793ff] pt-[17px] dark:border-dak-border">
        <Stat value={person.workspaceCount} label="Projects" />
        <div className="flex flex-1 flex-col items-center border-x border-[#c793ff] px-1 dark:border-dak-border">
          <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{compactNumber(person.classroomCount)}</span>
          <span className="text-sm text-[#2b2b31] dark:text-dak-muted">Classrooms</span>
        </div>
        <Stat value={person.followerCount} label="Followers" />
      </div>

      <div className="flex gap-3">
        <Link
          href={href}
          className="flex h-10 flex-1 items-center justify-center rounded-2xl bg-dak-cta text-sm font-medium text-white shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
        >
          View Profile
        </Link>
        <FollowButton
          userId={person.id}
          initial={person.isFollowing}
          className="h-10 w-[127px] shrink-0 rounded-lg bg-[#2b2b31] text-sm font-medium text-white disabled:opacity-60"
          followingClassName="h-10 w-[127px] shrink-0 rounded-lg border border-[#2b2b31] text-sm font-medium text-[#2b2b31] disabled:opacity-60 dark:border-dak-border dark:text-dak-heading"
        />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{compactNumber(value)}</span>
      <span className="text-sm text-[#2b2b31] dark:text-dak-muted">{label}</span>
    </div>
  );
}
