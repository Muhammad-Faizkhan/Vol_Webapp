"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { errorMessage, titleCase, type InviteLinkPreview } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { Avatar, UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";

/** Where a workspace invite link lands: preview the workspace and ask to join. */
export default function InviteLinkPage() {
  const { token } = useParams<{ token: string }>();
  const toast = useToast();
  const { data, error, mutate } = useApiQuery<InviteLinkPreview>(`/invite-links/${token}`);
  const [busy, setBusy] = useState(false);

  async function request() {
    setBusy(true);
    try {
      await api.post(`/invite-links/${token}/request`);
      await mutate();
      toast("Request sent. You'll be notified when an admin approves it.");
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  if (error) return <ErrorState error={error} />;
  if (!data) return null;
  const { workspace } = data;

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-6 rounded-2xl border border-light-border bg-white p-8 text-center dark:border-dak-border dark:bg-dak-surface">
      <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-auth-navy dark:bg-dak-cta">
        {workspace.imageUrl ? <UserImage src={workspace.imageUrl} /> : <Image src="/illustrations/auth-placeholder.svg" alt="" width={28} height={28} />}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.7px] text-[#929292] dark:text-dak-muted">You&apos;re invited to join</p>
        <h1 className="text-2xl font-bold text-auth-navy dark:text-dak-heading">{workspace.name}</h1>
        {workspace.description && <p className="text-base text-auth-slate dark:text-dak-body">{workspace.description}</p>}
      </div>
      <div className="flex items-center gap-2 text-sm text-auth-slate dark:text-dak-body">
        <Avatar src={workspace.owner.avatarUrl} name={workspace.owner.name} size={28} />
        Owned by {workspace.owner.name} · {workspace.memberCount} member{workspace.memberCount === 1 ? "" : "s"} · joins as {titleCase(data.role)}
      </div>
      {data.isMember ? (
        <Link href={`/workspaces/${workspace.id}`} className="w-full rounded-2xl bg-dak-cta py-4 text-base font-medium text-white">
          Open workspace
        </Link>
      ) : data.requestStatus === "PENDING" ? (
        <p className="w-full rounded-2xl bg-[#f3e8ff] py-4 text-base font-medium text-dak-cta dark:bg-dak-cta/10">Request sent · waiting for approval</p>
      ) : (
        <button type="button" onClick={request} disabled={busy} className="w-full rounded-2xl bg-dak-cta py-4 text-base font-medium text-white disabled:opacity-60">
          {busy ? "Sending…" : data.requestStatus === "DECLINED" ? "Ask again" : "Request to join"}
        </button>
      )}
    </div>
  );
}
