import Image from "next/image";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

const tags = ["Sustainability", "BIM"];

export default function CreatePersonalProfilePage() {
  return (
    <AuthShell contentWidth={652}>
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex w-[396px] flex-col items-center gap-6">
          <div className="flex size-[120px] items-center justify-center rounded-full bg-auth-slate">
            <span className="text-[32px] text-white">Logo</span>
          </div>
          <div className="flex w-[380px] flex-col items-start gap-4">
            <h1 className="w-full whitespace-nowrap text-center text-[32px] font-medium tracking-[-0.32px] text-auth-navy">
              Create Personal Profile
            </h1>
            <p className="w-full whitespace-nowrap text-center text-base font-medium text-[#45464d]">
              Tell us a bit about yourself to tailor your experience.
            </p>
          </div>
        </div>

        <form className="flex w-full flex-col gap-4 rounded-lg border border-light-border bg-white px-[41px] py-[49px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex w-full items-center gap-6 border-b border-light-border pb-[25px]">
            <div className="flex size-24 items-center justify-center rounded-xl border border-dashed border-light-border bg-auth-navy">
              <Image src="/icons/camera.svg" alt="" width={28} height={25} />
            </div>
            <div className="flex flex-col items-start gap-4">
              <span className="text-base font-medium tracking-[0.28px] text-auth-navy">
                Profile Photo
              </span>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-lg border border-light-border px-[17px] text-base font-medium tracking-[0.28px] text-auth-navy"
              >
                Upload Image
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-4">
            <label className="text-lg font-medium text-auth-slate">Full Name</label>
            <TextField name="fullName" placeholder="Enter your name" icon={null} />
          </div>

          <div className="flex w-full flex-col items-start gap-4">
            <label className="text-lg font-medium text-auth-slate">Bio</label>
            <textarea
              name="bio"
              rows={3}
              placeholder="Briefly describe your expertise and goals..."
              className="h-[107px] w-full resize-none rounded-xl border border-auth-navy/50 bg-white px-6 py-3 text-base text-auth-navy placeholder:text-[#6b7280] focus:outline-none"
            />
          </div>

          <div className="flex w-full flex-col items-start gap-4">
            <label className="text-lg font-medium text-auth-slate">Interest</label>
            <div className="relative h-14 w-full">
              <select
                name="interest"
                defaultValue=""
                className="h-14 w-full appearance-none rounded-xl border border-auth-navy/50 bg-white px-6 text-base text-auth-slate/60 focus:outline-none"
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
                className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-4">
            <span className="text-base text-auth-navy">Category Tags</span>
            <div className="flex items-start gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex h-8 items-center gap-1 rounded-xl border border-auth-navy bg-[#f5f5f5] px-[13px] text-xs font-semibold text-auth-navy"
                >
                  {tag}
                  <Image src="/icons/tag-close.svg" alt="" width={8} height={8} />
                </span>
              ))}
              <button
                type="button"
                className="flex h-8 items-center rounded-xl border border-light-border bg-[#f2f2f3] px-[13px] text-xs font-semibold text-auth-navy"
              >
                + Add Tag
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 border-t border-light-border pt-[25px]">
            <span className="text-lg font-medium tracking-[0.28px] text-auth-navy">
              Portfolio Links
            </span>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-auth-navy">
                <Image src="/icons/link.svg" alt="" width={20} height={10} />
              </div>
              <input
                type="url"
                name="portfolioUrl"
                placeholder="Portfolio URL (e.g., https://johndoe.com)"
                className="h-14 flex-1 rounded-xl border border-auth-navy bg-white px-[13px] text-base text-[#6b7280] focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full pt-4">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
