import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  href: string;
  brand: string;
  name: string;
  specs: [string, string][];
  imageSrc?: string;
};

export function ProductCard({ href, brand, name, specs, imageSrc }: ProductCardProps) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-[rgba(198,198,205,0.6)] bg-white dark:border-dak-border dark:bg-dak-surface">
      <div className="relative flex h-[130px] items-center justify-center overflow-hidden rounded-t-lg bg-auth-navy dark:bg-dak-surface">
        {imageSrc ? (
          <Image src={imageSrc} alt="" fill className="object-cover" />
        ) : (
          <Image src="/illustrations/auth-placeholder.svg" alt="" width={36} height={36} />
        )}
      </div>
      <div className="flex flex-col px-5 pb-5 pt-4">
        <span className="pb-1 text-xs uppercase leading-3 tracking-[0.6px] text-[#2b2b31] dark:text-dak-muted">{brand}</span>
        <h4 className="truncate pb-3 text-base font-semibold leading-6 text-[#020204] dark:text-dak-heading">{name}</h4>
        <div className="flex flex-col gap-4 pb-1">
          {specs.map(([label, value], i) => (
            <div
              key={label}
              className={`flex justify-between gap-3 text-sm leading-5 ${
                i !== specs.length - 1 ? "border-b-[0.5px] border-[#c793ff] pb-[4.5px] dark:border-dak-border" : ""
              }`}
            >
              <span className="text-[#2b2b31] dark:text-dak-body">{label}</span>
              <span className="text-right font-semibold text-[#020204] dark:text-dak-heading">{value}</span>
            </div>
          ))}
        </div>
        <div className="border-t-[0.5px] border-[#c793ff] pt-[24.5px] dark:border-dak-border">
          <Link
            href={href}
            className="flex h-[33px] w-full items-center justify-center rounded-2xl bg-dak-cta text-sm font-medium leading-4 tracking-[0.28px] text-white drop-shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
