import Image from "next/image";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        <Image src="/logo.png" width={200} height={200} alt="Logo" />
        <LoginForm />
      </div>
    </div>
  );
}
