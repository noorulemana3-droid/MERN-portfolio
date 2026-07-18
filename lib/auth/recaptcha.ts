const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export function isRecaptchaConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() &&
      process.env.RECAPTCHA_SECRET_KEY?.trim(),
  );
}

export function getRecaptchaSiteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";
}

type RecaptchaVerifyResult =
  | { ok: true; score: number }
  | { ok: false; error: string; codes?: string[] };

function friendlyCaptchaError(codes: string[] = []) {
  if (codes.includes("incorrect-captcha-sol")) {
    return "reCAPTCHA keys don't match. Create a new v3 key pair and set both Site Key and Secret Key from the same reCAPTCHA site.";
  }
  if (codes.includes("invalid-input-secret")) {
    return "reCAPTCHA secret key is invalid. Check RECAPTCHA_SECRET_KEY on the server.";
  }
  if (codes.includes("missing-input-secret")) {
    return "reCAPTCHA secret key is missing on the server.";
  }
  if (codes.includes("invalid-input-response") || codes.includes("browser-error")) {
    return "reCAPTCHA rejected this request. Add vercel.app and localhost in your reCAPTCHA domains, then try again.";
  }
  if (codes.includes("timeout-or-duplicate")) {
    return "reCAPTCHA token expired. Please try signing in again.";
  }
  if (codes.includes("bad-request")) {
    return "reCAPTCHA request was invalid. Confirm you created a v3 key.";
  }
  if (codes.length) {
    return `reCAPTCHA verification failed (${codes.join(", ")}). Please try again.`;
  }
  return "reCAPTCHA verification failed. Please try again.";
}

/** Verify a reCAPTCHA v3 token with Google. */
export async function verifyRecaptchaToken(
  token: string,
  expectedAction = "login",
  remoteIp?: string,
): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: false, error: "reCAPTCHA is not configured on the server." };
  }

  if (!token.trim()) {
    return {
      ok: false,
      error:
        "reCAPTCHA token missing. Wait for the security check to load, then try again.",
      codes: ["missing-input-response"],
    };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteIp && remoteIp !== "unknown") {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    return { ok: false, error: "Could not reach Google reCAPTCHA. Please try again." };
  }

  const data = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
    hostname?: string;
    "error-codes"?: string[];
  };

  const codes = data["error-codes"] ?? [];

  if (!data.success) {
    console.error("[recaptcha] verify failed:", codes, "hostname:", data.hostname);
    return { ok: false, error: friendlyCaptchaError(codes), codes };
  }

  if (data.action && data.action !== expectedAction) {
    return {
      ok: false,
      error: `reCAPTCHA action mismatch (got "${data.action}"). Please try again.`,
      codes: ["action-mismatch"],
    };
  }

  const score = typeof data.score === "number" ? data.score : 0;
  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.3");

  if (score < minScore) {
    console.error("[recaptcha] low score:", score, "min:", minScore);
    return {
      ok: false,
      error: "Security check score was too low. Please try again.",
      codes: ["low-score"],
    };
  }

  return { ok: true, score };
}
