import Image from "next/image";
import { initials } from "@vol/api-client";

/**
 * User-uploaded images come from the API's /uploads, a different origin per environment, so they
 * render as a plain <img> rather than through next/image (which would need every API host allow-listed).
 * Falls back to `fallback` (a static asset) when there's no upload.
 */
export function UserImage({
  src,
  fallback,
  alt = "",
  className = "",
}: {
  src: string | null | undefined;
  fallback?: string;
  alt?: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${className}`} />;
  }
  if (fallback) return <Image src={fallback} alt={alt} fill className={`object-cover ${className}`} />;
  return null;
}

/** Round avatar: the user's photo, or their initials on a purple disc. */
export function Avatar({
  src,
  name,
  size = 40,
  className = "",
}: {
  src: string | null | undefined;
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-dak-cta font-semibold text-white ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.38) }}
      title={name}
    >
      {src ? <UserImage src={src} alt={name} /> : initials(name) || "?"}
    </span>
  );
}
