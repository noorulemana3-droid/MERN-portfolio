import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/common/scroll-progress";
import { BackToTop } from "@/components/common/back-to-top";
import { LoadingScreen } from "@/components/common/loading-screen";
import { Atmosphere } from "@/components/common/atmosphere";
import { AiAssistant } from "@/components/ai/ai-assistant";
import type { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Atmosphere />
      <LoadingScreen />
      <ScrollProgress />
      <div className="relative z-10">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <AiAssistant />
      <BackToTop />
    </>
  );
}
