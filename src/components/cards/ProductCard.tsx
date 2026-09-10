import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  href: string;
  brand: string;
  name: string;
  specs: [string, string][];
};

export function ProductCard({ href, brand, name, specs }: ProductCardProps) {
  return (
    <div className="flex w-[300px] flex-col overflow-hidden rounded-lg border border-light-border bg-white">
      <div className="flex h-[130px] items-center justify-center bg-auth-navy">
        <Image src="/illustrations/auth-placeholder.svg" alt="" width={36} height={36} />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-[#929292]">
          {brand}
        </span>
        <h4 className="mb-1 text-lg font-semibold text-auth-navy">{name}</h4>
        <div className="flex flex-col">
          {specs.map(([label, value], i) => (
            <div
              key={label}
              className={`flex justify-between py-1.5 text-sm text-auth-navy ${i !== 0 ? "border-t border-light-border" : ""}`}
            >
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
        <Link
          href={href}
          className="mt-3 rounded-lg bg-auth-navy py-2.5 text-center text-sm font-medium text-white"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
