import Image from "next/image";
import Link from "next/link";

type ClassCardProps = {
  href: string;
  title: string;
  subtitle: string;
  modules: string;
  tag?: string;
  /** Dark "3/5 modules"-style label in the image's top-right corner (Active Classroom cards). */
  badge?: string;
  progress?: number;
  imageSrc?: string;
};

export function ClassCard({ href, title, subtitle, modules, tag, badge, progress, imageSrc }: ClassCardProps) {
  const inProgress = progress !== undefined;

  return (
    <Link
      href={href}
      className={`flex w-full flex-col overflow-hidden rounded-lg ${
        inProgress
          ? "border border-light-border bg-[#f8f9ff] dark:border-dak-border dark:bg-dak-surface"
          : "bg-white shadow-[0px_4px_8px_0px_rgba(43,43,49,0.2)] dark:bg-dak-surface"
      }`}
    >
      <div className="relative flex h-[130px] shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-auth-navy dark:bg-dak-surface">
        {imageSrc ? (
          <Image src={imageSrc} alt="" fill className="object-cover" />
        ) : (
          <Image src="/illustrations/auth-placeholder.svg" alt="" width={36} height={36} />
        )}
        {tag && (
          <span className="absolute right-4 top-4 rounded-xl bg-white px-3 py-1 text-xs font-medium text-auth-navy dark:bg-dak-bg dark:text-dak-heading">
            {tag}
          </span>
        )}
        {badge && (
          <span className="absolute right-4 top-4 flex h-6 items-center rounded-lg bg-[#45464d] px-2 text-[10px] font-medium leading-[15px] text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h4 className="text-base font-medium leading-4 tracking-[0.28px] text-[#020204] dark:text-dak-heading">{title}</h4>
        <p className="text-sm leading-4 tracking-[0.28px] text-[#2b2b31] dark:text-dak-muted">{subtitle}</p>
        {inProgress ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs leading-3">
              <span className="text-[#2b2b31] dark:text-dak-body">Progress</span>
              <span className="font-semibold text-[#020204] dark:text-dak-heading">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-xl bg-[#ccced2] dark:bg-dak-border">
              <div className="h-full rounded-xl bg-[#020204] dark:bg-dak-cta" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <p className="text-sm leading-5 text-[#45464d] dark:text-dak-muted">{modules}</p>
        )}
      </div>
    </Link>
  );
}
