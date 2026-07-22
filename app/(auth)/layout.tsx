import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="login-sunny-shell relative flex min-h-screen items-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div aria-hidden className="login-sunny-bg absolute inset-0" />
      <div aria-hidden className="login-sun-rays absolute inset-0 opacity-50" />
      <div aria-hidden className="login-sunny-glow absolute inset-0" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
