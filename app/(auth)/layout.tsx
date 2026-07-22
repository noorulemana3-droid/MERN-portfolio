import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="login-galaxy-shell relative flex min-h-screen items-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div aria-hidden className="login-galaxy-bg absolute inset-0" />
      <div aria-hidden className="login-stars absolute inset-0 opacity-70" />
      <div aria-hidden className="login-galaxy-glow absolute inset-0" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
