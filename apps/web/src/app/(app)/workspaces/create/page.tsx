"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CreateWorkspacePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex w-full max-w-[800px] flex-col gap-6">
      <div>
        <Link href="/workspaces" className="flex items-center gap-1.5 text-base font-medium text-auth-navy dark:text-dak-heading">
          <Image
            src="/icons/arrow-narrow-right.svg"
            alt=""
            width={20}
            height={20}
            className="-scale-y-100 rotate-180 dark:invert"
          />
          Back
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold tracking-[-0.32px] text-auth-navy dark:text-dak-heading">
          Create Workspace
        </h1>
        <p className="text-base text-auth-slate dark:text-dak-body">
          Configure a new environment for your team&rsquo;s projects, resources,
          and collaboration.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative flex h-[149px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed bg-[#fefefe] transition-colors dark:bg-dak-surface ${
          isDragging ? "border-dak-cta bg-[#f3e8ff] dark:bg-dak-surface" : "border-[#2b2b31] dark:border-dak-border"
        }`}
      >
        {photoPreview ? (
          <>
            <Image src={photoPreview} alt="" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40">
              <span className="rounded-lg border border-white bg-black/40 px-[17px] py-[9px] text-[10px] font-medium text-white">
                Change photo
              </span>
            </div>
            <span
              role="button"
              tabIndex={0}
              onClick={handleRemovePhoto}
              onKeyDown={(e) => e.key === "Enter" && handleRemovePhoto(e as unknown as React.MouseEvent)}
              className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-black/60 text-sm text-white hover:bg-black/80"
              aria-label="Remove photo"
            >
              ✕
            </span>
          </>
        ) : (
          <>
            <Image src="/icons/camera.svg" alt="" width={27} height={25} className="invert dark:invert-0" />
            <span className="rounded-lg border border-[#2b2b31] px-[17px] py-[9px] text-[10px] font-medium text-[#2b2b31] dark:border-dak-border dark:text-dak-heading">
              Drag /Upload photo
            </span>
          </>
        )}
      </button>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-auth-navy dark:text-dak-heading">Workspace Details</h2>
        <p className="text-base text-auth-slate dark:text-dak-body">
          Define the foundational details of your new workspace.
        </p>
      </div>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Workspace Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Structural Engineering Dept"
            className="h-14 rounded-lg border border-[#2b2b31] bg-[#f8f9ff] px-4 text-base text-auth-navy placeholder:text-[rgba(43,43,49,0.6)] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Description (Optional)</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Briefly describe the purpose of this workspace..."
            className="h-[100px] resize-none rounded-lg border border-[#2b2b31] bg-[#f8f9ff] px-4 py-3 text-base text-auth-navy placeholder:text-[rgba(43,43,49,0.6)] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-heading dark:placeholder:text-dak-muted"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-auth-navy dark:text-dak-heading">Industry / Trade Focus</label>
          <div className="relative">
            <select
              name="industry"
              defaultValue=""
              className="h-14 w-full appearance-none rounded-lg border border-[#2b2b31] bg-[#f8f9ff] px-4 text-base text-[rgba(43,43,49,0.6)] focus:outline-none dark:border-dak-border dark:bg-transparent dark:text-dak-muted"
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
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 dark:invert"
            />
          </div>
        </div>

        <Button type="submit" variant="dark" className="rounded-2xl shadow-[0px_8px_6px_rgba(148,54,251,0.4)]">
          Continue
        </Button>
      </form>
    </div>
  );
}
