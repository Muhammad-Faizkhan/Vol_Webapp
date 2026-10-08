"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const tabs = ["Overview", "Products", "Canvases", "Classrooms"] as const;
type Tab = (typeof tabs)[number];

const products = [
  {
    name: "Abc Product",
    coverage: "54 sq ft / roll",
    size: "600 x 1200 MM",
    thickness: '1/8" (3mm)',
    rotation: "0",
  },
  {
    name: "Abc Product",
    coverage: "54 sq ft / roll",
    size: "600 x 1200 MM",
    thickness: '1/8" (3mm)',
    rotation: "0",
  },
  {
    name: "Abc Product",
    coverage: "54 sq ft / roll",
    size: "600 x 1200 MM",
    thickness: '1/8" (3mm)',
    rotation: "0",
  },
];

const canvases = [
  { title: "Lorem Ipsum Canvas", workspace: "Lorem Ipsum Workspace", editedAgo: "Edited 12min ago . 4 Products" },
  { title: "Lorem Ipsum Canvas", workspace: "Lorem Ipsum Workspace", editedAgo: "Edited 12min ago . 4 Products" },
  { title: "Lorem Ipsum Canvas", workspace: "Lorem Ipsum Workspace", editedAgo: "Edited 12min ago . 4 Products" },
];

const classrooms = [
  {
    title: "Precision Tile Installation Masterclass",
    body: "Comprehensive 4-week hybrid training program covering advanced substrate preparation, leveling theory, and large-format handling techniques.",
    graduates: "120+ Graduates",
  },
  {
    title: "Precision Tile Installation Masterclass",
    body: "Comprehensive 4-week hybrid training program covering advanced substrate preparation, leveling theory, and large-format handling techniques.",
    graduates: "120+ Graduates",
  },
];

const expertiseTags = ["Global Trade Standards", "ISO 9001"];

function SignatureProducts() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-[-0.32px] text-[#020204] dark:text-dak-heading">
        Signature Products
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {products.map((p, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg border border-[rgba(198,198,205,0.6)] bg-white dark:border-dak-border dark:bg-dak-surface"
          >
            <div className="relative h-[130px] w-full">
              <Image src="/illustrations/classroom-thumb-engineers.jpg" alt="" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-3 px-5 py-4">
              <span className="text-xs font-medium uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">
                Schluter Systems
              </span>
              <h4 className="text-base font-semibold text-[#020204] dark:text-dak-heading">{p.name}</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-[#c793ff] pb-1 dark:border-dak-border">
                  <span className="text-sm text-[#2b2b31] dark:text-dak-body">Coverage</span>
                  <span className="text-sm font-semibold text-[#020204] dark:text-dak-heading">{p.coverage}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#c793ff] pb-1 dark:border-dak-border">
                  <span className="text-sm text-[#2b2b31] dark:text-dak-body">True Size</span>
                  <span className="text-sm font-semibold text-[#020204] dark:text-dak-heading">{p.size}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#c793ff] pb-1 dark:border-dak-border">
                  <span className="text-sm text-[#2b2b31] dark:text-dak-body">Thickness</span>
                  <span className="text-sm font-semibold text-[#020204] dark:text-dak-heading">{p.thickness}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2b2b31] dark:text-dak-body">Rotation</span>
                  <span className="text-sm font-semibold text-[#020204] dark:text-dak-heading">{p.rotation}</span>
                </div>
              </div>
              <Link
                href="/business/products/1/edit"
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

function TechnicalCanvases() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-[-0.32px] text-[#020204] dark:text-dak-heading">
          Technical Canvases
        </h2>
        <span className="rounded-sm bg-[rgba(148,54,251,0.1)] px-2 py-1 text-xs font-semibold text-dak-cta">
          Engineering
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {canvases.map((c, i) => (
          <Link
            key={i}
            href={`/canvas/${i + 1}`}
            className="flex flex-col overflow-hidden rounded-lg bg-white shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:bg-dak-surface"
          >
            <div className="relative h-[130px] w-full">
              <Image src="/illustrations/canvas-thumb-mortar-pattern.jpg" alt="" fill className="object-cover" />
              <span className="absolute right-4 top-4 rounded-sm bg-[#45464d] px-2 py-1 text-[10px] font-medium text-white">
                +3 Collabs
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <h4 className="text-base font-medium tracking-[0.28px] text-[#020204] dark:text-dak-heading">
                {c.title}
              </h4>
              <p className="text-sm tracking-[0.28px] text-[#2b2b31] dark:text-dak-muted">{c.workspace}</p>
              <p className="text-sm text-[#929292] dark:text-dak-muted">{c.editedAgo}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TrainingClassrooms() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-[-0.32px] text-[#020204] dark:text-dak-heading">
        Training &amp; Classrooms
      </h2>
      <div className="flex flex-col gap-6">
        {classrooms.map((c, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg border border-[rgba(43,43,49,0.4)] bg-white shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] sm:flex-row dark:border-dak-border dark:bg-dak-surface"
          >
            <div className="relative h-[180px] w-full shrink-0 sm:h-auto sm:w-[220px]">
              <Image src="/illustrations/canvas-thumb-moodboard.png" alt="" fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3 p-8">
              <div className="flex items-center gap-2">
                <Image src="/icons/beginner-star.svg" alt="" width={9} height={12} className="dark:invert" />
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">
                  Beginner
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{c.title}</h3>
              <p className="text-base text-[#2b2b31] dark:text-dak-body">{c.body}</p>
              <div className="flex items-center gap-4">
                <button className="rounded-sm border border-[#2b2b31] px-5 py-2 text-sm font-medium text-[#2b2b31] dark:border-dak-border dark:text-dak-heading">
                  View Syllabus
                </button>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#2b2b31] dark:text-dak-muted">
                  <Image src="/icons/graduates.svg" alt="" width={15} height={11} className="dark:invert" />
                  {c.graduates}
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
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center gap-1.5 text-sm text-[#2b2b31] dark:text-dak-body">
        <Link href="/explore" className="hover:underline">
          Explore
        </Link>
        <span>›</span>
        <Link href="/explore" className="hover:underline">
          Business Profile
        </Link>
        <span>›</span>
        <span className="font-medium text-[#020204] dark:text-dak-heading">Abc Business Profile</span>
      </div>

      <div>
        <Link href="/explore" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
          <Image
            src="/icons/arrow-narrow-right.svg"
            alt=""
            width={20}
            height={20}
            className="-scale-y-100 rotate-180 dark:invert"
          />
          Back
        </Link>
      </div>

      <div className="relative h-[180px] w-full overflow-hidden rounded-2xl sm:h-[260px] lg:h-[320px]">
        <Image src="/illustrations/business-profile-hero.png" alt="" fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-6">
          <div className="relative -mt-10 size-20 shrink-0 overflow-hidden rounded-full border-4 border-white dark:border-dak-bg sm:-mt-14 sm:size-28">
            <Image src="/avatars/avatar-3.jpg" alt="" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-[-0.6px] text-[#020204] dark:text-dak-heading sm:text-[48px] sm:leading-[56px]">
                Abc Business
              </h1>
              <Image src="/icons/verified-badge.svg" alt="" width={22} height={21} />
            </div>
            <p className="text-lg text-[#2b2b31] dark:text-dak-body">Industrial Ceramics &amp; Systems</p>
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dak-cta bg-gradient-to-b from-white to-[#f3e8ff] px-8 py-3 dark:from-dak-surface dark:to-dak-surface">
                <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">142</span>
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dak-cta bg-gradient-to-b from-white to-[#f3e8ff] px-8 py-3 dark:from-dak-surface dark:to-dak-surface">
                <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">85</span>
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">
                  Followings
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col items-center gap-2 rounded border border-[#c793ff] bg-white px-4 py-3 dark:border-dak-border dark:bg-dak-surface">
            <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">142</span>
            <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">
              Products
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-2 rounded border border-[#c793ff] bg-white px-4 py-3 dark:border-dak-border dark:bg-dak-surface">
            <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">85</span>
            <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">
              Canvases
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-2 rounded border border-[#c793ff] bg-white px-4 py-3 dark:border-dak-border dark:bg-dak-surface">
            <span className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">12</span>
            <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">
              Classrooms
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-8 overflow-x-auto border-b border-[#c793ff] dark:border-dak-border">
        {tabs.map((tab) => (
          <button
            key={tab}
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
            <>
              <section className="flex flex-col gap-2 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
                <h2 className="text-2xl font-semibold tracking-[-0.32px] text-[#020204] dark:text-dak-heading">
                  About MasterTile Inc.
                </h2>
                <p className="text-base text-[#2b2b31] dark:text-dak-body">4F626E4F626E</p>
              </section>
              <SignatureProducts />
              <TechnicalCanvases />
              <TrainingClassrooms />
            </>
          )}
          {activeTab === "Products" && <SignatureProducts />}
          {activeTab === "Canvases" && <TechnicalCanvases />}
          {activeTab === "Classrooms" && <TrainingClassrooms />}
        </div>

        <div className="flex w-full flex-col gap-6 xl:w-[380px] xl:shrink-0">
          <div className="flex flex-col gap-3 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
            <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Connect with Abc Business</h3>
            <p className="text-sm text-[#2b2b31] dark:text-dak-body">
              Direct access to commercial sales and technical support engineering teams.
            </p>
            <button
              onClick={() => setIsFollowing((f) => !f)}
              className="mt-2 flex items-center justify-center gap-2 rounded border border-[#2b2b31] py-3 text-sm font-medium text-[#020204] dark:border-dak-border dark:text-dak-heading"
            >
              {!isFollowing && <Image src="/icons/plus-small.svg" alt="" width={12} height={12} className="dark:invert" />}
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>

          <div className="flex flex-col gap-5 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
            <h3 className="border-b border-light-border pb-2 text-base font-semibold uppercase tracking-[0.7px] text-[#020204] dark:border-dak-border dark:text-dak-heading">
              Profile Details
            </h3>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[rgba(2,2,4,0.1)]">
                <Image src="/icons/email.svg" alt="" width={15} height={12} className="dark:invert" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[#2b2b31] dark:text-dak-muted">Email</span>
                <span className="text-base font-semibold text-[#020204] dark:text-dak-heading">
                  abc business@domain.com
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Image src="/icons/phone-badge.svg" alt="" width={40} height={40} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[#2b2b31] dark:text-dak-muted">Phone Number</span>
                <span className="text-base font-semibold text-[#020204] dark:text-dak-heading">+1 123 456 7890</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[rgba(2,2,4,0.1)]">
                <Image src="/icons/expertise.svg" alt="" width={16} height={20} className="dark:invert" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-[#2b2b31] dark:text-dak-muted">Professional Expertise</span>
                <div className="flex flex-wrap gap-2">
                  {expertiseTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-[rgba(148,54,251,0.2)] bg-[rgba(148,54,251,0.1)] px-2.5 py-1.5 text-xs font-semibold text-dak-cta"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[rgba(2,2,4,0.1)]">
                <Image src="/icons/website.svg" alt="" width={20} height={20} className="dark:invert" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[#2b2b31] dark:text-dak-muted">Website</span>
                <span className="text-base font-semibold text-[#020204] dark:text-dak-heading">mastertile.inc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
