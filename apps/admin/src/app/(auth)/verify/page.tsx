import { AuthHeading, AuthShell } from "@/components/auth/AuthShell";
import { VerifyForm } from "./VerifyForm";

export default async function VerifyPage({ searchParams }: PageProps<"/verify">) {
  const { email, next } = await searchParams;
  const address = (Array.isArray(email) ? email[0] : email) ?? "";
  const nextPath = Array.isArray(next) ? next[0] : next;

  return (
    <AuthShell>
      <AuthHeading title="Verify your identity">
        Enter the 6-digit code we emailed to <span className="text-lg font-semibold text-dak-heading">{address}</span>
      </AuthHeading>
      <VerifyForm email={address} next={nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard"} />
    </AuthShell>
  );
}
