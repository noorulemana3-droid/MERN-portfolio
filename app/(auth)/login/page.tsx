import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { LoginShowcase } from "@/components/admin/login-showcase";
import { getLoginSecurityInfo } from "@/actions/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

async function LoginFormLoader() {
  const security = await getLoginSecurityInfo();
  return (
    <LoginForm
      recaptchaSiteKey={security.siteKey}
      recaptchaEnabled={security.recaptchaEnabled}
      maxAttempts={security.maxAttempts}
    />
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl items-stretch gap-6 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-8">
      <div className="flex items-center justify-center lg:justify-start">
        <Suspense
          fallback={
            <div className="glass w-full max-w-md rounded-2xl p-8 text-center text-sm text-muted">
              Loading login...
            </div>
          }
        >
          <LoginFormLoader />
        </Suspense>
      </div>
      <LoginShowcase />
    </div>
  );
}
