import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { WorkspaceCard } from "@/components/cards/WorkspaceCard";
import DiscoverPage from "../page";

const canvases = Array.from({ length: 6 }).map((_, i) => ({
  href: `/canvas/${i + 1}`,
  title: "Lorem Ipsum Title",
  meta: "Lorem Ipsum Workspace",
  metaSecondary: "Edited 12min ago . 4 Products",
  collaboratorCount: 3,
}));

export default function SelectCanvasModalPage() {
  return (
    <>
      <DiscoverPage />
      <Modal maxWidth={1420}>
        <div className="flex items-center justify-between gap-3 border-b border-light-border px-4 py-4 dark:border-dak-border sm:px-[50px] sm:py-6">
          <Link href="/discover/create-post" className="flex items-center gap-2 text-lg text-auth-navy dark:text-dak-heading">
            ✕ Cancel
          </Link>
          <h2 className="text-xl font-semibold text-auth-navy dark:text-dak-heading sm:text-2xl">Select a Canvas</h2>
          <div className="w-[60px] sm:w-[80px]" />
        </div>

        <div className="border-b border-light-border/50 bg-[#f4f4f4] px-4 py-4 dark:border-dak-border dark:bg-dak-bg sm:px-10 sm:py-6 lg:px-[120px]">
          <input
            type="search"
            placeholder="Search canvases by name or project..."
            className="h-11 w-full rounded border border-light-border bg-white px-4 text-sm text-[#45464d] focus:outline-none dark:border-dak-border dark:bg-dak-surface dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 px-4 py-4 dark:bg-dak-surface sm:px-10 sm:py-6 lg:px-[100px]">
          {canvases.map((c, i) => (
            <WorkspaceCard key={i} variant="grid" {...c} />
          ))}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-light-border px-4 py-4 dark:border-dak-border sm:flex-row sm:justify-between sm:px-8 sm:py-5">
          <Link
            href="/discover"
            className="rounded-lg bg-[#f2f2f3] px-6 py-3 text-center text-base font-medium text-auth-navy dark:bg-dak-bg dark:text-dak-heading"
          >
            Skip &amp; Post
          </Link>
          <Link
            href="/discover"
            className="flex items-center justify-center gap-2 rounded-lg bg-auth-navy px-6 py-3 text-base font-medium text-white dark:bg-dak-cta"
          >
            Continue →
          </Link>
        </div>
      </Modal>
    </>
  );
}
