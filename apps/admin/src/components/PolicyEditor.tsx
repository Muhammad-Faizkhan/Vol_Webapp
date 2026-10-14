"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { errorMessage, formatDate, type Policy } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

// Terms & Conditions and Privacy Policy share this layout (Figma 792:7285 / 792:7364): the
// document in a 770px card, with Edit swapping it for a textarea plus Save/Cancel.
// Saving publishes a new version; the user app's /terms and /privacy pages show the latest one.
export function PolicyEditor({ title, type }: { title: string; type: "terms" | "privacy" }) {
  const { data, error, mutate } = useApiQuery<Policy>(`/admin/policies/${type}`);
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ title: string; message?: string; tone: "success" | "danger" } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  async function save() {
    if (draft === null || !draft.trim()) return;
    setSaving(true);
    try {
      const published = await api.put<Policy>(`/admin/policies/${type}`, { content: draft });
      await mutate(published, { revalidate: false });
      setDraft(null);
      setToast({ title: `${title} updated`, message: `Version ${published.version} is live for every user.`, tone: "success" });
    } catch (err) {
      setToast({ title: "Couldn't publish", message: errorMessage(err), tone: "danger" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={title}
        subtitle={data ? `Version ${data.version} · published ${formatDate(data.publishedAt)}` : "Manage your privacy preferences and policies."}
        actions={
          draft === null ? (
            <button
              type="button"
              disabled={!data && !error}
              onClick={() => setDraft(data?.content ?? "")}
              className="flex h-10 items-center gap-2 rounded-xl bg-dak-cta px-6 text-base font-medium tracking-[-0.32px] text-dak-heading disabled:opacity-60"
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
                onClick={save}
                disabled={saving || !draft.trim()}
                className="flex h-10 items-center rounded-xl bg-dak-cta px-6 text-base font-medium tracking-[-0.32px] text-dak-heading disabled:opacity-60"
              >
                {saving ? "Publishing…" : "Save"}
              </button>
            </>
          )
        }
      />

      <section className="w-full max-w-[770px] rounded-xl border border-white/8 bg-dak-surface p-[25px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        {draft === null ? (
          <p className="whitespace-pre-line text-base leading-[31px] text-dak-body">
            {data?.content ?? (error ? "No published version yet — click Edit to write the first one." : "Loading…")}
          </p>
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

      {toast && <Toast title={toast.title} message={toast.message} tone={toast.tone} onClose={closeToast} />}
    </div>
  );
}
