import Image from "next/image";
import Link from "next/link";

export default function JoinNetworkDarkPage() {
  return (
    <div className="relative h-[1080px] w-[1920px] shrink-0 overflow-hidden rounded-[50px] bg-dak-bg">
      <div className="pointer-events-none absolute -left-[522px] -top-[595px] h-[2538px] w-[3132px]">
        <Image
          src="/illustrations/dark-swirl-bg.svg"
          alt=""
          width={3132}
          height={2538}
        />
      </div>

      <div className="pointer-events-none absolute left-0 top-1/2 h-[1082px] w-[967px] -translate-y-1/2 overflow-hidden">
        <Image
          src="/illustrations/join-network-dark-hero.png"
          alt=""
          width={1028}
          height={1082}
          className="absolute left-0 top-[13px] max-w-none"
        />
      </div>

      <p className="absolute left-[484px] top-[194px] w-[848px] -translate-x-1/2 text-center text-[42px] font-bold leading-normal text-dak-heading">
        Connect With Instructors And Engineers Through Shared Digital Canvases
      </p>

      <div className="absolute left-[1122px] top-1/2 flex w-[570px] -translate-y-1/2 flex-col items-center gap-6">
        <div className="flex w-[503px] flex-col items-center gap-6">
          <Image
            src="/illustrations/vol-logo.png"
            alt="VÔL"
            width={100}
            height={150}
            className="h-[150px] w-[100px] object-cover"
          />
          <div className="flex w-[498px] flex-col items-center gap-4">
            <h1 className="whitespace-nowrap text-center text-[32px] font-bold text-dak-heading">
              Join the VÔL Network
            </h1>
            <p className="w-full text-center text-base font-medium leading-[23px] text-dak-body">
              Select your account type to begin constructing your professional
              profile within our precision engineering ecosystem.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-6">
          <div className="relative flex h-[295px] w-full flex-col gap-4 overflow-hidden rounded-2xl border border-dak-cta bg-[#1e1e22] px-[41px] py-[25px]">
            <div className="absolute left-0 right-0 top-0 h-1 bg-dak-cta" />
            <Image
              src="/icons/individual-dark.png"
              alt=""
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
            <h3 className="text-2xl font-semibold text-dak-heading">
              Individual User
            </h3>
            <p className="text-base leading-[23px] text-dak-body">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <Link
              href="/create-profile"
              className="mt-auto flex h-14 w-full items-center justify-center rounded-2xl bg-dak-cta text-base font-medium text-white shadow-[0px_8px_6px_rgba(148,54,251,0.4)]"
            >
              Login in as Individual profile
            </Link>
          </div>

          <div className="relative flex h-[295px] w-full flex-col gap-4 overflow-hidden rounded-2xl border border-[#2b2b31] bg-[#121212] px-[41px] py-[25px]">
            <div className="absolute left-0 right-0 top-0 h-1 bg-dak-body" />
            <Image
              src="/icons/business-dark.png"
              alt=""
              width={60}
              height={60}
              className="object-cover"
            />
            <h3 className="text-2xl font-semibold text-dak-heading">
              Business Profile
            </h3>
            <p className="text-base leading-[23px] text-dak-body">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <Link
              href="/business/profile"
              className="mt-auto flex h-14 w-full items-center justify-center rounded-2xl bg-[#020202] text-base font-medium text-white shadow-[0px_8px_16px_rgba(2,2,2,0.4)]"
            >
              Login in as Business profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
