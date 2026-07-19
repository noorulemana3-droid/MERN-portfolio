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
  | { ok: false; error: string };

/** Safe messages for the login UI — never leak key/config details. */
function publicCaptchaError(codes: string[] = []) {
  if (
    codes.includes("missing-input-response") ||
    codes.includes("browser-error")
  ) {
    return "Security check is still loading. Please wait a second and try again.";
  }
  if (codes.includes("timeout-or-duplicate")) {
    return "Security check expired. Please try signing in again.";
  }
  if (codes.includes("low-score") || codes.includes("action-mismatch")) {
    return "We couldn't verify this sign-in attempt. Please try again.";
  }
  return "Security check failed. Please try again.";
}

/** Verify a reCAPTCHA v3 token with Google. */
export async function verifyRecaptchaToken(
  token: string,
  expectedAction = "login",
  remoteIp?: string,
): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    console.error("[recaptcha] RECAPTCHA_SECRET_KEY missing");
    return { ok: false, error: "Security check failed. Please try again." };
  }

  if (!token.trim()) {
    return {
      ok: false,
      error:
        "Security check is still loading. Please wait a second and try again.",
    };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteIp && remoteIp !== "unknown") {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      console.error("[recaptcha] siteverify HTTP", response.status);
      return {
        ok: false,
        error: "Security check is temporarily unavailable. Please try again.",
      };
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
      console.error("[recaptcha] verify failed:", codes, {
        hostname: data.hostname,
      });
      return { ok: false, error: publicCaptchaError(codes) };
    }

    if (data.action && data.action !== expectedAction) {
      console.error("[recaptcha] action mismatch:", data.action);
      return { ok: false, error: publicCaptchaError(["action-mismatch"]) };
    }

    const score = typeof data.score === "number" ? data.score : 0;
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.3");

    if (score < minScore) {
      console.error("[recaptcha] low score:", score, "min:", minScore);
      return { ok: false, error: publicCaptchaError(["low-score"]) };
    }

    return { ok: true, score };
  } catch (error) {
    console.error("[recaptcha] verify exception:", error);
    return {
      ok: false,
      error: "Security check is temporarily unavailable. Please try again.",
    };
  }
}
