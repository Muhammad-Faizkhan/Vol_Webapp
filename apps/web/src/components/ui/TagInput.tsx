"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";

/** Removable tag chips plus an "+ Add Tag" button that turns into an inline input. */
export function TagInput({
  tags,
  onChange,
  max = 20,
  chipClassName = "flex h-8 items-center gap-1 rounded-xl border border-white bg-[#020204] px-[13px] text-xs font-semibold text-white dark:border-dak-cta dark:bg-transparent dark:text-dak-heading",
  addClassName = "flex h-8 items-center rounded-xl border border-[#9436fb] bg-[rgba(148,54,251,0.2)] px-[13px] text-xs font-semibold text-[#9436fb] dark:border-dak-border dark:bg-transparent dark:text-dak-heading",
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  max?: number;
  chipClassName?: string;
  addClassName?: string;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function commit() {
    const tag = draft.trim().slice(0, 60);
    if (tag && !tags.some((t) => t.toLowerCase() === tag.toLowerCase()) && tags.length < max) onChange([...tags, tag]);
    setDraft("");
    setAdding(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      setDraft("");
      setAdding(false);
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-2">
      {tags.map((tag) => (
        <span key={tag} className={chipClassName}>
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="flex size-4 items-center justify-center"
          >
            <Image src="/icons/tag-close.svg" alt="" width={8} height={8} className="invert dark:invert-0" />
          </button>
        </span>
      ))}
      {adding ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          placeholder="Type and press Enter"
          className="h-8 w-40 rounded-xl border border-[#9436fb] bg-transparent px-3 text-xs text-[#020204] focus:outline-none dark:border-dak-border dark:text-dak-heading"
        />
      ) : (
        tags.length < max && (
          <button type="button" onClick={() => setAdding(true)} className={addClassName}>
            + Add Tag
          </button>
        )
      )}
    </div>
  );
}
