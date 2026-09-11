"use client";

import Image from "next/image";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";

const tags = ["Sustainability", "BIM"];

function IndividualProfileForm({ persona }: { persona: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const fullName = String(data.get("fullName") ?? "").trim();

    if (!fullName) {
      setError("Enter your name to continue.");
      return;
    }

    setError(null);
    setSubmitting(true);
    router.push(persona ? `/network-visibility?persona=${persona}` : "/network-visibility");
  }

  return (
    <AuthShell contentWidth={652} backHref="/join-network">
      <div className="flex w-full flex-col items-center gap-[clamp(0.25rem,1.2dvh,2.5rem)]">
        <div className="flex w-full max-w-[396px] flex-col items-center gap-[clamp(0.375rem,1dvh,1.5rem)]">
          <Image
            src="/illustrations/vol-logo.png"
            alt="VÔL"
            width={72}
            height={108}
            className="h-[clamp(36px,5dvh,80px)] w-auto object-cover"
          />
          <div className="flex w-full max-w-[380px] flex-col items-start gap-1.5">
            <h1 className="w-full text-center text-2xl font-medium tracking-[-0.32px] text-[#020204] dark:text-dak-heading sm:text-[clamp(1.25rem,4dvh,2rem)]">
              Create Personal Profile
            </h1>
            <p className="w-full text-center text-base font-medium text-[#2b2b31] dark:text-dak-body">
              Tell us a bit about yourself to tailor your experience.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-[clamp(0.375rem,1.2dvh,1rem)] rounded-xl border border-[#712ae2] border-t-[3px] bg-white/70 px-6 py-[clamp(0.625rem,1.5dvh,1.75rem)] shadow-[0px_0px_10px_0px_rgba(148,54,251,0.5)] dark:border-dak-cta dark:bg-[#121212] sm:px-[41px]"
        >
          <div className="flex w-full flex-wrap items-center gap-3 border-b border-[rgba(148,54,251,0.6)] pb-[clamp(0.5rem,1.2dvh,1rem)] dark:border-dak-border">
            <div className="flex size-[clamp(44px,5.5dvh,80px)] items-center justify-center rounded-xl border border-dashed border-[#9436fb] bg-[#020204] dark:border-dak-border dark:bg-transparent">
              <Image src="/icons/user-rounded-small.svg" alt="" width={36} height={36} />
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-base font-medium tracking-[0.28px] text-[#020204] dark:text-dak-heading">
                Profile Photo
              </span>
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#2b2b31] px-[17px] text-base font-medium tracking-[0.28px] text-[#2b2b31] dark:border-dak-border dark:text-dak-heading"
              >
                <Image src="/icons/camera.svg" alt="" width={18} height={16} className="invert dark:invert-0" />
                Upload Image
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-1.5">
            <label className="text-base font-medium text-[#020204] dark:text-dak-heading">Full Name</label>
            <div className="relative h-[clamp(44px,7dvh,56px)] w-full">
              <div className="absolute inset-0 rounded-xl border border-[rgba(43,43,49,0.6)] bg-white/50 dark:border-dak-border dark:bg-transparent" />
              <div className="relative flex h-full items-center px-6">
                <input
                  name="fullName"
                  placeholder="Enter your name"
                  className="w-full bg-transparent text-base text-[#2b2b31] placeholder:text-[rgba(43,43,49,0.6)] focus:outline-none dark:text-dak-heading dark:placeholder:text-dak-muted"
                />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-1.5">
            <label className="text-base font-medium text-[#020204] dark:text-dak-heading">Bio</label>
            <textarea
              name="bio"
              rows={3}
              placeholder="Briefly describe your expertise and goals..."
              className="h-[clamp(40px,5.5dvh,80px)] w-full resize-none rounded-xl border border-[rgba(43,43,49,0.6)] bg-white/50 px-6 py-3 text-base text-[#2b2b31] placeholder:text-[rgba(43,43,49,0.6)] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
            />
          </div>

          <div className="flex w-full flex-col items-start gap-1.5">
            <label className="text-base font-medium text-[#020204] dark:text-dak-heading">Interest</label>
            <div className="relative h-[clamp(44px,7dvh,56px)] w-full">
              <select
                name="interest"
                defaultValue=""
                className="h-full w-full appearance-none rounded-xl border border-[rgba(43,43,49,0.6)] bg-white/50 px-6 text-base text-[rgba(43,43,49,0.6)] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading"
              >
                <option value="" disabled>
                  Select your main area of focus
                </option>
                <option value="architecture">Architecture</option>
                <option value="engineering">Engineering</option>
                <option value="construction">Construction</option>
              </select>
              <Image
                src="/icons/dropdown-arrow.svg"
                alt=""
                width={24}
                height={24}
                className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 dark:invert"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-1.5">
            <span className="text-base text-[#4f626e] dark:text-dak-heading">Category Tags</span>
            <div className="flex flex-wrap items-start gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex h-8 items-center gap-1 rounded-xl border border-white bg-[#020204] px-[13px] text-xs font-semibold text-white dark:border-dak-cta dark:bg-transparent dark:text-dak-heading"
                >
                  {tag}
                  <Image src="/icons/tag-close.svg" alt="" width={8} height={8} className="invert dark:invert-0" />
                </span>
              ))}
              <button
                type="button"
                className="flex h-8 items-center rounded-xl border border-[#9436fb] bg-[rgba(148,54,251,0.2)] px-[13px] text-xs font-semibold text-[#9436fb] dark:border-dak-border dark:bg-transparent dark:text-dak-heading"
              >
                + Add Tag
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1.5 border-t border-[rgba(148,54,251,0.6)] pt-[clamp(0.5rem,1.2dvh,1rem)] dark:border-dak-border">
            <span className="text-base font-medium tracking-[0.28px] text-[#4f626e] dark:text-dak-heading">
              Portfolio Links
            </span>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#020204] dark:bg-dak-cta">
                <Image src="/icons/link.svg" alt="" width={20} height={10} />
              </div>
              <input
                type="url"
                name="portfolioUrl"
                placeholder="Portfolio URL (e.g., https://johndoe.com)"
                className="h-14 min-w-0 flex-1 rounded-xl border border-[rgba(43,43,49,0.6)] bg-white/50 px-[13px] text-base text-[#2b2b31] placeholder:text-[rgba(43,43,49,0.6)] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
              />
            </div>
          </div>

          {error && <p className="w-full text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

          <div className="w-full pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="!rounded-2xl !bg-dak-cta !shadow-[0px_8px_16px_rgba(148,54,251,0.4)] dark:!rounded-full"
            >
              {submitting ? "Saving…" : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}

const industrySegments = ["Architecture", "Engineering", "Construction", "Manufacturing"];
const specialties = ["Structural", "Mechanical", "Electrical", "Civil", "Industrial Design"];

function BusinessRegistrationForm({ persona }: { persona: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const businessName = String(data.get("businessName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (!businessName || !email) {
      setError("Enter your legal business name and a contact email to continue.");
      return;
    }

    setError(null);
    setSubmitting(true);
    router.push(persona ? `/network-visibility?persona=${persona}` : "/network-visibility");
  }

  return (
    <AuthShell contentWidth={820} backHref="/join-network">
      <div className="flex w-full flex-col items-center gap-[clamp(0.25rem,0.6dvh,0.625rem)]">
        <div className="flex w-full flex-col items-center gap-2">
          <Image
            src="/illustrations/vol-logo.png"
            alt="VÔL"
            width={100}
            height={150}
            className="h-[clamp(28px,3dvh,48px)] w-auto object-cover"
          />
          <h1 className="text-center text-2xl font-bold text-[#020204] dark:text-dak-heading sm:text-[clamp(1.25rem,4dvh,2rem)]">
            Business Registration
          </h1>
          <p className="w-full max-w-[575px] text-center text-base font-medium leading-[23px] text-[#2b2b31] dark:text-dak-body">
            Join the leading network of precision engineering firms and manufacturers.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-[clamp(0.5rem,0.8dvh,0.75rem)] rounded-xl border border-[#712ae2] border-t-[3px] bg-white/70 px-6 py-[clamp(0.5rem,0.8dvh,1rem)] shadow-[0px_0px_10px_0px_rgba(148,54,251,0.5)] dark:border-dak-cta dark:bg-[#121212] sm:px-[41px]"
        >
          <button
            type="button"
            className="flex h-[clamp(56px,5.5dvh,80px)] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#c6c6cd] bg-[#f5f5f5] dark:border-dak-border dark:bg-[#2b2b31]"
          >
            <Image src="/icons/upload-cloud.svg" alt="" width={24} height={30} className="invert dark:invert-0" />
            <span className="text-sm text-[#2b2b31] dark:text-dak-body">or drag and drop</span>
            <span className="text-xs font-semibold text-[#2b2b31] dark:text-dak-body">PDF, PNG, JPG up to 10MB</span>
            <span className="flex h-[29px] items-center justify-center rounded-md bg-[#e4e4e7] px-4 text-sm font-bold text-[#020204] dark:bg-[#45464d] dark:text-dak-heading">
              Upload cover image
            </span>
          </button>

          <div className="flex w-full flex-wrap items-center gap-3 border-b border-[rgba(148,54,251,0.6)] pb-[clamp(0.375rem,0.7dvh,0.625rem)] dark:border-dak-border">
            <div className="flex size-[clamp(36px,3.5dvh,52px)] items-center justify-center rounded-xl border border-dashed border-[#9436fb] bg-[#020204] dark:border-dak-border dark:bg-transparent">
              <Image src="/icons/user-rounded-small.svg" alt="" width={36} height={36} />
            </div>
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#2b2b31] px-[17px] text-base font-medium tracking-[0.28px] text-[#2b2b31] dark:border-dak-border dark:text-dak-heading"
            >
              <Image src="/icons/camera.svg" alt="" width={18} height={16} className="invert dark:invert-0" />
              Upload Image
            </button>
          </div>

          <div className="flex w-full flex-col gap-[clamp(0.375rem,0.7dvh,0.625rem)] border-b border-[rgba(148,54,251,0.6)] pb-[clamp(0.375rem,0.7dvh,0.625rem)] dark:border-dak-border">
            <h2 className="text-xl font-bold text-[#020204] dark:text-dak-heading sm:text-2xl">Business Information</h2>
            <div className="flex w-full flex-col items-start gap-1.5">
              <label className="text-base font-medium text-[#020204] dark:text-dak-heading">
                Legal Business Name <span className="text-red-500 dark:text-dak-body">*</span>
              </label>
              <div className="h-[clamp(44px,7dvh,56px)] w-full rounded-xl border border-[rgba(43,43,49,0.6)] dark:border-dak-border">
                <input
                  name="businessName"
                  placeholder="Enter your company's legal name"
                  className="h-full w-full bg-transparent px-6 text-base text-[#2b2b31] placeholder:text-[rgba(43,43,49,0.6)] focus:outline-none dark:text-dak-heading dark:placeholder:text-dak-muted"
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-[clamp(0.375rem,0.7dvh,0.625rem)] sm:grid-cols-2">
              <div className="flex w-full flex-col items-start gap-1.5">
                <label className="text-base font-medium text-[#020204] dark:text-dak-heading">Primary Specialty</label>
                <div className="relative h-[clamp(44px,7dvh,56px)] w-full">
                  <select
                    name="specialty"
                    defaultValue=""
                    className="h-full w-full appearance-none rounded-xl border border-[rgba(43,43,49,0.6)] bg-white/50 px-6 text-base text-[rgba(43,43,49,0.6)] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading"
                  >
                    <option value="" disabled>
                      Select your trade
                    </option>
                    {specialties.map((s) => (
                      <option key={s} value={s.toLowerCase()}>{s}</option>
                    ))}
                  </select>
                  <Image
                    src="/icons/dropdown-arrow.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 dark:invert"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-1.5">
                <label className="text-base font-medium text-[#020204] dark:text-dak-heading">
                  Industry Segment <span className="text-red-500 dark:text-dak-body">*</span>
                </label>
                <div className="relative h-[clamp(44px,7dvh,56px)] w-full">
                  <select
                    name="industry"
                    defaultValue=""
                    className="h-full w-full appearance-none rounded-xl border border-[rgba(43,43,49,0.6)] bg-white/50 px-6 text-base text-[rgba(43,43,49,0.6)] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading"
                  >
                    <option value="" disabled>
                      Select Industry
                    </option>
                    {industrySegments.map((s) => (
                      <option key={s} value={s.toLowerCase()}>{s}</option>
                    ))}
                  </select>
                  <Image
                    src="/icons/dropdown-arrow.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 dark:invert"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-[clamp(0.375rem,0.7dvh,0.625rem)] border-b border-[rgba(148,54,251,0.6)] pb-[clamp(0.375rem,0.7dvh,0.625rem)] dark:border-dak-border">
            <h2 className="text-xl font-bold text-[#020204] dark:text-dak-heading sm:text-2xl">Primary Contact</h2>
            <div className="flex w-full flex-col items-start gap-1.5">
              <label className="text-base font-medium text-[#020204] dark:text-dak-heading">
                Professional Email Address <span className="text-red-500 dark:text-dak-body">*</span>
              </label>
              <div className="h-[clamp(44px,7dvh,56px)] w-full rounded-xl border border-[rgba(43,43,49,0.6)] dark:border-dak-border">
                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  className="h-full w-full bg-transparent px-6 text-base text-[#2b2b31] placeholder:text-[rgba(43,43,49,0.6)] focus:outline-none dark:text-dak-heading dark:placeholder:text-dak-muted"
                />
              </div>
              <p className="text-sm text-[#2b2b31] dark:text-dak-body">
                We recommend using a role-based email (e.g., procurement@company.com) if applicable.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 border-b border-[rgba(148,54,251,0.6)] pb-[clamp(0.375rem,0.7dvh,0.625rem)] dark:border-dak-border">
            <span className="text-lg font-medium tracking-[0.28px] text-[#4f626e] dark:text-dak-heading">
              Portfolio Links
            </span>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#020204] dark:bg-dak-cta">
                <Image src="/icons/link.svg" alt="" width={20} height={10} />
              </div>
              <input
                type="url"
                name="portfolioUrl"
                placeholder="Portfolio URL (e.g., https://johndoe.com)"
                className="h-14 min-w-0 flex-1 rounded-xl border border-[rgba(43,43,49,0.6)] bg-white/50 px-[13px] text-base text-[#2b2b31] placeholder:text-[rgba(43,43,49,0.6)] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <h2 className="text-xl font-bold text-[#020204] dark:text-dak-heading sm:text-2xl">Business Verification</h2>
            <p className="text-base text-[#2b2b31] dark:text-dak-body">
              To maintain network integrity, please provide a valid business license or relevant industry
              certification (ISO, AS9100, etc.).
            </p>
            <button
              type="button"
              className="flex h-[clamp(48px,4.5dvh,64px)] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#c6c6cd] bg-[#f5f5f5] dark:border-dak-border dark:bg-[#2b2b31]"
            >
              <Image src="/icons/upload-cloud.svg" alt="" width={24} height={30} className="invert dark:invert-0" />
              <span className="flex items-center gap-1 text-sm text-[#2b2b31] dark:text-dak-body">
                <span className="rounded-md bg-[#e4e4e7] px-3 py-1 font-bold text-[#020204] dark:bg-[#45464d] dark:text-dak-body">
                  Upload a file
                </span>
                or drag and drop
              </span>
              <span className="text-xs font-semibold text-[#2b2b31] dark:text-dak-body">PDF, PNG, JPG up to 10MB</span>
            </button>
          </div>

          {error && <p className="w-full text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

          <div className="flex w-full items-center justify-between gap-4 border-t border-[rgba(148,54,251,0.6)] pt-[clamp(0.75rem,2dvh,1.5625rem)] dark:border-dak-border">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm font-medium tracking-[0.28px] text-[#020204] dark:text-dak-heading"
            >
              Return to Login
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex h-14 w-[212px] max-w-full items-center justify-center gap-2 rounded-2xl bg-dak-cta text-sm font-medium tracking-[0.28px] text-white shadow-[0px_8px_16px_rgba(148,54,251,0.4)] disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Application"}
              <Image src="/icons/arrow-right-small.svg" alt="" width={16} height={16} />
            </button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}

function CreateProfileForm() {
  const searchParams = useSearchParams();
  const persona = searchParams.get("persona");

  if (persona === "business") {
    return <BusinessRegistrationForm persona={persona} />;
  }

  return <IndividualProfileForm persona={persona} />;
}

export default function CreatePersonalProfilePage() {
  return (
    <Suspense fallback={null}>
      <CreateProfileForm />
    </Suspense>
  );
}
