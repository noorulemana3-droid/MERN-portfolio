import type { ReactNode } from "react";
import { Atmosphere } from "@/components/common/atmosphere";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <Atmosphere />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
