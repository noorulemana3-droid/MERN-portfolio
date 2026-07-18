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

/** Verify a reCAPTCHA v3 token with Google. */
export async function verifyRecaptchaToken(
  token: string,
  expectedAction = "login",
): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: false, error: "reCAPTCHA is not configured on the server." };
  }

  if (!token.trim()) {
    return { ok: false, error: "reCAPTCHA verification failed. Please try again." };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    return { ok: false, error: "Could not verify reCAPTCHA. Please try again." };
  }

  const data = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };

  if (!data.success) {
    return { ok: false, error: "reCAPTCHA verification failed. Please try again." };
  }

  if (data.action && data.action !== expectedAction) {
    return { ok: false, error: "reCAPTCHA action mismatch. Please try again." };
  }

  const score = typeof data.score === "number" ? data.score : 0;
  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");

  if (score < minScore) {
    return {
      ok: false,
      error: "Security check failed. Please try again later.",
    };
  }

  return { ok: true, score };
}
