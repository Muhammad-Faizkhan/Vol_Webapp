"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";

const sharedCanvasAvatars = ["/avatars/avatar-1.jpg", "/avatars/avatar-2.jpg", "/avatars/avatar-3.jpg"];

const sharedCanvases = Array.from({ length: 2 }).map((_, i) => ({
  href: `/canvas/${i + 1}`,
  title: "Lorem Ipsum Title",
  workspace: "Lorem Ipsum Workspace",
  editedAgo: "Edited 12min ago . 4 Products",
  updatedTag: "+3 Collabs",
  collaboratorAvatars: sharedCanvasAvatars,
  collaboratorCount: 2,
  imageSrc: "/illustrations/canvas-thumb-mortar-pattern.jpg",
}));

const lessons = [
  {
    icon: "/icons/play.svg",
    iconSize: [20, 20] as const,
    title: "Assessing Floor Flatness (FF/FL)",
    meta: "Video • 12:45",
    state: "done",
  },
  {
    icon: "/icons/document.svg",
    iconSize: [16, 20] as const,
    title: "ANSI A108.19 Standards Overview",
    meta: "Document • 5 pages",
    state: "done",
  },
  {
    icon: "/icons/compass.svg",
    iconSize: [11, 18] as const,
    title: "Self-Leveling Underlayment Plan",
    meta: "Interactive Canvas • In Progress",
    state: "resume",
  },
];

const resources = [
  { icon: "/icons/resource-canvas.svg", iconSize: [8.25, 13.5] as const, title: "Master Tool List V3", meta: "Canvas • Shared" },
  { icon: "/icons/spreadsheet.svg", iconSize: [13.5, 13.5] as const, title: "Layout Calculation Sheet", meta: "Spreadsheet • 1.2MB" },
  { icon: "/icons/pdf.svg", iconSize: [12, 14.25] as const, title: "Approved Mortar Matrix", meta: "PDF • 450KB" },
];

const discussionPost = {
  avatar: "/avatars/avatar-3.jpg",
  title: "Best practices for 24x48 porcelain leveling",
  author: "David R.",
  ago: "2 hours ago",
  body: [
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets.",
    "ILorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the",
  ],
  tags: ["Large Format", "Substrate Prep"],
  likes: 12,
};

const initialReplies = [
  {
    id: 1,
    avatar: "/avatars/avatar-2.jpg",
    author: "John S.",
    ago: "45 mins ago",
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers.",
    likes: 3,
  },
];

const tabs: { id: "curriculum" | "canvas" | "resources" | "discussions"; label: string; badge?: number }[] = [
  { id: "curriculum", label: "Curriculum" },
  { id: "canvas", label: "Shared Canvas" },
  { id: "resources", label: "Resources" },
  { id: "discussions", label: "Discussions", badge: 4 },
];

export default function ClassroomDetailPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("curriculum");
  const [module1Open, setModule1Open] = useState(true);
  const [module2Open, setModule2Open] = useState(false);
  const [copied, setCopied] = useState(false);
  const [replies, setReplies] = useState(initialReplies);
  const [replyText, setReplyText] = useState("");
  const [postLiked, setPostLiked] = useState(false);

  const postReply = () => {
    const text = replyText.trim();
    if (!text) return;
    setReplies((prev) => [
      ...prev,
      { id: Date.now(), avatar: "/avatars/avatar-1.jpg", author: "You", ago: "Just now", body: text, likes: 0 },
    ]);
    setReplyText("");
  };

  const copyJoinCode = async () => {
    try {
      await navigator.clipboard.writeText("MTL-892");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-sm text-auth-navy dark:text-dak-body">
        Classroom <span className="mx-1">›</span> Abc Classroom
        <span className="mx-1">›</span> {activeTab === "discussions" ? "Community Discussion" : tabs.find((t) => t.id === activeTab)?.label}
      </p>

      <Link href="/classrooms" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image
          src="/icons/arrow-narrow-right.svg"
          alt=""
          width={20}
          height={20}
          className="-scale-y-100 rotate-180 dark:hidden"
        />
        <Image
          src="/icons/arrow-narrow-right-light.svg"
          alt=""
          width={20}
          height={20}
          className="hidden -scale-y-100 rotate-180 dark:block"
        />
        Back
      </Link>

      {activeTab !== "discussions" && (
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-5 shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface sm:p-8 lg:flex-row lg:justify-between">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-r from-transparent to-[#c793ff]/50 lg:block" />
          <div className="relative flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-sm bg-[rgba(148,54,251,0.1)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-dak-cta">
                Active Course
              </span>
              <span className="flex items-center gap-1.5 text-sm text-[#2b2b31] dark:text-dak-body">
                <Image src="/icons/verified-check-small.svg" alt="" width={14.667} height={14} className="dark:invert" />
                MasterTile Inc.
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#020204] dark:text-dak-heading sm:text-[48px] sm:leading-[56px]">
              Mastering Large Format Tile Installation
            </h1>
            <p className="max-w-[600px] text-base text-[#2b2b31] dark:text-dak-body sm:text-lg">
              Advanced techniques for handling, cutting, and setting gauged
              porcelain tile panels and large format slabs.
            </p>
          </div>
          <div className="relative flex min-w-[200px] flex-col gap-1 self-start rounded border border-[rgba(43,43,49,0.4)] px-4 py-3 dark:border-dak-border">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase text-[#020204] dark:text-dak-heading">Join Code</span>
                <span className="text-2xl font-semibold tracking-[2.4px] text-[#020204] dark:text-dak-heading">MTL-892</span>
              </div>
              <button onClick={copyJoinCode} aria-label="Copy join code" className="shrink-0">
                <Image src="/icons/copy.svg" alt="" width={17} height={20} className="dark:invert" />
              </button>
            </div>
            {copied && <span className="text-xs font-medium text-dak-cta">Copied!</span>}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 xl:flex-row">
        <div className="flex min-w-0 flex-col gap-6 xl:flex-[2]">
          <div className="flex gap-8 overflow-x-auto border-b border-[#c793ff] dark:border-dak-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap pb-[15px] text-sm tracking-[0.28px] ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#020204] font-semibold text-[#020204] dark:border-dak-cta dark:text-dak-heading"
                    : "font-normal text-[#2b2b31] dark:text-dak-muted"
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#2b2b31] text-[10px] font-bold text-[#f4f4f4] dark:bg-dak-cta">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "curriculum" && (
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded border border-[#c6c6cd] bg-[#f8f9ff] dark:border-dak-border dark:bg-dak-surface">
                <button
                  onClick={() => setModule1Open((v) => !v)}
                  className="flex w-full items-center justify-between border-b border-[#c6c6cd] bg-[#45464d] px-4 py-4 dark:border-dak-border"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-8 items-center justify-center rounded-full bg-dak-cta text-sm font-medium text-white">
                      1
                    </span>
                    <h3 className="text-2xl font-semibold text-white">Substrate Preparation</h3>
                  </div>
                  <Image
                    src="/icons/chevron-down-small.svg"
                    alt=""
                    width={12}
                    height={7.4}
                    className={`invert transition-transform ${module1Open ? "rotate-180" : ""}`}
                  />
                </button>
                {module1Open && (
                  <div className="flex flex-col gap-2 bg-white px-6 py-4 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:bg-dak-surface">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.title}
                        className={`flex items-center gap-4 rounded p-3 ${
                          lesson.state === "resume"
                            ? "border-l-2 border-[#4f626e] bg-[#2b2b31]"
                            : ""
                        }`}
                      >
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-sm ${
                            lesson.state === "resume" ? "bg-white/20" : "bg-[rgba(2,2,4,0.2)]"
                          }`}
                        >
                          <Image
                            src={lesson.icon}
                            alt=""
                            width={lesson.iconSize[0]}
                            height={lesson.iconSize[1]}
                            className={lesson.state === "resume" ? "invert" : ""}
                          />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span
                            className={`text-sm font-medium tracking-[0.28px] ${
                              lesson.state === "resume" ? "text-white" : "text-[#020204] dark:text-dak-heading"
                            }`}
                          >
                            {lesson.title}
                          </span>
                          <span className={`text-sm ${lesson.state === "resume" ? "text-white" : "text-[#2b2b31] dark:text-dak-body"}`}>
                            {lesson.meta}
                          </span>
                        </div>
                        {lesson.state === "done" ? (
                          <Image src="/icons/checkmark-circle.svg" alt="" width={16.667} height={16.667} className="dark:invert" />
                        ) : (
                          <button className="shrink-0 rounded border border-white px-3 py-2 text-xs font-semibold text-white">
                            Resume
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setModule2Open((v) => !v)}
                className="flex items-center justify-between rounded border border-[rgba(43,43,49,0.4)] bg-white p-4 dark:border-dak-border dark:bg-dak-surface"
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-8 items-center justify-center rounded-full border border-[#c6c6cd] bg-[#f4f4f4] text-sm font-medium text-[#020204] dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading">
                    2
                  </span>
                  <h3 className="text-xl font-semibold text-[#020204] dark:text-dak-heading">
                    Setting Materials &amp; Mortar Coverage
                  </h3>
                </div>
                <Image
                  src="/icons/chevron-down-small.svg"
                  alt=""
                  width={12}
                  height={7.4}
                  className={`dark:invert transition-transform ${module2Open ? "rotate-180" : ""}`}
                />
              </button>
              {module2Open && (
                <div className="rounded border border-[rgba(43,43,49,0.4)] bg-white p-4 text-sm text-[#2b2b31] dark:border-dak-border dark:bg-dak-surface dark:text-dak-body">
                  Complete Module 1 to unlock this module&rsquo;s lessons.
                </div>
              )}

              <div className="flex items-center gap-4 rounded border border-[rgba(43,43,49,0.4)] bg-white p-4 dark:border-dak-border dark:bg-dak-surface">
                <span className="flex size-8 items-center justify-center rounded-full border border-dashed border-[#c6c6cd] bg-[#f4f4f4] dark:border-dak-border dark:bg-dak-bg">
                  <Image src="/icons/lock.svg" alt="" width={10.667} height={14} className="dark:invert" />
                </span>
                <h3 className="text-xl font-semibold text-[#020204] dark:text-dak-heading">
                  Handling &amp; Placement Techniques
                </h3>
              </div>
            </div>
          )}

          {activeTab === "canvas" && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {sharedCanvases.map((c, i) => (
                <WorkspaceCard key={i} {...c} />
              ))}
            </div>
          )}

          {activeTab === "resources" && (
            <div className="flex flex-col gap-4 rounded border border-[rgba(43,43,49,0.4)] bg-white p-6 dark:border-dak-border dark:bg-dak-surface">
              {resources.map((r) => (
                <div key={r.title} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[rgba(43,43,49,0.4)] bg-[rgba(2,2,4,0.1)] dark:border-dak-border">
                    <Image src={r.icon} alt="" width={r.iconSize[0]} height={r.iconSize[1]} className="dark:invert" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#020204] dark:text-dak-heading">{r.title}</span>
                    <span className="text-sm text-[#2b2b31] dark:text-dak-body">{r.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "discussions" && (
            <div className="rounded border border-[#c6c6cd] bg-white dark:border-dak-border dark:bg-dak-surface">
              <div className="flex flex-col gap-4 border-b border-[#c6c6cd] px-6 py-6 dark:border-dak-border">
                <div className="flex items-start gap-4">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                    <Image src={discussionPost.avatar} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{discussionPost.title}</h2>
                        <div className="flex items-center gap-1.5 text-sm text-[#45464d] dark:text-dak-muted">
                          <span className="font-medium">{discussionPost.author}</span>
                          <span>• {discussionPost.ago}</span>
                        </div>
                      </div>
                      <button aria-label="More" className="shrink-0 pt-1.5">
                        <Image src="/icons/dots-horizontal.svg" alt="" width={16} height={4} className="dark:invert" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {discussionPost.body.map((p, i) => (
                        <p key={i} className="text-base text-[#2b2b31] dark:text-dak-body">
                          {p}
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {discussionPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm bg-[#f4f4f4] px-2 py-1 text-xs font-semibold text-[#2b2b31] dark:bg-dak-bg dark:text-dak-heading"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 pt-1">
                      <button
                        onClick={() => setPostLiked((v) => !v)}
                        className="flex items-center gap-1 text-sm font-medium text-[#020204] dark:text-dak-heading"
                      >
                        <Image src="/icons/thumb-up.svg" alt="" width={17.5} height={16.667} className="dark:invert" />
                        {discussionPost.likes + (postLiked ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1 text-sm font-medium text-[#020204] dark:text-dak-heading">
                        <Image src="/icons/comment-bubble.svg" alt="" width={16.667} height={16.667} className="dark:invert" />
                        {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {replies.map((reply) => (
                <div key={reply.id} className="border-b border-[#c6c6cd] bg-[#f8f8f8] px-6 py-6 dark:border-dak-border dark:bg-dak-bg">
                  <div className="flex items-start gap-4">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                      <Image src={reply.avatar} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm text-[#2b2b31] dark:text-dak-heading">
                        <span className="font-medium">{reply.author}</span>
                        <span>• {reply.ago}</span>
                      </div>
                      <p className="text-base text-[#2b2b31] dark:text-dak-body">{reply.body}</p>
                      <div className="flex items-center gap-6 pt-1">
                        <span className="flex items-center gap-1 text-sm font-medium text-[#45464d] dark:text-dak-muted">
                          <Image src="/icons/thumb-up.svg" alt="" width={17.5} height={16.667} className="dark:invert" />
                          {reply.likes}
                        </span>
                        <button className="text-sm font-medium text-[#45464d] dark:text-dak-muted">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-4 p-6">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                  <Image src="/avatars/avatar-1.jpg" alt="" fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col overflow-hidden rounded border border-[#c6c6cd] bg-[#eaeaea] dark:border-dak-border">
                  <div className="flex items-center gap-2 border-b border-[rgba(43,43,49,0.4)] bg-white px-2 py-2 dark:bg-dak-surface">
                    <button type="button" aria-label="Bold" className="p-1">
                      <Image src="/icons/format-bold.svg" alt="" width={7.8} height={10.5} className="dark:invert" />
                    </button>
                    <button type="button" aria-label="Italic" className="p-1">
                      <Image src="/icons/format-italic.svg" alt="" width={9.75} height={10.5} className="dark:invert" />
                    </button>
                    <span className="h-4 w-px bg-[#2b2b31] dark:bg-dak-border" />
                    <button type="button" aria-label="Bulleted list" className="p-1">
                      <Image src="/icons/format-list-bulleted.svg" alt="" width={13.5} height={12} className="dark:invert" />
                    </button>
                    <button type="button" aria-label="Numbered list" className="p-1">
                      <Image src="/icons/format-list-numbered.svg" alt="" width={13.5} height={15} className="dark:invert" />
                    </button>
                    <span className="h-4 w-px bg-[#2b2b31] dark:bg-dak-border" />
                    <button type="button" aria-label="Insert link" className="p-1">
                      <Image src="/icons/link.svg" alt="" width={16.667} height={8.333} className="dark:invert" />
                    </button>
                    <button type="button" aria-label="Insert image" className="p-1">
                      <Image src="/icons/image-insert.svg" alt="" width={15} height={15} className="dark:invert" />
                    </button>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    rows={4}
                    className="min-h-[120px] w-full bg-[#eaeaea] px-4 py-4 text-base text-[#020204] placeholder:text-[rgba(69,70,77,0.5)] focus:outline-none dark:bg-dak-bg dark:text-dak-heading"
                  />
                  <div className="flex items-center justify-end border-t border-[rgba(43,43,49,0.4)] bg-white px-3 py-3 dark:bg-dak-surface">
                    <button
                      onClick={postReply}
                      disabled={!replyText.trim()}
                      className="rounded bg-[#020204] px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-dak-cta"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeTab !== "discussions" && (
        <div className="flex w-full shrink-0 flex-col gap-6 xl:w-[380px]">
          <div className="flex flex-col gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
            <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Your Progress</h3>
            <div className="flex items-end justify-between">
              <span className="text-[32px] font-bold leading-none text-[#020204] dark:text-dak-heading">33%</span>
              <span className="text-sm text-[#2b2b31] dark:text-dak-muted">4 of 12 lessons</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#f2f2f2] dark:bg-dak-border">
              <div className="h-full w-1/3 rounded-full bg-[#020204] dark:bg-dak-cta" />
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#2b2b31] dark:text-dak-muted">
                Next Up
              </span>
              <div className="flex items-start gap-3 rounded-lg border border-[#c6c6cd] bg-[#2b2b31] p-3 dark:border-dak-border">
                <Image src="/icons/play-circle-white.svg" alt="" width={20} height={22} className="shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium tracking-[0.28px] text-white">
                    Trowel Ridges &amp; Air Evacuation
                  </span>
                  <span className="text-sm text-[#c6c6cd]">Module 2 • Video</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg border border-[rgba(43,43,49,0.4)] bg-white p-6 shadow-[0px_4px_4px_rgba(43,43,49,0.2)] dark:border-dak-border dark:bg-dak-surface">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Resources</h3>
              <Image src="/icons/folder.svg" alt="" width={21.5} height={16} className="dark:invert" />
            </div>
            <div className="flex flex-col gap-4">
              {resources.map((r) => (
                <div key={r.title} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[rgba(43,43,49,0.4)] bg-[rgba(2,2,4,0.1)] dark:border-dak-border">
                    <Image src={r.icon} alt="" width={r.iconSize[0]} height={r.iconSize[1]} className="dark:invert" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#020204] dark:text-dak-heading">{r.title}</span>
                    <span className="text-sm text-[#2b2b31] dark:text-dak-body">{r.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
