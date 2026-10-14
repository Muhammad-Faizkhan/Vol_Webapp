"use client";

import Image from "next/image";
import Link from "next/link";
import { timeAgo, type CanvasCard, type ClassroomCard, type Paged, type PublicProfile } from "@vol/api-client";
import { useApiQuery, useAuth, withQuery } from "@vol/api-client/react";
import { FollowButton } from "@/components/social/FollowButton";
import { ReportButton } from "@/components/social/ReportButton";
import { ErrorState } from "@/components/ui/States";
import { Avatar, UserImage } from "@/components/ui/UserImage";

/** A profile page: your own when `userId` is omitted, anyone else's otherwise. */
export function ProfileOverview({ userId }: { userId?: string }) {
  const { user } = useAuth();
  const id = userId ?? user?.id;
  const { data: p, error } = useApiQuery<PublicProfile>(id ? `/users/${id}` : null);
  const own = !!p?.isSelf;
  const { data: canvases } = useApiQuery<Paged<CanvasCard>>(
    p ? (own ? "/canvases/recent?limit=1" : withQuery("/canvases/public", { authorId: p.id, limit: 1 })) : null,
  );
  const { data: classrooms } = useApiQuery<Paged<ClassroomCard>>(
    p ? (own ? "/classrooms?scope=enrolled&limit=2" : withQuery("/classrooms", { scope: "explore", instructorId: p.id, limit: 2 })) : null,
  );

  if (error) return <ErrorState error={error} />;
  if (!p) return null;

  const isBusiness = p.accountType === "BUSINESS";
  const bio = p.business?.description ?? p.profile?.bio;
  const cover = p.business?.coverUrl ?? p.profile?.coverUrl;
  const location = [p.profile?.city, p.profile?.country].filter(Boolean).join(", ");
  const interests = [...(p.profile?.interests ?? []), ...(p.profile?.tags ?? []), ...(p.business?.categoryTags ?? [])];
  const canvas = canvases?.items[0];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          {own ? (isBusiness ? "My Business Profile" : "My Personal Profile") : p.name}
        </h1>
        <p className="text-base text-auth-slate dark:text-dak-body">{own ? "Manage your profile" : isBusiness ? "Business profile" : "Member profile"}</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-light-border bg-white dark:border-dak-border dark:bg-dak-surface">
        <div className="relative h-[190px] w-full">
          <UserImage src={cover} fallback="/illustrations/profile-cover.png" />
        </div>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <span className="rounded-full border-4 border-white dark:border-dak-surface sm:-mt-14">
              <Avatar src={p.avatarUrl} name={p.name} size={112} />
            </span>
            <div className="flex flex-col">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-auth-navy dark:text-dak-heading">
                {p.name}
                {p.verified && <Image src="/icons/verified-check-small.svg" alt="Verified" width={18} height={18} className="dark:invert" />}
              </h2>
              <span className="text-base text-[#929292] dark:text-dak-muted">
                {own ? user?.email : p.username ? `@${p.username}` : (p.specialty ?? "")}
              </span>
              <span className="pt-1 text-sm text-[#929292] dark:text-dak-muted">
                {p.stats.followers} followers · {p.stats.following} following
              </span>
            </div>
          </div>
          {own ? (
            <Link
              href={isBusiness ? "/profile/edit-business" : "/profile/edit"}
              className="flex w-fit items-center gap-2 rounded-lg border border-light-border px-4 py-2.5 text-base font-medium text-auth-navy dark:border-dak-border dark:text-dak-heading"
            >
              ✎ Edit Profile
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <FollowButton
                userId={p.id}
                initial={p.isFollowing}
                className="rounded-lg bg-dak-cta px-6 py-2.5 text-base font-medium text-white disabled:opacity-60"
                followingClassName="rounded-lg border border-light-border px-6 py-2.5 text-base font-medium text-auth-navy disabled:opacity-60 dark:border-dak-border dark:text-dak-heading"
              />
              <ReportButton targetType="USER" targetId={p.id} />
            </div>
          )}
        </div>
      </div>

      {p.private ? (
        <div className="rounded-lg border border-light-border bg-white p-6 text-center text-base text-auth-slate dark:border-dak-border dark:bg-dak-surface dark:text-dak-body">
          This profile is private.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="min-w-0 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface lg:flex-[2]">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-auth-navy dark:text-dak-heading">
                ⓘ {isBusiness ? "Professional Bio" : "Bio"}
              </h3>
              <p className="mb-4 whitespace-pre-wrap border-b border-light-border pb-4 text-base text-auth-navy dark:border-dak-border dark:text-dak-body">
                {bio || (own ? "Add a bio from Edit Profile so people know what you work on." : "No bio yet.")}
              </p>
              <div className="flex flex-col gap-2 text-base">
                {(
                  [
                    ["Location", location || "—"],
                    ["Member Since", new Date(p.joinedAt).getFullYear().toString()],
                    ...(p.profile?.portfolioUrl ? [["Portfolio", p.profile.portfolioUrl]] : []),
                    ...(p.business?.website ? [["Website", p.business.website]] : []),
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-auth-navy dark:text-dak-body">{label}</span>
                    {value.startsWith("http") ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" className="truncate font-medium text-dak-cta">
                        {value.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="font-medium text-auth-navy dark:text-dak-heading">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface lg:flex-1">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium uppercase tracking-wide text-auth-navy dark:text-dak-heading">ⓘ {own ? "Active Canvases" : "Public Canvases"}</h3>
                {own && (
                  <Link href="/workspaces" className="text-sm font-medium text-dak-cta">
                    View All
                  </Link>
                )}
              </div>
              {canvas ? (
                <Link href={`/canvas/${canvas.id}`} className="block overflow-hidden rounded-lg border border-light-border dark:border-dak-border">
                  <div className="relative h-[130px] overflow-hidden bg-auth-navy dark:bg-dak-surface">
                    <UserImage src={canvas.thumbnailUrl} fallback="/illustrations/canvas-thumb-mortar-pattern.jpg" />
                  </div>
                  <div className="bg-white p-4 dark:bg-dak-surface">
                    <p className="text-base font-medium text-auth-navy dark:text-dak-heading">{canvas.title}</p>
                    <span className="text-sm text-[#929292] dark:text-dak-muted">
                      {canvas.workspace.name} · edited {timeAgo(canvas.updatedAt)}
                    </span>
                  </div>
                </Link>
              ) : (
                <p className="text-sm text-[#929292] dark:text-dak-muted">{canvases ? "No canvases yet." : ""}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="min-w-0 rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface lg:flex-[2]">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-auth-navy dark:text-dak-heading">⊙ Trade Interest</h3>
              <div className="flex flex-wrap gap-3">
                {interests.length === 0 && <span className="text-sm text-[#929292] dark:text-dak-muted">None listed.</span>}
                {interests.map((tag, i) => (
                  <span key={`${tag}-${i}`} className="rounded-lg bg-[#f2f2f3] px-4 py-2 text-sm text-auth-navy dark:bg-dak-bg dark:text-dak-heading">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-light-border bg-white p-6 dark:border-dak-border dark:bg-dak-surface lg:flex-1">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-auth-navy dark:text-dak-heading">🎓 {own ? "Active Classrooms" : "Classrooms"}</h3>
              <div className="flex flex-col gap-3">
                {classrooms?.items.length === 0 && <span className="text-sm text-[#929292] dark:text-dak-muted">No classrooms yet.</span>}
                {classrooms?.items.map((c) => (
                  <Link key={c.id} href={`/classrooms/${c.id}`} className="flex items-center gap-3 rounded-lg border border-light-border p-3 dark:border-dak-border">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-sm">
                      <UserImage src={c.imageUrl} fallback="/illustrations/classroom-thumb-engineers.jpg" />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{c.title}</span>
                      <span className="text-xs text-[#929292] dark:text-dak-muted">{c.instructor.name}</span>
                      <div className="flex gap-2">
                        {[`${c.enrolledCount} Enrolled`, c.progress !== null ? `${c.progress}% done` : "Public Preview"].map((tag) => (
                          <span key={tag} className="rounded-sm border border-light-border bg-white px-2 py-0.5 text-[10px] text-auth-navy dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
