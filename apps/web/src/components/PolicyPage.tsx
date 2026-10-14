"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Policy } from "@vol/api-client";
import { useApiQuery } from "@vol/api-client/react";
import { ErrorState } from "@/components/ui/States";

/** Public Terms / Privacy page, showing the version admins last published. */
export function PolicyPage({ type, title }: { type: "terms" | "privacy"; title: string }) {
  const router = useRouter();
  const { data, error } = useApiQuery<Policy>(`/policies/${type}`);
  return (
    <main className="mx-auto flex w-full max-w-[860px] flex-col gap-6 px-4 py-10 sm:px-6">
      <button type="button" onClick={() => router.back()} className="flex w-fit items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
        <Image src="/icons/arrow-narrow-right.svg" alt="" width={20} height={20} className="-scale-y-100 rotate-180 dark:invert" />
        Back
      </button>
      <div className="flex items-center gap-4">
        <Image src="/illustrations/vol-logo.png" alt="VÔL" width={48} height={48} className="h-12 w-auto" />
        <h1 className="text-3xl font-bold text-auth-navy dark:text-dak-heading">{title}</h1>
      </div>
      {error && <ErrorState error={error} />}
      {data && (
        <>
          <p className="text-sm text-[#929292] dark:text-dak-muted">
            Version {data.version} · Last updated {new Date(data.publishedAt).toLocaleDateString()}
          </p>
          <div className="whitespace-pre-wrap rounded-2xl border border-light-border bg-white p-6 text-base leading-7 text-[#2b2b31] dark:border-dak-border dark:bg-dak-surface dark:text-dak-body">
            {data.content}
          </div>
        </>
      )}
    </main>
  );
}
