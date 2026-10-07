"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast } from "@/components/ui/Toast";

// Terms & Conditions and Privacy Policy share this layout (Figma 792:7285 / 792:7364): the
// document in a 770px card, with Edit swapping it for a textarea plus Save/Cancel.
export function PolicyEditor({ title, initialText }: { title: string; initialText: string }) {
  const [text, setText] = useState(initialText);
  const [draft, setDraft] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const closeToast = useCallback(() => setSaved(false), []);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={title}
        subtitle="Manage your privacy preferences and policies."
        actions={
          draft === null ? (
            <button
              type="button"
              onClick={() => setDraft(text)}
              className="flex h-10 items-center gap-2 rounded-xl bg-dak-cta px-6 text-base font-medium tracking-[-0.32px] text-dak-heading"
            >
              <Image src="/icons/edit-pencil.svg" alt="" width={24} height={24} />
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="flex h-10 items-center rounded-xl border border-dak-body px-6 text-base font-medium tracking-[-0.32px] text-dak-body"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setText(draft);
                  setDraft(null);
                  setSaved(true);
                }}
                className="flex h-10 items-center rounded-xl bg-dak-cta px-6 text-base font-medium tracking-[-0.32px] text-dak-heading"
              >
                Save
              </button>
            </>
          )
        }
      />

      <section className="w-full max-w-[770px] rounded-xl border border-white/8 bg-dak-surface p-[25px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        {draft === null ? (
          <p className="whitespace-pre-line text-base leading-[31px] text-dak-body">{text}</p>
        ) : (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={`${title} text`}
            autoFocus
            className="min-h-[480px] w-full resize-y rounded-lg border border-dak-border bg-transparent p-3 text-base leading-[31px] text-dak-body focus:border-dak-cta focus:outline-none"
          />
        )}
      </section>

      {saved && <Toast title={`${title} updated`} message="Changes are live for every user." tone="success" onClose={closeToast} />}
    </div>
  );
}
