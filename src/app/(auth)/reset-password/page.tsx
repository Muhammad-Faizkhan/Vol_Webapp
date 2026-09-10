import Image from "next/image";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export default function ResetPasswordPage() {
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
                Reset Password
              </h1>
              <p className="w-full whitespace-nowrap text-center text-base font-medium leading-[23px] text-auth-slate">
                Set your new password and confirm your new password
              </p>
            </div>
          </div>
        </div>

        <form className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full flex-col items-start gap-4">
            <label className="text-lg font-medium text-auth-slate">Password</label>
            <TextField
              icon={<Image src="/icons/lock-keyhole.svg" alt="" width={24} height={24} />}
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex w-full flex-col items-start gap-4">
            <label className="text-lg font-medium text-auth-slate">
              Confirm Password
            </label>
            <TextField
              icon={<Image src="/icons/lock-keyhole.svg" alt="" width={24} height={24} />}
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
            />
          </div>

          <Button type="submit">Reset Password</Button>
        </form>
      </div>
    </AuthShell>
  );
}
