"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import DiscoverPage from "../page";

const categories = ["Structural", "Mechanical", "Electrical", "Civil", "HVAC"];

export default function CreatePostModalPage() {
  const router = useRouter();
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>(["Load Analysis", "Steel Frame"]);
  const [tagInput, setTagInput] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [errors, setErrors] = useState<{ title?: string; category?: string }>({});

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { title?: string; category?: string } = {};
    if (!title.trim()) nextErrors.title = "Discussion title is required.";
    if (!category) nextErrors.category = "Please select a category.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      window.localStorage.setItem(
        "vol-create-post-draft",
        JSON.stringify({ title, category, description, tags, visibility })
      );
    } catch {
      // localStorage unavailable — proceed without persisting the draft
    }

    router.push("/discover/select-canvas");
  };

  return (
    <>
      <DiscoverPage />
      <Modal maxWidth={768}>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-center justify-between bg-white px-6 py-5 dark:bg-dak-bg">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold text-[#020204] dark:text-dak-heading">Add Post Details</h2>
              <p className="text-sm text-[#2b2b31] dark:text-dak-body">
                Provide context and data for your structural design canvas.
              </p>
            </div>
            <Link
              href="/discover"
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Image src="/icons/close-x.svg" alt="" width={14} height={14} className="dark:invert" />
            </Link>
          </div>

          <div className="flex flex-col gap-6 bg-gradient-to-b from-[rgba(238,238,238,0)] to-[#faf5ff] p-6 dark:bg-dak-surface dark:from-transparent dark:to-transparent">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#020204] dark:text-dak-heading">
                Discussion Title <span>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Clarification on load-bearing span requirements..."
                className="h-14 w-full rounded-xl border border-[#2b2b31] bg-white px-[17px] text-base text-[#020204] placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading dark:placeholder:text-dak-muted"
              />
              {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#020204] dark:text-dak-heading">
                Category <span>*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-14 w-full appearance-none rounded-xl border border-[#2b2b31] bg-white px-[17px] text-base text-[#2b2b31] focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
                >
                  <option value="" disabled>
                    Select a Category...
                  </option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Image
                  src="/icons/chevron-down-small.svg"
                  alt=""
                  width={12}
                  height={7.4}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 dark:invert"
                />
              </div>
              {errors.category && <span className="text-xs text-red-500">{errors.category}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <label className="text-sm font-medium text-[#020204] dark:text-dak-heading">
                  Description &amp; Details
                </label>
                <div className="flex items-center gap-1 rounded border border-[#2b2b31] px-1.5 py-1 dark:border-dak-border">
                  <button type="button" aria-label="Bold" className="rounded p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                    <Image src="/icons/format-bold.svg" alt="" width={7.8} height={10.5} className="dark:invert" />
                  </button>
                  <button type="button" aria-label="Italic" className="rounded p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                    <Image src="/icons/format-italic.svg" alt="" width={9.75} height={10.5} className="dark:invert" />
                  </button>
                  <span className="mx-0.5 h-5 w-px bg-[#2b2b31] dark:bg-dak-border" />
                  <button type="button" aria-label="Numbered list" className="rounded p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                    <Image src="/icons/format-list-numbered.svg" alt="" width={13.5} height={15} className="dark:invert" />
                  </button>
                  <button type="button" aria-label="Bulleted list" className="rounded p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                    <Image src="/icons/format-list-bulleted.svg" alt="" width={13.5} height={12} className="dark:invert" />
                  </button>
                </div>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide context, detailed questions, or instructions here..."
                className="w-full resize-none rounded-xl border border-[#2b2b31] bg-white px-[17px] py-[13px] text-base text-[#020204] placeholder:text-[#929292] focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading dark:placeholder:text-dak-muted"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#020204] dark:text-dak-heading">Tags</label>
              <div
                onClick={() => tagInputRef.current?.focus()}
                className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl border border-[#2b2b31] bg-white px-[13px] py-[10px] dark:border-dak-border dark:bg-dak-bg"
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-sm bg-[#2b2b31] px-2.5 py-1 text-xs font-semibold text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove ${tag}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tag);
                      }}
                      className="flex items-center justify-center"
                    >
                      <Image src="/icons/tag-remove.svg" alt="" width={8} height={8} />
                    </button>
                  </span>
                ))}
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder="Add a tag..."
                  className="min-w-[100px] flex-1 bg-transparent text-sm text-[#020204] placeholder:text-[#929292] focus:outline-none dark:text-dak-heading dark:placeholder:text-dak-muted"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs text-[#020204] dark:text-dak-heading">Visibility Settings</span>
              <div role="radiogroup" className="flex flex-col gap-3">
                <button
                  type="button"
                  role="radio"
                  aria-checked={visibility === "public"}
                  onClick={() => setVisibility("public")}
                  className="flex items-start gap-3 text-left"
                >
                  <span
                    className={`mt-0.5 size-4 shrink-0 rounded-full ${
                      visibility === "public" ? "border-4 border-dak-cta" : "border border-[#020204] dark:border-dak-border"
                    }`}
                  />
                  <span>
                    <p className="text-sm font-medium text-[#020204] dark:text-dak-heading">Public</p>
                    <p className="text-sm text-[#2b2b31] dark:text-dak-muted">Visible to anyone on the network.</p>
                  </span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={visibility === "private"}
                  onClick={() => setVisibility("private")}
                  className="flex items-start gap-3 text-left"
                >
                  <span
                    className={`mt-0.5 size-4 shrink-0 rounded-full ${
                      visibility === "private" ? "border-4 border-dak-cta" : "border border-[#020204] dark:border-dak-border"
                    }`}
                  />
                  <span>
                    <p className="text-sm font-medium text-[#020204] dark:text-dak-heading">Private</p>
                    <p className="text-sm text-[#2b2b31] dark:text-dak-muted">
                      Visible only to you and invited collaborators.
                    </p>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end bg-white px-6 py-4 dark:bg-dak-surface">
            <button
              type="submit"
              className="h-12 w-[166px] rounded-2xl bg-dak-cta text-sm font-medium text-white shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
            >
              Post on Feed
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
