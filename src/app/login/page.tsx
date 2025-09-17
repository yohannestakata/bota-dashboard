import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import authBg from "@/assets/auth-bg.jpg";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full relative items-center justify-center p-6 md:p-10">
      <div className="absolute inset-0 -z-50 ">
        <Image src={authBg} alt="auth bg" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-background/90" />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
