import Image from "next/image";
import Link from "next/link";

export function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="flex w-fit items-center text-base font-medium leading-6 text-dak-heading">
      <Image src="/icons/arrow-right.svg" alt="" width={24} height={24} className="rotate-180" />
      <span className="px-2.5">Back</span>
    </Link>
  );
}
