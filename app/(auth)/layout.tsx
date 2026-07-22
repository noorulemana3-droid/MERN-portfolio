import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--orb-a)] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 translate-x-1/3 rounded-full bg-[var(--orb-b)] blur-3xl" />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
