import Image from "next/image";
import Link from "next/link";

export default function JoinNetworkDarkPage() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-dak-bg lg:flex-row lg:rounded-[50px]">
      <div className="pointer-events-none absolute -left-[27%] -top-[55%] aspect-square w-[163%] lg:-left-[17%] lg:-top-[55%] lg:w-[163%]">
        <Image
          src="/illustrations/dark-swirl-bg.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="pointer-events-none relative hidden shrink-0 overflow-hidden lg:block lg:w-[50%]">
        <Image
          src="/illustrations/join-network-dark-hero.png"
          alt=""
          fill
          className="object-cover object-left"
        />
        <div className="absolute left-10 top-16 z-10 max-w-[600px] pr-10 text-left text-[42px] font-bold leading-normal text-dak-heading">
          Connect With Instructors And Engineers Through Shared Digital Canvases
        </div>
      </div>

      <p className="relative z-10 w-full px-6 pt-16 text-center text-2xl font-bold leading-normal text-dak-heading sm:px-10 sm:text-[32px] lg:hidden">
        Connect With Instructors And Engineers Through Shared Digital Canvases
      </p>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-[clamp(0.5rem,2dvh,1.5rem)] px-6 py-[clamp(0.5rem,3dvh,4rem)] sm:px-10">
        <div className="flex w-full max-w-[570px] flex-col items-center gap-[clamp(0.75rem,2dvh,1.5rem)]">
          <div className="flex w-full max-w-[503px] flex-col items-center gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
            <Image
              src="/illustrations/vol-logo.png"
              alt="VÔL"
              width={100}
              height={150}
              className="h-[clamp(60px,10dvh,150px)] w-auto object-cover"
            />
            <div className="flex w-full max-w-[498px] flex-col items-center gap-2">
              <h1 className="text-center text-[clamp(1.25rem,4dvh,2rem)] font-bold text-dak-heading">
                Join the VÔL Network
              </h1>
              <p className="w-full text-center text-base font-medium leading-[23px] text-dak-body">
                Select your account type to begin constructing your professional
                profile within our precision engineering ecosystem.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-[clamp(0.5rem,1.5dvh,1.5rem)]">
            <div className="relative flex min-h-[clamp(150px,24dvh,280px)] w-full flex-col gap-1.5 overflow-hidden rounded-2xl border border-dak-cta bg-[#1e1e22] px-6 py-[clamp(0.875rem,2.5dvh,1.5625rem)] sm:px-[41px]">
              <div className="absolute left-0 right-0 top-0 h-1 bg-dak-cta" />
              <Image
                src="/icons/individual-dark.png"
                alt=""
                width={60}
                height={60}
                className="size-[clamp(36px,5dvh,60px)] rounded-full object-cover"
              />
              <h3 className="text-2xl font-semibold text-dak-heading">
                Individual User
              </h3>
              <p className="text-base leading-[23px] text-dak-body">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <Link
                href="/login?persona=individual"
                className="mt-auto flex h-14 w-full items-center justify-center rounded-2xl bg-dak-cta text-base font-medium text-white shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
              >
                Login in as Individual profile
              </Link>
            </div>

            <div className="relative flex min-h-[clamp(150px,24dvh,280px)] w-full flex-col gap-1.5 overflow-hidden rounded-2xl border border-[#2b2b31] bg-[#121212] px-6 py-[clamp(0.875rem,2.5dvh,1.5625rem)] sm:px-[41px]">
              <div className="absolute left-0 right-0 top-0 h-1 bg-dak-body" />
              <Image
                src="/icons/business-dark.png"
                alt=""
                width={60}
                height={60}
                className="size-[clamp(36px,5dvh,60px)] object-cover"
              />
              <h3 className="text-2xl font-semibold text-dak-heading">
                Business Profile
              </h3>
              <p className="text-base leading-[23px] text-dak-body">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <Link
                href="/login?persona=business"
                className="mt-auto flex h-14 w-full items-center justify-center rounded-2xl bg-[#020202] text-base font-medium text-white shadow-[0px_8px_16px_rgba(2,2,2,0.4)]"
              >
                Login in as Business profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
