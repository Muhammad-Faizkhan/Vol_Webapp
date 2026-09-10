import Image from "next/image";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div className="flex w-[570px] flex-col items-start gap-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex w-[380px] flex-col items-center gap-6">
            <div className="flex size-[120px] items-center justify-center rounded-full bg-auth-slate">
              <span className="text-[32px] text-white">Logo</span>
            </div>
            <div className="flex w-[380px] flex-col items-start gap-4">
              <h1 className="w-full whitespace-nowrap text-center text-[32px] font-medium text-auth-slate">
                Forgot Password?
              </h1>
              <p className="w-full whitespace-nowrap text-center text-base font-medium leading-[23px] text-auth-slate">
                Enter email to get One-Time Password to verify your account.
              </p>
            </div>
          </div>
        </div>

        <form className="flex w-[570px] flex-col items-start gap-10">
          <div className="flex w-full flex-col items-start gap-4">
            <label className="text-lg font-medium text-auth-slate">Email</label>
            <TextField
              icon={<Image src="/icons/gmail.svg" alt="" width={24} height={24} />}
              type="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>

          <Button type="submit">Get OTP</Button>
        </form>
      </div>
    </AuthShell>
  );
}
