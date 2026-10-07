import { AuthHeading, AuthShell } from "@/components/auth/AuthShell";
import { VerifyForm } from "./VerifyForm";

export default async function VerifyPage({ searchParams }: PageProps<"/verify">) {
  const { email } = await searchParams;
  const address = (Array.isArray(email) ? email[0] : email) || "user@example.com";

  return (
    <AuthShell>
      {/* Copy kept verbatim from Figma 705:4534, including the authenticator-app wording. */}
      <AuthHeading title="Verify your identity">
        Enter the 6-digit code from your authenticator app for{" "}
        <span className="text-lg font-semibold text-dak-heading">{address}</span>
      </AuthHeading>
      <VerifyForm email={address} />
    </AuthShell>
  );
}
