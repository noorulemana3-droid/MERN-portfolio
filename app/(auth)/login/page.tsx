import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
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
    <Suspense
      fallback={
        <div className="glass w-full max-w-md rounded-2xl p-8 text-center text-sm text-muted">
          Loading login...
        </div>
      }
    >
      <LoginFormLoader />
    </Suspense>
  );
}
