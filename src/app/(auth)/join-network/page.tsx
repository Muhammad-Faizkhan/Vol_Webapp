import { AuthShell } from "@/components/auth/AuthShell";
import { RoleCard } from "@/components/auth/RoleCard";

export default function JoinNetworkPage() {
  return (
    <AuthShell showBack={false}>
      <div className="flex w-[570px] flex-col items-center gap-6">
        <div className="flex w-[503px] flex-col items-center gap-6">
          <div className="flex size-[120px] items-center justify-center rounded-full bg-auth-slate">
            <span className="text-[32px] text-white">Logo</span>
          </div>
          <div className="flex w-[380px] flex-col items-start gap-4">
            <h1 className="w-full whitespace-nowrap text-center text-[32px] font-bold text-auth-slate">
              Join the VÔL Network
            </h1>
            <p className="w-full text-center text-base font-medium leading-[23px] text-auth-slate">
              Select your account type to begin constructing your professional
              profile within our precision engineering ecosystem.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-6">
          <RoleCard
            iconSrc="/icons/user-individual.svg"
            iconWidth={19}
            iconHeight={19}
            title="Individual User"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            buttonLabel="Login in as Individual profile"
            href="/create-profile"
          />
          <RoleCard
            iconSrc="/icons/business-profile.svg"
            iconWidth={23}
            iconHeight={21}
            title="Business Profile"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            buttonLabel="Login in as Business profile"
            href="/business/profile"
          />
        </div>
      </div>
    </AuthShell>
  );
}
