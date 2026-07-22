"use client";

import { useEffect } from "react";
import { removeRecaptchaBadge } from "@/hooks/use-recaptcha-v3";

/** Ensures the Google reCAPTCHA badge never appears on dashboard pages. */
export function RecaptchaBadgeCleaner() {
  useEffect(() => {
    removeRecaptchaBadge();

    const observer = new MutationObserver(() => {
      removeRecaptchaBadge();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
