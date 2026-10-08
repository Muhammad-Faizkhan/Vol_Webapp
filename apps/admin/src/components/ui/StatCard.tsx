import Image from "next/image";
import type { Stat } from "@/lib/mock-data";

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="flex h-[120px] min-w-0 flex-col justify-center gap-3 rounded-lg border border-dak-cta bg-dak-surface px-[clamp(16px,calc(3.61*var(--vw)-29.3px),40px)] drop-shadow-[0px_4px_4px_rgba(148,54,251,0.25)]">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[clamp(13px,calc(0.73*var(--vw)),14px)] font-medium leading-4 tracking-[0.28px] text-dak-body">{stat.label}</p>
        <Image src={stat.icon} alt="" width={24} height={24} className="shrink-0" />
      </div>
      <p className="text-[28px] font-medium leading-6 tracking-[0.28px] text-dak-heading">{stat.value}</p>
      <p
        className={`text-sm font-medium leading-4 tracking-[0.28px] ${
          stat.tone === "up" ? "text-adm-success" : "text-adm-danger-text"
        }`}
      >
        {stat.delta}
      </p>
    </div>
  );
}
