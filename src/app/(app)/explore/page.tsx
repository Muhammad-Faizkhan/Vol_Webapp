"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ClassCard } from "@/components/cards/ClassCard";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";
import { BusinessProfileCard } from "@/components/cards/BusinessProfileCard";

const tabs = [
  { id: "latest", label: "Latest" },
  { id: "canvases", label: "Canvases" },
  { id: "discussions", label: "Discussions" },
  { id: "classrooms", label: "Classrooms" },
  { id: "peoples", label: "Peoples & Business" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const classrooms = Array.from({ length: 12 }).map((_, i) => ({
  href: `/classrooms/${i + 1}`,
  title: "Lorem Ipsum Classroom",
  subtitle: "Master Tile. Inc",
  modules: "4modules",
  imageSrc: "/illustrations/canvas-thumb-moodboard.png",
}));

const communityPosts = Array.from({ length: 3 }).map((_, i) => ({
  author: "Mark Williams",
  ago: "Posted 4 hours ago",
  title: "Lorem Ipsum",
  body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.....",
  avatar: "/avatars/avatar-3.jpg",
  imageSrc: i === 0 ? "/illustrations/canvas-thumb-mortar-pattern.jpg" : "/illustrations/canvas-thumb-moodboard.png",
  likes: 124,
  comments: 18,
}));

const trendingNews = Array.from({ length: 3 }).map((_, i) => ({
  author: "Mark Williams",
  ago: "Posted 4 hours ago",
  title: "Lorem Ipsum",
  body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.....",
  avatar: "/avatars/avatar-3.jpg",
  imageSrc: i === 0 ? "/illustrations/canvas-thumb-mortar-pattern.jpg" : "/illustrations/canvas-thumb-moodboard.png",
  likes: 124,
  comments: 18,
}));

const businessProfiles = Array.from({ length: 9 }).map((_, i) => ({
  href: `/business/${i + 1}`,
  name: "Abc Business",
  role: "Instructor",
  bio: "Pioneering advanced load-bearing structures for high-density urban environments. Specializing in tensioned concrete frameworks.",
  avatarSrc: "/avatars/avatar-3.jpg",
  projects: "142",
  classrooms: "12",
  team: "85+",
}));

const canvasAvatars = ["/avatars/avatar-1.jpg", "/avatars/avatar-2.jpg", "/avatars/avatar-3.jpg"];

const publicCanvases = Array.from({ length: 8 }).map((_, i) => ({
  href: `/canvas/${i + 1}`,
  title: "Lorem Ipsum Title",
  workspace: "Lorem Ipsum Workspace",
  editedAgo: "Edited 12min ago . 4 Products",
  updatedTag: "+3 Collabs",
  collaboratorAvatars: canvasAvatars,
  collaboratorCount: 2,
  imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
}));

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{title}</h3>
      {href && (
        <Link href={href} className="text-base font-medium text-dak-cta">
          See All
        </Link>
      )}
    </div>
  );
}

function PostCard({ post }: { post: (typeof communityPosts)[number] }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-[21px] shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
      <div className="flex items-center gap-3">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
          <Image src={post.avatar} alt="" fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-medium text-[#020204] dark:text-dak-heading">{post.author}</span>
          <span className="text-sm text-[#9c9c9c] dark:text-dak-muted">{post.ago}</span>
        </div>
      </div>
      <h4 className="pt-1 text-xl font-semibold text-[#020204] dark:text-dak-heading">{post.title}</h4>
      <p className="text-base text-[#2b2b31] dark:text-dak-body">{post.body}</p>
      <div className="relative h-[210px] overflow-hidden rounded-2xl bg-auth-navy dark:bg-dak-surface">
        <Image src={post.imageSrc} alt="" fill className="object-cover" />
      </div>
      <div className="flex items-center gap-4 border-t border-[#c793ff] pt-[17px]">
        <div className="flex items-center gap-2">
          <Image src="/icons/like.svg" alt="" width={16} height={15} className="dark:invert" />
          <span className="text-xs font-semibold text-[#2b2b31] dark:text-dak-body">{post.likes}</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="/icons/comment.svg" alt="" width={15} height={15} className="dark:invert" />
          <span className="text-xs font-semibold text-[#2b2b31] dark:text-dak-body">{post.comments}</span>
        </div>
      </div>
    </div>
  );
}

export default function ExploreHubPage() {
  const [activeTab, setActiveTab] = useState<TabId>("latest");

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          Explore what the trades are building
        </h1>
        <p className="text-base text-auth-slate dark:text-dak-body">
          Public canvases, classrooms, profiles, Newest first.
        </p>
      </div>

      <div className="flex gap-8 overflow-x-auto border-b border-light-border dark:border-dak-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 whitespace-nowrap pb-3 text-lg font-medium ${
              activeTab === tab.id
                ? "border-b-4 border-[#020204] text-[#020204] dark:border-dak-cta dark:text-dak-heading"
                : "text-[#929292] dark:text-dak-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "latest" && (
        <>
          <section className="flex flex-col gap-4">
            <SectionHeader title="Classrooms" href="/classrooms" />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {classrooms.slice(0, 4).map((c, i) => (
                <ClassCard key={i} {...c} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">From the community</h3>
                <div className="flex gap-2">
                  <button className="rounded-xl border border-[#020204] px-4 py-2 text-base text-[#020204] dark:border-dak-border dark:text-dak-heading">
                    Trending
                  </button>
                  <button className="rounded-xl bg-[#2b2b31] px-4 py-2 text-base font-semibold text-white dark:bg-dak-cta">
                    Following
                  </button>
                </div>
              </div>
              <Link href="/discover" className="text-base font-medium text-dak-cta">
                See All
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {communityPosts.map((p, i) => (
                <PostCard key={i} post={p} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <SectionHeader title="Business Profiles" href="/explore" />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
              {businessProfiles.slice(0, 3).map((b, i) => (
                <BusinessProfileCard key={i} {...b} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <SectionHeader title="Public Canvases" href="/discover" />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {publicCanvases.slice(0, 4).map((c, i) => (
                <WorkspaceCard key={i} {...c} />
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "canvases" && (
        <section className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Public Canvases</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            {publicCanvases.map((c, i) => (
              <WorkspaceCard key={i} {...c} />
            ))}
          </div>
        </section>
      )}

      {activeTab === "discussions" && (
        <>
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">From the community</h3>
              <button className="rounded-xl bg-[#2b2b31] px-4 py-2 text-base font-semibold text-white dark:bg-dak-cta">
                Following
              </button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {communityPosts.map((p, i) => (
                <PostCard key={i} post={p} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Trending News</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {trendingNews.map((p, i) => (
                <PostCard key={i} post={p} />
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "classrooms" && (
        <section className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Classrooms</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            {classrooms.map((c, i) => (
              <ClassCard key={i} {...c} />
            ))}
          </div>
        </section>
      )}

      {activeTab === "peoples" && (
        <section className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Business Profiles</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            {businessProfiles.map((b, i) => (
              <BusinessProfileCard key={i} {...b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
