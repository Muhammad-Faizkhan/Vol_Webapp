import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CreateWorkspacePage() {
  return (
    <div className="flex w-full max-w-[800px] flex-col gap-6">
      <div>
        <Link href="/workspaces" className="flex items-center gap-1.5 text-base font-medium text-auth-navy">
          <Image
            src="/icons/arrow-narrow-right.svg"
            alt=""
            width={20}
            height={20}
            className="-scale-y-100 rotate-180"
          />
          Back
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy">
          Create Workspace
        </h1>
        <p className="text-base text-auth-slate">
          Configure a new environment for your team&rsquo;s projects, resources,
          and collaboration.
        </p>
      </div>

      <div className="flex h-[130px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-light-border bg-[#dcdcdc]">
        <Image src="/icons/camera.svg" alt="" width={24} height={24} />
        <span className="rounded-lg border border-light-border bg-white px-3 py-1 text-sm text-auth-navy">
          Drag /Upload photo
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-auth-navy">Workspace Details</h2>
        <p className="text-base text-auth-slate">
          Define the foundational details of your new workspace.
        </p>
      </div>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy">Workspace Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Structural Engineering Dept"
            className="h-14 rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy">Description (Optional)</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Briefly describe the purpose of this workspace..."
            className="h-[100px] resize-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 py-3 text-base text-auth-navy placeholder:text-[#929292] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy">Industry / Trade Focus</label>
          <div className="relative">
            <select
              name="industry"
              defaultValue=""
              className="h-14 w-full appearance-none rounded-lg border border-light-border bg-[#f8f9ff] px-4 text-base text-[#929292] focus:outline-none"
            >
              <option value="" disabled>
                Select an industry focus...
              </option>
              <option value="architecture">Architecture</option>
              <option value="engineering">Engineering</option>
              <option value="construction">Construction</option>
            </select>
            <Image
              src="/icons/dropdown-arrow.svg"
              alt=""
              width={20}
              height={20}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <Button type="submit">Continue</Button>
      </form>
    </div>
  );
}
