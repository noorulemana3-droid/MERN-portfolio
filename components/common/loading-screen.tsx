"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/data/portfolio";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center">
        <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {SITE.shortName}
          <span className="gradient-text">.</span>
        </p>
        <div className="mx-auto mt-6 h-[2px] w-32 overflow-hidden rounded-full bg-accent-soft">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-accent to-accent-secondary" />
        </div>
      </div>
    </div>
  );
}
