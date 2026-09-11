import Image from "next/image";
import Link from "next/link";

type ClassCardProps = {
  href: string;
  title: string;
  subtitle: string;
  modules: string;
  tag?: string;
  progress?: number;
  imageSrc?: string;
};

export function ClassCard({ href, title, subtitle, modules, tag, progress, imageSrc }: ClassCardProps) {
  return (
    <Link
      href={href}
      className="flex w-full flex-col overflow-hidden rounded-lg border border-light-border bg-white dark:border-dak-border dark:bg-dak-surface"
    >
      <div className="relative flex h-[130px] items-center justify-center overflow-hidden bg-auth-navy dark:bg-dak-surface">
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
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h4 className="text-base font-medium text-auth-navy dark:text-dak-heading">{title}</h4>
        <p className="text-sm text-[#929292] dark:text-dak-muted">{subtitle}</p>
        {progress !== undefined ? (
          <div className="flex flex-col gap-1.5 pt-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-auth-navy dark:text-dak-heading">Progress</span>
              <span className="font-medium text-auth-navy dark:text-dak-heading">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#e0e0e0] dark:bg-dak-border">
              <div
                className="h-full rounded-full bg-auth-navy dark:bg-dak-cta"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#929292] dark:text-dak-muted">{modules}</p>
        )}
      </div>
    </Link>
  );
}
