import Image from "next/image";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

export default function NetworkVisibilityPage() {
  return (
    <AuthShell contentWidth={652}>
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex w-[396px] flex-col items-center gap-6">
          <div className="flex size-[120px] items-center justify-center rounded-full bg-auth-slate">
            <span className="text-[32px] text-white">Logo</span>
          </div>
          <div className="flex w-[380px] flex-col items-start gap-4">
            <h1 className="w-full whitespace-nowrap text-center text-[32px] font-medium tracking-[-0.32px] text-auth-navy">
              Profile Setup Complete
            </h1>
            <p className="w-full whitespace-nowrap text-center text-base text-[#45464d]">
              Configure your network presence and launch your workspace.
            </p>
          </div>
        </div>

        <form className="flex w-full flex-col gap-4 rounded-lg border border-light-border bg-white px-[41px] py-[49px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <h2 className="w-full border-b border-light-border pb-[17px] text-2xl font-semibold text-auth-navy">
            Network Visibility
          </h2>

          <div className="flex w-full flex-col gap-6 pt-2">
            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-light-border bg-[#f9f9f9] p-[17px]">
              <input
                type="radio"
                name="visibility"
                defaultChecked
                className="size-5 shrink-0 accent-auth-navy"
              />
              <div className="flex flex-1 flex-col items-start gap-4">
                <div className="flex w-full items-center gap-2">
                  <Image src="/icons/globe.svg" alt="" width={17} height={17} />
                  <span className="text-lg font-medium tracking-[0.28px] text-auth-navy">
                    Public Portfolio
                  </span>
                  <span className="ml-auto rounded-xl bg-[rgba(79,98,110,0.1)] px-2 py-0.5 font-heading text-[10px] uppercase tracking-[0.5px] text-[#45464d]">
                    Recommended
                  </span>
                </div>
                <p className="text-base text-[#45464d]">
                  Your profile, projects, and credentials will be visible to
                  all platform users and indexed in the global directory.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-light-border bg-[#f9f9f9] p-[17px]">
              <input
                type="radio"
                name="visibility"
                className="size-5 shrink-0 accent-auth-navy"
              />
              <div className="flex flex-1 flex-col items-start gap-4">
                <div className="flex w-full items-center gap-2">
                  <Image src="/icons/lock-small.svg" alt="" width={14} height={18} />
                  <span className="text-lg font-medium tracking-[0.28px] text-auth-navy">
                    Private Network
                  </span>
                </div>
                <p className="text-base text-[#45464d]">
                  Your profile remains hidden. You can only collaborate via
                  direct invites from existing workspaces or verified
                  connections.
                </p>
              </div>
            </label>

            <div className="flex w-full flex-col items-start">
              <h3 className="w-full pb-4 pt-6 font-heading text-lg font-medium uppercase tracking-[0.7px] text-auth-navy">
                Data Preferences
              </h3>
              <div className="flex w-full items-center justify-between border-b border-[rgba(198,198,205,0.5)] pb-[13px] pt-3">
                <div className="flex flex-col items-start gap-3">
                  <span className="text-lg font-medium tracking-[0.28px] text-auth-navy">
                    Allow Search Indexing
                  </span>
                  <span className="text-base text-auth-navy">
                    Include profile in internal talent searches.
                  </span>
                </div>
                <Toggle name="searchIndexing" defaultChecked />
              </div>
            </div>
          </div>

          <div className="w-full pt-4">
            <Button type="submit">Complete Setup</Button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
