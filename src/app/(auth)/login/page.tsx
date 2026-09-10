import Image from "next/image";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-[570px] flex-col items-start gap-6">
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full flex-col items-center gap-[50px]">
            <div className="flex w-[380px] flex-col items-center gap-6">
              <div className="flex size-[120px] items-center justify-center rounded-full bg-auth-slate">
                <span className="text-[32px] text-white">Logo</span>
              </div>
              <div className="flex w-[380px] flex-col items-center gap-4">
                <h1 className="whitespace-nowrap text-center text-[32px] font-medium text-auth-slate">
                  Login into your account
                </h1>
                <p className="whitespace-nowrap text-center text-base font-medium leading-[23px] text-auth-slate">
                  Enter your email below to login your account
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-4">
              <Button
                type="button"
                variant="outline"
                icon={
                  <Image src="/icons/google.png" alt="" width={40} height={40} />
                }
              >
                Login with google
              </Button>
              <Button
                type="button"
                variant="outline"
                icon={
                  <Image src="/icons/apple.svg" alt="" width={40} height={40} />
                }
              >
                Login with Apple
              </Button>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-1.5">
            <Image
              src="/icons/divider-line-left.svg"
              alt=""
              width={210}
              height={20}
            />
            <span className="whitespace-nowrap text-xl text-auth-slate">
              Or continue with
            </span>
            <Image
              src="/icons/divider-line-right.svg"
              alt=""
              width={210}
              height={20}
            />
          </div>
        </div>

        <form className="flex w-[570px] flex-col items-start gap-10">
          <div className="flex w-full flex-col items-end gap-4">
            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex w-full flex-col items-start gap-4">
                <label className="text-lg font-medium text-auth-slate">
                  Email
                </label>
                <TextField
                  icon={
                    <Image
                      src="/icons/gmail.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                  }
                  type="email"
                  name="email"
                  placeholder="User@domain.com"
                />
              </div>
              <div className="flex w-full flex-col items-start gap-4">
                <label className="text-lg font-medium text-auth-slate">
                  Password
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
            </div>

            <Link
              href="/forgot-password"
              className="text-base font-medium text-auth-slate"
            >
              Can&apos;t login? <span className="font-bold underline">Reset Password</span>
            </Link>
          </div>

          <Button type="submit">Login</Button>
        </form>
      </div>

      <Link
        href="/signup"
        className="block w-full text-center text-base font-medium text-auth-slate"
      >
        Don&apos;t have an account? <span className="font-bold underline">Sign Up</span>
      </Link>
      </div>
    </AuthShell>
  );
}
