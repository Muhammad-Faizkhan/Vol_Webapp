import Image from "next/image";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/OtpInput";

export default function OtpVerificationPage() {
  return (
    <AuthShell>
      <div className="flex w-full flex-col items-center">
        <div className="flex w-[380px] flex-col items-center gap-6">
          <div className="flex size-[120px] items-center justify-center rounded-full bg-auth-slate">
            <span className="text-[32px] text-white">Logo</span>
          </div>
          <div className="flex w-[380px] flex-col items-start gap-4">
            <h1 className="w-full whitespace-nowrap text-center text-[32px] font-medium text-auth-slate">
              OTP Verification
            </h1>
            <p className="w-full whitespace-nowrap text-center text-base font-medium leading-[23px] text-auth-slate">
              Lorem Ipsum is simply dummy text
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-10 w-[570px] overflow-hidden rounded-lg border border-[rgba(198,198,205,0.3)] bg-[rgba(242,242,242,0.95)] px-[41px] pb-[41px] pt-[49px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[5px]">
        <div className="absolute left-0 right-0 top-0 h-1 bg-[#f6f6f6]">
          <div className="h-full w-1/2 bg-auth-navy" />
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-xl border border-[rgba(198,198,205,0.2)] bg-auth-navy">
              <Image src="/icons/envelope.svg" alt="" width={26} height={23} />
            </div>
            <h2 className="mb-3 font-heading text-[32px] font-semibold tracking-[-0.32px] text-auth-navy">
              Check your inbox
            </h2>
            <p className="px-12 text-center text-base leading-6 text-auth-navy">
              We&rsquo;ve sent a 6-digit verification code to{" "}
              <span className="font-medium">user@example.com</span>.
            </p>
          </div>

          <div className="flex w-full flex-col items-start gap-6">
            <OtpInput />
            <div className="w-full pt-4">
              <Button type="submit">Verify Email</Button>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-2 border-t border-[rgba(198,198,205,0.3)] pt-[25px]">
            <p className="text-center text-sm text-auth-navy">
              Didn&rsquo;t receive the email?
            </p>
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium tracking-[0.28px] text-auth-navy"
            >
              <Image src="/icons/refresh-small.svg" alt="" width={9} height={9} />
              Resend Email
            </button>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
