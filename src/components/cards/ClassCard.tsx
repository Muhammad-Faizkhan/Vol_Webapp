import Image from "next/image";
import Link from "next/link";

type ClassCardProps = {
  href: string;
  title: string;
  subtitle: string;
  modules: string;
  tag?: string;
  progress?: number;
};

export function ClassCard({ href, title, subtitle, modules, tag, progress }: ClassCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-1 flex-col overflow-hidden rounded-lg border border-light-border bg-white"
    >
      <div className="relative flex h-[130px] items-center justify-center bg-auth-navy">
        <Image src="/illustrations/auth-placeholder.svg" alt="" width={36} height={36} />
        {tag && (
          <span className="absolute right-4 top-4 rounded-xl bg-white px-3 py-1 text-xs font-medium text-auth-navy">
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h4 className="text-base font-medium text-auth-navy">{title}</h4>
        <p className="text-sm text-[#929292]">{subtitle}</p>
        {progress !== undefined ? (
          <div className="flex flex-col gap-1.5 pt-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-auth-navy">Progress</span>
              <span className="font-medium text-auth-navy">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#e0e0e0]">
              <div
                className="h-full rounded-full bg-auth-navy"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#929292]">{modules}</p>
        )}
      </div>
    </Link>
  );
}
