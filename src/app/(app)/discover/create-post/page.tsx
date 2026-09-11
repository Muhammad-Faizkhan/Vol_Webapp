import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import DiscoverPage from "../page";

const tags = ["Load Analysis", "Steel Frame"];

export default function CreatePostModalPage() {
  return (
    <>
      <DiscoverPage />
      <Modal>
        <div className="flex items-start justify-between border-b border-light-border bg-[#f4f4f4] px-6 py-5 dark:border-dak-border dark:bg-dak-bg">
          <div>
            <h2 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Add Post Details</h2>
            <p className="text-sm text-auth-navy dark:text-dak-body">
              Provide context and data for your structural design canvas.
            </p>
          </div>
          <Link href="/discover" aria-label="Close" className="text-xl text-auth-navy dark:text-dak-heading">
            ✕
          </Link>
        </div>

        <div className="flex flex-col gap-6 bg-[#eee] p-6 dark:bg-dak-surface">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">
              Discussion Title <span className="text-auth-navy dark:text-dak-heading">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Clarification on load-bearing span requirements..."
              className="h-14 w-full rounded border border-light-border bg-white px-4 text-base text-[#76777d] focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading dark:placeholder:text-dak-muted"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">
              Category <span className="text-auth-navy dark:text-dak-heading">*</span>
            </label>
            <select
              defaultValue=""
              className="h-14 w-full rounded border border-light-border bg-white px-4 text-base text-[#76777d] focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
            >
              <option value="" disabled>
                Select a Category...
              </option>
              <option>Structural</option>
              <option>Mechanical</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">
                Description &amp; Details
              </label>
              <div className="flex items-center gap-2 text-sm text-auth-navy dark:text-dak-body">
                <span className="font-bold">B</span>
                <span className="italic">I</span>
                <span>|</span>
                <span>≡</span>
                <span>≣</span>
              </div>
            </div>
            <textarea
              rows={4}
              placeholder="Provide context, detailed questions, or instructions here..."
              className="w-full resize-none rounded border border-light-border bg-white px-4 py-3 text-base text-[#76777d] focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading dark:placeholder:text-dak-muted"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Tags</label>
            <div className="flex flex-wrap items-center gap-2 rounded border border-light-border bg-white px-4 py-3 dark:border-dak-border dark:bg-dak-bg">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded bg-[#e3e3e3] px-2 py-1 text-sm text-auth-navy dark:bg-dak-surface dark:text-dak-heading"
                >
                  {tag} ✕
                </span>
              ))}
              <input
                type="text"
                placeholder="Add a tag..."
                className="flex-1 bg-transparent text-base text-[#76777d] focus:outline-none dark:text-dak-heading dark:placeholder:text-dak-muted"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-auth-navy dark:text-dak-heading">Visibility Settings</span>
            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="post-visibility"
                defaultChecked
                className="mt-1 accent-auth-navy dark:accent-dak-cta"
              />
              <div>
                <p className="text-sm font-medium text-auth-navy dark:text-dak-heading">Public</p>
                <p className="text-sm text-[#929292] dark:text-dak-muted">Visible to anyone on the network.</p>
              </div>
            </label>
            <label className="flex items-start gap-3">
              <input type="radio" name="post-visibility" className="mt-1 accent-auth-navy dark:accent-dak-cta" />
              <div>
                <p className="text-sm font-medium text-auth-navy dark:text-dak-heading">Private</p>
                <p className="text-sm text-[#929292] dark:text-dak-muted">
                  Visible only to you and invited collaborators.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end border-t border-light-border bg-white px-6 py-4 dark:border-dak-border dark:bg-dak-surface">
          <Link
            href="/discover/select-canvas"
            className="rounded-lg bg-auth-navy px-6 py-3 text-base font-medium text-white dark:bg-dak-cta"
          >
            Continue
          </Link>
        </div>
      </Modal>
    </>
  );
}
