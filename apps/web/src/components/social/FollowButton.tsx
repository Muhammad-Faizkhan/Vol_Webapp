"use client";

import { useState } from "react";
import { errorMessage } from "@vol/api-client";
import { useInvalidate } from "@vol/api-client/react";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

export function FollowButton({
  userId,
  initial,
  className = "flex h-8 w-20 shrink-0 items-center justify-center rounded-lg bg-[#2b2b31] px-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-dak-cta",
  followingClassName = "flex h-8 w-20 shrink-0 items-center justify-center rounded-lg border border-[#2b2b31] px-2 text-sm font-medium text-[#2b2b31] disabled:opacity-60 dark:border-dak-border dark:text-dak-heading",
  labels = ["Follow", "Following"],
}: {
  userId: string;
  initial: boolean;
  className?: string;
  followingClassName?: string;
  labels?: [string, string];
}) {
  const [following, setFollowing] = useState(initial);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const invalidate = useInvalidate();

  async function toggle() {
    setBusy(true);
    const next = !following;
    setFollowing(next); // optimistic
    try {
      if (next) await api.post(`/users/${userId}/follow`);
      else await api.del(`/users/${userId}/follow`);
      await invalidate("/users/suggestions", `/users/${userId}`, "/people", "/posts?feed=following");
    } catch (err) {
      setFollowing(!next);
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={toggle} disabled={busy} aria-pressed={following} className={following ? followingClassName : className}>
      {following ? labels[1] : labels[0]}
    </button>
  );
}
