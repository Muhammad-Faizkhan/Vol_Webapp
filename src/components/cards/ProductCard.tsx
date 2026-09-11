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
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-light-border bg-white dark:border-dak-border dark:bg-dak-surface">
      <div className="relative flex h-[130px] items-center justify-center overflow-hidden bg-auth-navy dark:bg-dak-surface">
        {imageSrc ? (
          <Image src={imageSrc} alt="" fill className="object-cover" />
        ) : (
          <Image src="/illustrations/auth-placeholder.svg" alt="" width={36} height={36} />
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-[#929292] dark:text-dak-muted">
          {brand}
        </span>
        <h4 className="mb-1 text-lg font-semibold text-auth-navy dark:text-dak-heading">{name}</h4>
        <div className="flex flex-col">
          {specs.map(([label, value], i) => (
            <div
              key={label}
              className={`flex justify-between py-1.5 text-sm text-auth-navy dark:text-dak-body ${i !== 0 ? "border-t border-light-border dark:border-dak-border" : ""}`}
            >
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
        <Link
          href={href}
          className="mt-3 rounded-lg bg-auth-navy py-2.5 text-center text-sm font-medium text-white dark:bg-dak-cta"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
