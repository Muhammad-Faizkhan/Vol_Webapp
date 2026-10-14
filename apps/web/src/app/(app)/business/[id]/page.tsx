"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { compactNumber, timeAgo, titleCase, type CanvasCard, type ClassroomCard, type Paged, type Product, type PublicProfile } from "@vol/api-client";
import { useApiQuery, withQuery } from "@vol/api-client/react";
import { FollowButton } from "@/components/social/FollowButton";
import { ReportButton } from "@/components/social/ReportButton";
import { ErrorState } from "@/components/ui/States";
import { Avatar, UserImage } from "@/components/ui/UserImage";
import { plural, productSpecs } from "@/lib/format";

const tabs = ["Overview", "Products", "Canvases", "Classrooms"] as const;
type Tab = (typeof tabs)[number];

function SignatureProducts({ items }: { items: Product[] }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-[-0.32px] text-[#020204] dark:text-dak-heading">Signature Products</h2>
      {items.length === 0 && <p className="text-sm text-[#2b2b31] dark:text-dak-body">No published products yet.</p>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {items.map((p) => (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-lg border border-[rgba(198,198,205,0.6)] bg-white dark:border-dak-border dark:bg-dak-surface">
            <div className="relative h-[130px] w-full bg-auth-navy dark:bg-dak-bg">
              <UserImage src={p.images[0]} fallback="/illustrations/classroom-thumb-engineers.jpg" />
            </div>
            <div className="flex flex-col gap-3 px-5 py-4">
              <span className="text-xs font-medium uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">{p.brand ?? p.business.name}</span>
              <h4 className="text-base font-semibold text-[#020204] dark:text-dak-heading">{p.name}</h4>
              <div className="flex flex-col gap-2">
                {productSpecs(p).map(([label, value], i, all) => (
                  <div key={label} className={`flex items-center justify-between ${i < all.length - 1 ? "border-b border-[#c793ff] pb-1 dark:border-dak-border" : ""}`}>
                    <span className="text-sm text-[#2b2b31] dark:text-dak-body">{label}</span>
                    <span className="text-sm font-semibold text-[#020204] dark:text-dak-heading">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/products/${p.id}`}
                className="mt-2 flex h-[33px] items-center justify-center rounded-2xl bg-dak-cta text-sm font-medium text-white shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TechnicalCanvases({ items }: { items: CanvasCard[] }) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-[-0.32px] text-[#020204] dark:text-dak-heading">Technical Canvases</h2>
        <span className="rounded-sm bg-[rgba(148,54,251,0.1)] px-2 py-1 text-xs font-semibold text-dak-cta">Public</span>
      </div>
      {items.length === 0 && <p className="text-sm text-[#2b2b31] dark:text-dak-body">No public canvases yet.</p>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {items.map((c) => (
          <Link key={c.id} href={`/canvas/${c.id}`} className="flex flex-col overflow-hidden rounded-lg bg-white shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:bg-dak-surface">
            <div className="relative h-[130px] w-full bg-auth-navy dark:bg-dak-bg">
              <UserImage src={c.thumbnailUrl} fallback="/illustrations/canvas-thumb-mortar-pattern.jpg" />
              <span className="absolute right-4 top-4 rounded-sm bg-[#45464d] px-2 py-1 text-[10px] font-medium text-white">+{c.collaboratorCount} Collabs</span>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <h4 className="text-base font-medium tracking-[0.28px] text-[#020204] dark:text-dak-heading">{c.title}</h4>
              <p className="text-sm tracking-[0.28px] text-[#2b2b31] dark:text-dak-muted">{c.workspace.name}</p>
              <p className="text-sm text-[#929292] dark:text-dak-muted">
                Edited {timeAgo(c.updatedAt)} · {plural(c.productCount, "Product")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TrainingClassrooms({ items }: { items: ClassroomCard[] }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-[-0.32px] text-[#020204] dark:text-dak-heading">Training &amp; Classrooms</h2>
      {items.length === 0 && <p className="text-sm text-[#2b2b31] dark:text-dak-body">No public classrooms yet.</p>}
      <div className="flex flex-col gap-6">
        {items.map((c) => (
          <div key={c.id} className="flex flex-col overflow-hidden rounded-lg border border-[rgba(43,43,49,0.4)] bg-white shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] sm:flex-row dark:border-dak-border dark:bg-dak-surface">
            <div className="relative h-[180px] w-full shrink-0 sm:h-auto sm:w-[220px]">
              <UserImage src={c.imageUrl} fallback="/illustrations/canvas-thumb-moodboard.png" />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3 p-8">
              <div className="flex items-center gap-2">
                <Image src="/icons/beginner-star.svg" alt="" width={9} height={12} className="dark:invert" />
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">{c.skillLevel ? titleCase(c.skillLevel) : "All levels"}</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{c.title}</h3>
              <p className="text-base text-[#2b2b31] dark:text-dak-body">
                {c.category ?? "Classroom"} · {plural(c.moduleCount, "module")} · {plural(c.lessonCount, "lesson")}
              </p>
              <div className="flex items-center gap-4">
                <Link href={`/classrooms/${c.id}`} className="rounded-sm border border-[#2b2b31] px-5 py-2 text-sm font-medium text-[#2b2b31] dark:border-dak-border dark:text-dak-heading">
                  View Syllabus
                </Link>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#2b2b31] dark:text-dak-muted">
                  <Image src="/icons/graduates.svg" alt="" width={15} height={11} className="dark:invert" />
                  {c.enrolledCount} Enrolled
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function BusinessProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const { data: p, error } = useApiQuery<PublicProfile>(`/users/${id}`);
  const all = activeTab !== "Overview";
  const { data: products } = useApiQuery<Paged<Product>>(p ? withQuery("/products", { businessId: p.id, limit: all ? 24 : 3 }) : null);
  const { data: canvases } = useApiQuery<Paged<CanvasCard>>(p ? withQuery("/canvases/public", { authorId: p.id, limit: all ? 24 : 3 }) : null);
  const { data: classrooms } = useApiQuery<Paged<ClassroomCard>>(p ? withQuery("/classrooms", { scope: "explore", instructorId: p.id, limit: all ? 24 : 2 }) : null);

  if (error) return <ErrorState error={error} />;
  if (!p) return null;
  const b = p.business;
  const name = b?.legalName ?? p.name;

  const stat = (value: number, label: string, big = false) => (
    <div
      className={
        big
          ? "flex flex-col items-center gap-2 rounded-lg border border-dak-cta bg-gradient-to-b from-white to-[#f3e8ff] px-8 py-3 dark:from-dak-surface dark:to-dak-surface"
          : "flex flex-1 flex-col items-center gap-2 rounded border border-[#c793ff] bg-white px-4 py-3 dark:border-dak-border dark:bg-dak-surface"
      }
    >
      <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{compactNumber(value)}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">{label}</span>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center gap-1.5 text-sm text-[#2b2b31] dark:text-dak-body">
        <Link href="/explore" className="hover:underline">
          Explore
        </Link>
        <span>›</span>
        <Link href="/explore?tab=peoples" className="hover:underline">
          Business Profile
        </Link>
        <span>›</span>
        <span className="font-medium text-[#020204] dark:text-dak-heading">{name}</span>
      </div>

      <div>
        <Link href="/explore?tab=peoples" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
          <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
          Back
        </Link>
      </div>

      <div className="relative h-[180px] w-full overflow-hidden rounded-2xl sm:h-[260px] lg:h-[320px]">
        <UserImage src={b?.coverUrl ?? p.profile?.coverUrl} fallback="/illustrations/business-profile-hero.png" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-6">
          <span className="-mt-10 rounded-full border-4 border-white dark:border-dak-bg sm:-mt-14">
            <Avatar src={p.avatarUrl} name={name} size={112} />
          </span>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-[-0.6px] text-[#020204] dark:text-dak-heading sm:text-[48px] sm:leading-[56px]">{name}</h1>
              {p.verified && <Image src="/icons/verified-badge.svg" alt="Verified" width={22} height={21} />}
            </div>
            <p className="text-lg text-[#2b2b31] dark:text-dak-body">{b?.industry ?? p.specialty ?? "Business"}</p>
            <div className="flex gap-4">
              {stat(p.stats.followers, "Followers", true)}
              {stat(p.stats.following, "Followings", true)}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {stat(p.stats.products, "Products")}
          {stat(p.stats.canvases, "Canvases")}
          {stat(p.stats.classrooms, "Classrooms")}
        </div>
      </div>

      <div className="flex gap-8 overflow-x-auto border-b border-[#c793ff] dark:border-dak-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap pb-[18px] pt-2 text-sm font-semibold tracking-[0.28px] ${
              activeTab === tab
                ? "border-b-2 border-[#020204] text-[#020204] dark:border-dak-cta dark:text-dak-heading"
                : "border-b-2 border-transparent font-medium text-[#2b2b31] dark:text-dak-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 xl:flex-row">
        <div className="flex min-w-0 flex-col gap-8 xl:flex-[2]">
          {activeTab === "Overview" && (
            <section className="flex flex-col gap-2 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
              <h2 className="text-2xl font-semibold tracking-[-0.32px] text-[#020204] dark:text-dak-heading">About {name}</h2>
              <p className="whitespace-pre-wrap text-base text-[#2b2b31] dark:text-dak-body">{b?.description ?? p.profile?.bio ?? "No description yet."}</p>
            </section>
          )}
          {(activeTab === "Overview" || activeTab === "Products") && <SignatureProducts items={products?.items ?? []} />}
          {(activeTab === "Overview" || activeTab === "Canvases") && <TechnicalCanvases items={canvases?.items ?? []} />}
          {(activeTab === "Overview" || activeTab === "Classrooms") && <TrainingClassrooms items={classrooms?.items ?? []} />}
        </div>

        <div className="flex w-full flex-col gap-6 xl:w-[380px] xl:shrink-0">
          {!p.isSelf && (
            <div className="flex flex-col gap-3 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
              <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Connect with {name}</h3>
              <p className="text-sm text-[#2b2b31] dark:text-dak-body">Follow to see their posts in your feed and new products on your home page.</p>
              <FollowButton
                userId={p.id}
                initial={p.isFollowing}
                labels={["+ Follow", "Following"]}
                className="mt-2 flex items-center justify-center gap-2 rounded border border-[#2b2b31] py-3 text-sm font-medium text-[#020204] disabled:opacity-60 dark:border-dak-border dark:text-dak-heading"
                followingClassName="mt-2 flex items-center justify-center gap-2 rounded bg-[#020204] py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-dak-cta"
              />
              <ReportButton targetType="USER" targetId={p.id} label="Report this business" className="self-start text-xs text-[#929292] hover:text-red-500" />
            </div>
          )}

          <div className="flex flex-col gap-5 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
            <h3 className="border-b border-light-border pb-2 text-base font-semibold uppercase tracking-[0.7px] text-[#020204] dark:border-dak-border dark:text-dak-heading">Profile Details</h3>

            <Detail icon={<Image src="/icons/email.svg" alt="" width={15} height={12} className="dark:invert" />} label="Email">
              {b?.contactEmail ? <a href={`mailto:${b.contactEmail}`}>{b.contactEmail}</a> : "—"}
            </Detail>
            <div className="flex items-start gap-4">
              <Image src="/icons/phone-badge.svg" alt="" width={40} height={40} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[#2b2b31] dark:text-dak-muted">Phone Number</span>
                <span className="text-base font-semibold text-[#020204] dark:text-dak-heading">{b?.phone ?? "—"}</span>
              </div>
            </div>
            <Detail icon={<Image src="/icons/expertise.svg" alt="" width={16} height={20} className="dark:invert" />} label="Professional Expertise">
              <div className="flex flex-wrap gap-2">
                {(b?.categoryTags.length ? b.categoryTags : ["—"]).map((tag) => (
                  <span key={tag} className="rounded-sm border border-[rgba(148,54,251,0.2)] bg-[rgba(148,54,251,0.1)] px-2.5 py-1.5 text-xs font-semibold text-dak-cta">
                    {tag}
                  </span>
                ))}
              </div>
            </Detail>
            <Detail icon={<Image src="/icons/website.svg" alt="" width={20} height={20} className="dark:invert" />} label="Website">
              {b?.website ? (
                <a href={b.website} target="_blank" rel="noopener noreferrer">
                  {b.website.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                "—"
              )}
            </Detail>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[rgba(2,2,4,0.1)]">{icon}</div>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-xs font-medium text-[#2b2b31] dark:text-dak-muted">{label}</span>
        <div className="break-words text-base font-semibold text-[#020204] dark:text-dak-heading">{children}</div>
      </div>
    </div>
  );
}
