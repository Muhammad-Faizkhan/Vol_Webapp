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
        <div className="flex items-center justify-between border-b border-light-border px-[50px] py-6">
          <Link href="/discover/create-post" className="flex items-center gap-2 text-lg text-auth-navy">
            ✕ Cancel
          </Link>
          <h2 className="text-2xl font-semibold text-auth-navy">Select a Canvas</h2>
          <div className="w-[80px]" />
        </div>

        <div className="border-b border-light-border/50 bg-[#f4f4f4] px-[287px] py-6">
          <input
            type="search"
            placeholder="Search canvases by name or project..."
            className="h-11 w-full rounded border border-light-border bg-white px-4 text-sm text-[#45464d] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-4 px-[239px] py-6">
          {canvases.map((c, i) => (
            <WorkspaceCard key={i} variant="grid" {...c} />
          ))}
        </div>

        <div className="flex justify-between border-t border-light-border px-8 py-5">
          <Link
            href="/discover"
            className="rounded-lg bg-[#f2f2f3] px-6 py-3 text-base font-medium text-auth-navy"
          >
            Skip &amp; Post
          </Link>
          <Link
            href="/discover"
            className="flex items-center gap-2 rounded-lg bg-auth-navy px-6 py-3 text-base font-medium text-white"
          >
            Continue →
          </Link>
        </div>
      </Modal>
    </>
  );
}
