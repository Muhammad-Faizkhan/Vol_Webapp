import Image from "next/image";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { TextField } from "@/components/ui/TextField";

export default function SignUpPage() {
  return (
    <AuthShell>
      <div className="flex w-[570px] flex-col items-center gap-10">
        <div className="flex w-[570px] flex-col items-start gap-6">
          <div className="flex w-full flex-col items-center">
            <div className="flex w-[380px] flex-col items-center gap-6">
              <div className="flex size-[120px] items-center justify-center rounded-full bg-auth-slate">
                <span className="text-[32px] text-white">Logo</span>
              </div>
              <div className="flex w-[380px] flex-col items-center gap-4">
                <h1 className="whitespace-nowrap text-center text-[32px] font-medium text-auth-slate">
                  Let&rsquo;s Sign Up
                </h1>
                <p className="whitespace-nowrap text-center text-base font-medium leading-[23px] text-auth-slate">
                  Enter your details below to sign up your account
                </p>
              </div>
            </div>
          </div>

          <form className="flex w-[570px] flex-col items-start gap-10">
            <div className="flex w-full flex-col items-start gap-4">
              <div className="flex w-full flex-col items-start gap-6">
                <div className="flex w-full flex-col items-start gap-4">
                  <label className="text-lg font-medium text-auth-slate">
                    Email
                  </label>
                  <TextField
                    icon={
                      <Image src="/icons/gmail.svg" alt="" width={24} height={24} />
                    }
                    type="email"
                    name="email"
                    placeholder="User@domain.com"
                  />
                </div>
                <div className="flex w-full flex-col items-start gap-4">
                  <label className="text-lg font-medium text-auth-slate">
                    Create Password
                  </label>
                  <TextField
                    icon={
                      <Image
                        src="/icons/lock-keyhole.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                    }
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
                    icon={
                      <Image
                        src="/icons/lock-keyhole.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                    }
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-base text-auth-checkbox">
                <Checkbox name="agree" />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="font-bold underline">
                    Terms &amp; Conditions
                  </Link>{" "}
                  |{" "}
                  <Link href="/privacy" className="font-bold underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <Button type="submit">Sign Up</Button>
          </form>
        </div>

        <Link
          href="/login"
          className="block w-full text-center text-base font-medium text-auth-slate"
        >
          Already have an account? <span className="font-bold underline">Sign In</span>
        </Link>
      </div>
    </AuthShell>
  );
}
