"use client";

import { useCallback, useEffect, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

export function useRecaptchaV3(siteKey: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey) {
      setReady(false);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-recaptcha='v3']",
    );

    const markReady = () => {
      window.grecaptcha?.ready(() => setReady(true));
    };

    if (existing) {
      if (window.grecaptcha) markReady();
      else existing.addEventListener("load", markReady);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = "v3";
    script.addEventListener("load", markReady);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", markReady);
    };
  }, [siteKey]);

  const execute = useCallback(
    async (action: string) => {
      if (!siteKey) return "";
      if (!window.grecaptcha) {
        throw new Error("reCAPTCHA is still loading. Please wait a moment.");
      }

      return new Promise<string>((resolve, reject) => {
        window.grecaptcha!.ready(() => {
          window
            .grecaptcha!.execute(siteKey, { action })
            .then(resolve)
            .catch(() =>
              reject(new Error("reCAPTCHA failed. Please try again.")),
            );
        });
      });
    },
    [siteKey],
  );

  return { ready, execute, enabled: Boolean(siteKey) };
}
