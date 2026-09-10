import Image from "next/image";

export function AppHeader() {
  return (
    <header className="fixed left-[400px] right-0 top-0 z-10 flex h-[100px] items-center justify-between border-b border-light-border bg-[#f3f3f3] px-10">
      <div className="relative h-12 w-[448px]">
        <Image
          src="/icons/search.svg"
          alt=""
          width={15}
          height={15}
          className="absolute left-[17px] top-1/2 -translate-y-1/2"
        />
        <input
          type="search"
          placeholder="Search workspaces, classrooms, peers..."
          className="h-12 w-full rounded-xl border border-light-border bg-[#fdfdfd] pl-[41px] pr-[17px] text-base text-auth-navy placeholder:text-[#6b7280] focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex items-center justify-center rounded-xl px-2 pb-3.5 pt-2"
        >
          <Image src="/icons/bell.svg" alt="" width={16} height={20} />
        </button>
        <div className="flex size-10 items-center justify-center rounded-full bg-auth-navy">
          <Image src="/icons/user-rounded-small.svg" alt="" width={24} height={24} />
        </div>
      </div>
    </header>
  );
}
