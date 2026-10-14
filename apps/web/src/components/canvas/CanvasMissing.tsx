import Link from "next/link";

export function CanvasMissing({ message }: { message: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-app-bg p-6 text-center dark:bg-dak-bg">
      <p className="text-xl font-semibold text-auth-navy dark:text-dak-heading">{message}</p>
      <Link href="/workspaces" className="rounded-xl bg-dak-cta px-5 py-3 text-white">
        Back to workspaces
      </Link>
    </div>
  );
}
