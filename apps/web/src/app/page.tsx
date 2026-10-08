import Image from "next/image";
import Link from "next/link";
import { RoleCard } from "@/components/auth/RoleCard";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";

export default function WelcomePage() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-app-bg dark:bg-dak-bg lg:flex-row lg:rounded-[50px]">
      <div className="pointer-events-none absolute inset-0">
        <Image src="/illustrations/light-swirl-bg.png" alt="" fill className="block object-cover dark:hidden" />
        <Image src="/illustrations/dark-swirl-bg.svg" alt="" fill className="hidden object-cover dark:block" />
      </div>

      <ThemeToggleButton className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6" />

      <div className="pointer-events-none relative hidden shrink-0 overflow-hidden lg:block lg:w-[50%]">
        <Image src="/illustrations/join-network-dark-hero.png" alt="" fill className="object-cover object-left" />
        <div className="absolute left-10 top-16 z-10 max-w-[600px] pr-10 text-left text-[42px] font-bold leading-normal text-dak-cta dark:text-dak-heading">
          Connect With Instructors And Engineers Through Shared Digital Canvases
        </div>
      </div>

      <p className="relative z-10 w-full px-6 pt-16 text-center text-2xl font-bold leading-normal text-dak-cta dark:text-dak-heading sm:px-10 sm:text-[32px] lg:hidden">
        Connect With Instructors And Engineers Through Shared Digital Canvases
      </p>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-[clamp(0.5rem,2dvh,1.5rem)] px-6 py-[clamp(0.5rem,1.5dvh,2.5rem)] sm:px-10">
        <div className="flex w-full max-w-[570px] flex-col items-center gap-[clamp(0.5rem,1.2dvh,1.5rem)]">
          <div className="flex w-full max-w-[503px] flex-col items-center gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
            <Image
              src="/illustrations/vol-logo.png"
              alt="VÔL"
              width={100}
              height={150}
              className="h-[clamp(48px,7dvh,120px)] w-auto object-cover"
            />
            <div className="flex w-full max-w-[498px] flex-col items-center gap-2">
              <h1 className="text-center text-[clamp(1.25rem,4dvh,2rem)] font-bold text-auth-navy dark:text-dak-heading">
                Join the VÔL Network
              </h1>
              <p className="w-full text-center text-base font-medium leading-[23px] text-auth-slate dark:text-dak-body">
                Select your account type to begin constructing your professional
                profile within our precision engineering ecosystem.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
            <RoleCard
              iconSrc="/icons/individual-dark.png"
              title="Individual User"
              description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              buttonLabel="Continue as Individual"
              href="/login?persona=individual"
              accent="cta"
            />
            <RoleCard
              iconSrc="/icons/business-dark.png"
              iconClassName="object-cover"
              title="Business Profile"
              description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              buttonLabel="Continue as Business"
              href="/login?persona=business"
              accent="muted"
            />
          </div>

          <Link
            href="/login"
            className="block w-full text-center text-base font-medium text-auth-slate dark:text-dak-heading"
          >
            Already have an account? <span className="font-bold text-dak-cta">Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
