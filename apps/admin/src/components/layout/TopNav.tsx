"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-20 items-center justify-between gap-3 bg-dak-bg px-4 sm:px-6 lg:left-[var(--adm-sidebar-w)] lg:h-[100px] lg:px-10">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl lg:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-dak-heading" />
            <span className="block h-0.5 w-5 bg-dak-heading" />
            <span className="block h-0.5 w-5 bg-dak-heading" />
          </span>
        </button>

        <form
          role="search"
          className="relative w-full min-w-0 max-w-[448px]"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q")?.toString().trim();
            router.push(q ? `/users?q=${encodeURIComponent(q)}` : "/users");
          }}
        >
          <Image src="/icons/search.svg" alt="" width={18} height={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            name="q"
            placeholder="Search users, businesses.."
            className="h-[41px] w-full rounded-xl border-[0.5px] border-adm-input-border bg-transparent pl-[40.5px] pr-4 text-base text-dak-heading placeholder:text-adm-placeholder focus:border-dak-cta focus:outline-none"
          />
        </form>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button type="button" aria-label="Notifications" className="flex h-6 items-center justify-center rounded-xl p-1">
          <Image src="/icons/bell.svg" alt="" width={16} height={20} />
        </button>
        <div className="relative size-[42px] overflow-hidden rounded-full">
          <Image src="/avatars/admin.png" alt="Admin account" fill sizes="42px" className="object-cover" />
        </div>
      </div>
    </header>
  );
}
