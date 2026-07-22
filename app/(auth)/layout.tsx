import type { ReactNode } from "react";
import { Atmosphere } from "@/components/common/atmosphere";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Atmosphere />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
