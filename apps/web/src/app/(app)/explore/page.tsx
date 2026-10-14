"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { timeAgo, type CanvasCard, type ClassroomCard, type Paged, type PersonCard, type Post } from "@vol/api-client";
import { useApiQuery, withQuery } from "@vol/api-client/react";
import { BusinessProfileCard } from "@/components/cards/BusinessProfileCard";
import { ClassCard } from "@/components/cards/ClassCard";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";
import { CommunityPostCard, FeedToggle } from "@/components/social/CommunityPostCard";
import { EmptyState, LoadingGrid, Pager } from "@/components/ui/States";
import { plural } from "@/lib/format";

const tabs = [
  { id: "latest", label: "Latest" },
  { id: "canvases", label: "Canvases" },
  { id: "discussions", label: "Discussions" },
  { id: "classrooms", label: "Classrooms" },
  { id: "peoples", label: "Peoples & Business" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function SectionHeader({ title, tab, onTab }: { title: string; tab?: TabId; onTab?: (t: TabId) => void }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{title}</h3>
      {tab && onTab && (
        <button type="button" onClick={() => onTab(tab)} className="text-base font-medium text-dak-cta">
          See All
        </button>
      )}
    </div>
  );
}

export default function ExploreHubPage() {
  return (
    <Suspense fallback={null}>
      <ExploreHub />
    </Suspense>
  );
}

function ExploreHub() {
  const params = useSearchParams();
  const router = useRouter();
  const initialTab = (tabs.find((t) => t.id === params.get("tab"))?.id ?? "latest") as TabId;
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const q = params.get("q") ?? "";

  const selectTab = (tab: TabId) => {
    setActiveTab(tab);
    router.replace(withQuery("/explore", { tab: tab === "latest" ? undefined : tab, q: q || undefined }), { scroll: false });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading sm:text-[32px]">
          {q ? `Results for “${q}”` : "Explore what the trades are building"}
        </h1>
        <p className="text-base text-auth-slate dark:text-dak-body">
          Public canvases, classrooms, profiles. Newest first.
          {q && (
            <Link href="/explore" className="ml-2 font-medium text-dak-cta">
              Clear search
            </Link>
          )}
        </p>
      </div>

      <div className="flex gap-8 overflow-x-auto border-b border-light-border dark:border-dak-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => selectTab(tab.id)}
            className={`shrink-0 whitespace-nowrap pb-3 text-lg font-medium ${
              activeTab === tab.id ? "border-b-4 border-[#020204] text-[#020204] dark:border-dak-cta dark:text-dak-heading" : "text-[#929292] dark:text-dak-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "latest" && <Latest q={q} onTab={selectTab} />}
      {activeTab === "canvases" && <CanvasesTab q={q} />}
      {activeTab === "discussions" && <DiscussionsTab q={q} />}
      {activeTab === "classrooms" && <ClassroomsTab q={q} />}
      {activeTab === "peoples" && <PeopleTab q={q} />}
    </div>
  );
}

const classCard = (c: ClassroomCard) => (
  <ClassCard
    key={c.id}
    href={`/classrooms/${c.id}`}
    title={c.title}
    subtitle={c.instructor.name}
    modules={plural(c.moduleCount, "module")}
    tag={`${c.enrolledCount} Enrolled`}
    imageSrc={c.imageUrl ?? undefined}
  />
);

const canvasCard = (c: CanvasCard) => (
  <WorkspaceCard
    key={c.id}
    href={`/canvas/${c.id}`}
    title={c.title}
    workspace={c.workspace.name}
    editedAgo={`Edited ${timeAgo(c.updatedAt)} · ${plural(c.productCount, "Product")}`}
    updatedTag={`By ${c.createdBy.name}`}
    collaborators={[c.createdBy]}
    collaboratorCount={c.collaboratorCount}
    imageSrc={c.thumbnailUrl ?? undefined}
  />
);

function Latest({ q, onTab }: { q: string; onTab: (t: TabId) => void }) {
  const [feed, setFeed] = useState<"trending" | "following">("trending");
  const { data: classrooms } = useApiQuery<Paged<ClassroomCard>>(withQuery("/classrooms", { scope: "explore", q, limit: 4 }));
  const { data: posts } = useApiQuery<Paged<Post>>(withQuery("/posts", { feed, q, limit: 3 }));
  const { data: people } = useApiQuery<Paged<PersonCard>>(withQuery("/people", { type: "BUSINESS", q, limit: 3 }));
  const { data: canvases } = useApiQuery<Paged<CanvasCard>>(withQuery("/canvases/public", { q, limit: 4 }));

  return (
    <>
      <section className="flex flex-col gap-4">
        <SectionHeader title="Classrooms" tab="classrooms" onTab={onTab} />
        {classrooms?.items.length === 0 && <p className="text-sm text-[#929292] dark:text-dak-muted">No public classrooms yet.</p>}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">{classrooms?.items.map(classCard)}</div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">From the community</h3>
            <FeedToggle value={feed} onChange={setFeed} />
          </div>
          <Link href="/discover" className="text-base font-medium text-dak-cta">
            See All
          </Link>
        </div>
        {posts?.items.length === 0 && <p className="text-sm text-[#929292] dark:text-dak-muted">No posts to show.</p>}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {posts?.items.map((p) => (
            <CommunityPostCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Business Profiles" tab="peoples" onTab={onTab} />
        {people?.items.length === 0 && <p className="text-sm text-[#929292] dark:text-dak-muted">No business profiles yet.</p>}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {people?.items.map((p) => (
            <BusinessProfileCard key={p.id} person={p} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Public Canvases" tab="canvases" onTab={onTab} />
        {canvases?.items.length === 0 && <p className="text-sm text-[#929292] dark:text-dak-muted">No public canvases yet.</p>}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">{canvases?.items.map(canvasCard)}</div>
      </section>
    </>
  );
}

function CanvasesTab({ q }: { q: string }) {
  const [page, setPage] = useState(1);
  const { data } = useApiQuery<Paged<CanvasCard>>(withQuery("/canvases/public", { q, page, limit: 12 }));
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Public Canvases</h3>
      {!data ? (
        <LoadingGrid minWidth={280} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No public canvases" body="Canvases made public by their creators appear here." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">{data.items.map(canvasCard)}</div>
      )}
      {data && <Pager page={data.page} pages={data.pages} onPage={setPage} />}
    </section>
  );
}

function DiscussionsTab({ q }: { q: string }) {
  const [feed, setFeed] = useState<"trending" | "following">("following");
  const { data: posts } = useApiQuery<Paged<Post>>(withQuery("/posts", { feed, q, limit: 6 }));
  const { data: latest } = useApiQuery<Paged<Post>>(withQuery("/posts", { feed: "latest", q, limit: 6 }));
  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">From the community</h3>
          <FeedToggle value={feed} onChange={setFeed} />
        </div>
        {posts?.items.length === 0 && <p className="text-sm text-[#929292] dark:text-dak-muted">Nothing here yet.</p>}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {posts?.items.map((p) => (
            <CommunityPostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Latest Posts</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {latest?.items.map((p) => (
            <CommunityPostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}

function ClassroomsTab({ q }: { q: string }) {
  const [page, setPage] = useState(1);
  const { data } = useApiQuery<Paged<ClassroomCard>>(withQuery("/classrooms", { scope: "explore", q, page, limit: 12 }));
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Classrooms</h3>
      {!data ? (
        <LoadingGrid minWidth={240} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No public classrooms" body="Published public classrooms appear here." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">{data.items.map(classCard)}</div>
      )}
      {data && <Pager page={data.page} pages={data.pages} onPage={setPage} />}
    </section>
  );
}

function PeopleTab({ q }: { q: string }) {
  const [type, setType] = useState<"BUSINESS" | "INDIVIDUAL" | undefined>("BUSINESS");
  const [page, setPage] = useState(1);
  const { data } = useApiQuery<Paged<PersonCard>>(withQuery("/people", { type, q, page, limit: 12 }));
  const filters = [
    { value: "BUSINESS", label: "Businesses" },
    { value: "INDIVIDUAL", label: "People" },
    { value: undefined, label: "Everyone" },
  ] as const;
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">{type === "INDIVIDUAL" ? "People" : type ? "Business Profiles" : "Peoples & Business"}</h3>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                setType(f.value);
                setPage(1);
              }}
              className={`rounded-xl px-4 py-2 text-base ${type === f.value ? "bg-[#2b2b31] font-semibold text-white dark:bg-dak-cta" : "border border-[#020204] text-[#020204] dark:border-dak-border dark:text-dak-heading"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {!data ? (
        <LoadingGrid minWidth={300} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No profiles found" body="Only public, searchable profiles appear here." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {data.items.map((p) => (
            <BusinessProfileCard key={p.id} person={p} />
          ))}
        </div>
      )}
      {data && <Pager page={data.page} pages={data.pages} onPage={setPage} />}
    </section>
  );
}
