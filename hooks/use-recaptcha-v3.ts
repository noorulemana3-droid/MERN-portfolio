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

/** Remove Google reCAPTCHA badge / widgets left in the DOM. */
export function removeRecaptchaBadge() {
  if (typeof document === "undefined") return;

  document
    .querySelectorAll(".grecaptcha-badge")
    .forEach((node) => node.remove());

  document
    .querySelectorAll('iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"]')
    .forEach((node) => {
      const parent = node.parentElement;
      node.remove();
      // Google often wraps the badge iframe in a fixed container
      if (
        parent &&
        parent !== document.body &&
        parent.childElementCount === 0 &&
        parent.className === ""
      ) {
        parent.remove();
      }
    });
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

    let script = existing;

    if (existing) {
      if (window.grecaptcha) markReady();
      else existing.addEventListener("load", markReady);
    } else {
      script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.dataset.recaptcha = "v3";
      script.addEventListener("load", markReady);
      document.head.appendChild(script);
    }

    return () => {
      // Leaving the login page — badge must not follow into the dashboard.
      removeRecaptchaBadge();
      setReady(false);
      if (script && !existing) {
        script.removeEventListener("load", markReady);
      }
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
