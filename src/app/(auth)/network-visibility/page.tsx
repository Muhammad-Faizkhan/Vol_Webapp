"use client";

import Image from "next/image";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

function NetworkVisibilityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const persona = searchParams.get("persona");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      localStorage.setItem("vol-persona", persona === "business" ? "business" : "individual");
    } catch {
      // ignore write failures (private browsing, etc.)
    }
    router.push(persona === "business" ? "/business/home" : "/home");
  }

  const publicSelected = visibility === "public";
  const privateSelected = visibility === "private";

  return (
    <AuthShell contentWidth={652} backHref={persona ? `/create-profile?persona=${persona}` : "/create-profile"}>
      <div className="flex w-full flex-col items-center gap-[clamp(0.375rem,1.5dvh,2.5rem)]">
        <div className="flex w-full max-w-[396px] flex-col items-center gap-[clamp(0.375rem,1dvh,1.5rem)]">
          <Image
            src="/illustrations/vol-logo.png"
            alt="VÔL"
            width={72}
            height={108}
            className="h-[clamp(40px,6dvh,108px)] w-auto object-cover"
          />
          <div className="flex w-full max-w-[380px] flex-col items-start gap-1.5">
            <h1 className="w-full text-center text-2xl font-medium tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[clamp(1.25rem,4dvh,2rem)]">
              Profile Setup Complete
            </h1>
            <p className="w-full text-center text-base text-[#2b2b31] dark:text-dak-body">
              Configure your network presence and launch your workspace.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-[clamp(0.375rem,1.2dvh,1rem)] rounded-xl border border-[#9436fb] border-t-[3px] bg-white/70 px-6 py-[clamp(0.75rem,2.5dvh,3.0625rem)] shadow-[0px_0px_10px_0px_rgba(148,54,251,0.5)] dark:border-dak-cta dark:bg-[#121212] sm:px-[41px]"
        >
          <h2 className="w-full border-b border-[#c793ff] pb-[clamp(0.5rem,1.5dvh,1.0625rem)] text-2xl font-semibold text-[#020204] dark:border-dak-border dark:text-dak-heading">
            Network Visibility
          </h2>

          <div className="flex w-full flex-col gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-[clamp(0.625rem,2dvh,1.0625rem)] shadow-[0px_8px_12px_0px_rgba(2,2,4,0.5)] transition-colors ${
                publicSelected
                  ? "border-[#020204] bg-[#020204] dark:border-dak-cta dark:bg-dak-cta"
                  : "border-light-border bg-white dark:border-dak-border dark:bg-transparent"
              }`}
            >
              <input
                type="radio"
                name="visibility"
                checked={publicSelected}
                onChange={() => setVisibility("public")}
                className={`size-5 shrink-0 accent-[#9436fb] ${
                  publicSelected ? "dark:accent-white" : "dark:accent-dak-cta"
                }`}
              />
              <div className="flex flex-1 flex-col items-start gap-2">
                <div className="flex w-full flex-wrap items-center gap-2">
                  <Image
                    src="/icons/globe.svg"
                    alt=""
                    width={17}
                    height={17}
                    className={publicSelected ? "invert dark:invert" : "dark:invert"}
                  />
                  <span
                    className={`text-lg font-medium tracking-[0.28px] ${
                      publicSelected ? "text-white dark:text-white" : "text-[#020204] dark:text-dak-heading"
                    }`}
                  >
                    Public Portfolio
                  </span>
                  <span
                    className={`ml-auto rounded-xl px-2 py-0.5 font-heading text-[10px] uppercase tracking-[0.5px] ${
                      publicSelected
                        ? "bg-[#6f23c2] text-white dark:bg-white/20 dark:text-white"
                        : "bg-[rgba(79,98,110,0.1)] text-[#45464d] dark:bg-dak-cta/10 dark:text-dak-heading"
                    }`}
                  >
                    Recommended
                  </span>
                </div>
                <p
                  className={`text-base ${
                    publicSelected ? "text-white dark:text-white/90" : "text-[#2b2b31] dark:text-dak-body"
                  }`}
                >
                  Your profile, projects, and credentials will be visible to
                  all platform users and indexed in the global directory.
                </p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-[clamp(0.625rem,2dvh,1.0625rem)] transition-colors ${
                privateSelected
                  ? "border-[#020204] bg-[#020204] dark:border-dak-cta dark:bg-dak-cta"
                  : "border-light-border bg-white dark:border-dak-border dark:bg-transparent"
              }`}
            >
              <input
                type="radio"
                name="visibility"
                checked={privateSelected}
                onChange={() => setVisibility("private")}
                className={`size-5 shrink-0 accent-[#9436fb] ${
                  privateSelected ? "dark:accent-white" : "dark:accent-dak-cta"
                }`}
              />
              <div className="flex flex-1 flex-col items-start gap-2">
                <div className="flex w-full items-center gap-2">
                  <Image
                    src="/icons/lock-small.svg"
                    alt=""
                    width={14}
                    height={18}
                    className={privateSelected ? "invert dark:invert" : "dark:invert"}
                  />
                  <span
                    className={`text-lg font-medium tracking-[0.28px] ${
                      privateSelected ? "text-white dark:text-white" : "text-[#020204] dark:text-dak-heading"
                    }`}
                  >
                    Private Network
                  </span>
                </div>
                <p
                  className={`text-base ${
                    privateSelected ? "text-white dark:text-white/90" : "text-[#2b2b31] dark:text-dak-body"
                  }`}
                >
                  Your profile remains hidden. You can only collaborate via
                  direct invites from existing workspaces or verified
                  connections.
                </p>
              </div>
            </label>

            <div className="flex w-full flex-col items-start">
              <h3 className="w-full pb-2 pt-3 font-heading text-lg font-medium uppercase tracking-[0.7px] text-[#020204] dark:text-dak-heading">
                Data Preferences
              </h3>
              <div className="flex w-full flex-wrap items-center justify-between gap-4 border-b border-[#c793ff] pb-2 pt-2 dark:border-dak-border">
                <div className="flex flex-col items-start gap-3">
                  <span className="text-lg font-medium tracking-[0.28px] text-[#020204] dark:text-dak-heading">
                    Allow Search Indexing
                  </span>
                  <span className="text-base text-[#2b2b31] dark:text-dak-body">
                    Include profile in internal talent searches.
                  </span>
                </div>
                <Toggle name="searchIndexing" defaultChecked className="!bg-[#020204] dark:!bg-dak-cta" />
              </div>
            </div>
          </div>

          <div className="w-full pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="!rounded-2xl !bg-dak-cta !shadow-[0px_8px_16px_rgba(148,54,251,0.4)] dark:!rounded-full"
            >
              {submitting ? "Launching…" : "Complete Setup"}
            </Button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}

export default function NetworkVisibilityPage() {
  return (
    <Suspense fallback={null}>
      <NetworkVisibilityForm />
    </Suspense>
  );
}
