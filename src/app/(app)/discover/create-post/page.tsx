import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import DiscoverPage from "../page";

const tags = ["Load Analysis", "Steel Frame"];

export default function CreatePostModalPage() {
  return (
    <>
      <DiscoverPage />
      <Modal>
        <div className="flex items-start justify-between border-b border-light-border bg-[#f4f4f4] px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-auth-navy">Add Post Details</h2>
            <p className="text-sm text-auth-navy">
              Provide context and data for your structural design canvas.
            </p>
          </div>
          <Link href="/discover" aria-label="Close" className="text-xl text-auth-navy">
            ✕
          </Link>
        </div>

        <div className="flex flex-col gap-6 bg-[#eee] p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy">
              Discussion Title <span className="text-auth-navy">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Clarification on load-bearing span requirements..."
              className="h-14 rounded border border-light-border bg-white px-4 text-base text-[#76777d] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy">
              Category <span className="text-auth-navy">*</span>
            </label>
            <select
              defaultValue=""
              className="h-14 rounded border border-light-border bg-white px-4 text-base text-[#76777d] focus:outline-none"
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
              <label className="text-sm font-medium text-auth-navy">
                Description &amp; Details
              </label>
              <div className="flex items-center gap-2 text-sm text-auth-navy">
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
              className="resize-none rounded border border-light-border bg-white px-4 py-3 text-base text-[#76777d] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-auth-navy">Tags</label>
            <div className="flex flex-wrap items-center gap-2 rounded border border-light-border bg-white px-4 py-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded bg-[#e3e3e3] px-2 py-1 text-sm text-auth-navy"
                >
                  {tag} ✕
                </span>
              ))}
              <input
                type="text"
                placeholder="Add a tag..."
                className="flex-1 text-base text-[#76777d] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-auth-navy">Visibility Settings</span>
            <label className="flex items-start gap-3">
              <input type="radio" name="post-visibility" defaultChecked className="mt-1 accent-auth-navy" />
              <div>
                <p className="text-sm font-medium text-auth-navy">Public</p>
                <p className="text-sm text-[#929292]">Visible to anyone on the network.</p>
              </div>
            </label>
            <label className="flex items-start gap-3">
              <input type="radio" name="post-visibility" className="mt-1 accent-auth-navy" />
              <div>
                <p className="text-sm font-medium text-auth-navy">Private</p>
                <p className="text-sm text-[#929292]">
                  Visible only to you and invited collaborators.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end border-t border-light-border bg-white px-6 py-4">
          <Link
            href="/discover/select-canvas"
            className="rounded-lg bg-auth-navy px-6 py-3 text-base font-medium text-white"
          >
            Continue
          </Link>
        </div>
      </Modal>
    </>
  );
}
