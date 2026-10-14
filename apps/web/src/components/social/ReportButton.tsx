"use client";

import { useState, type FormEvent } from "react";
import { errorMessage } from "@vol/api-client";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

const REASONS = ["Spam", "Harassment", "Hate or abuse", "Counterfeit goods", "Misleading information", "Intellectual property", "Other"];

type Target = "USER" | "POST" | "COMMENT" | "PRODUCT" | "WORKSPACE" | "CANVAS" | "CLASSROOM";

/** "Report" link that opens a small form; reports reach the admin panel's Cases list. */
export function ReportButton({ targetType, targetId, className, label = "Report" }: { targetType: Target; targetId: string; className?: string; label?: string }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/reports", { targetType, targetId, reason, details: details.trim() || undefined });
      toast("Thanks — our moderators will review this.");
      setOpen(false);
      setDetails("");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className ?? "text-sm font-medium text-[#929292] hover:text-red-500 dark:text-dak-muted"}>
        {label}
      </button>
      {open && (
        <Modal maxWidth={460}>
          <form onSubmit={submit} className="flex flex-col gap-4 p-6">
            <h2 className="text-xl font-semibold text-auth-navy dark:text-dak-heading">Report {targetType.toLowerCase()}</h2>
            <label className="flex flex-col gap-2 text-sm font-medium text-auth-navy dark:text-dak-heading">
              Reason
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-11 rounded-lg border border-light-border bg-white px-3 text-sm dark:border-dak-border dark:bg-dak-bg"
              >
                {REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-auth-navy dark:text-dak-heading">
              Details (optional)
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                maxLength={2000}
                className="resize-none rounded-lg border border-light-border bg-white p-3 text-sm dark:border-dak-border dark:bg-dak-bg"
              />
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-light-border px-4 py-2 text-sm dark:border-dak-border dark:text-dak-heading">
                Cancel
              </button>
              <button type="submit" disabled={busy} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {busy ? "Sending…" : "Send report"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
