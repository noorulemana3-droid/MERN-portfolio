"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/auth/client-ip";
import { verifyPassword } from "@/lib/auth/password";
import { createTotpPendingToken, verifyTotpPendingToken } from "@/lib/auth/pending-token";
import {
  assertLoginAllowed,
  buildLoginRateLimitKey,
  buildTotpRateLimitKey,
  clearLoginRateLimit,
  LOGIN_MAX_ATTEMPTS,
  recordLoginFailure,
} from "@/lib/auth/rate-limit";
import {
  isRecaptchaConfigured,
  verifyRecaptchaToken,
} from "@/lib/auth/recaptcha";
import {
  clearAdminSession,
  setAdminSession,
} from "@/lib/auth/session";
import { decryptTotpSecret, verifyTotpCode } from "@/lib/auth/totp";
import {
  loginSchema,
  totpCodeSchema,
  type LoginInput,
  type TotpCodeInput,
} from "@/lib/validations";

export type LoginResult =
  | { ok: true }
  | {
      ok: true;
      totpRequired: true;
      pendingToken: string;
    }
  | {
      ok: false;
      error: string;
      code?: "RATE_LIMITED" | "CAPTCHA" | "AUTH" | "VALIDATION" | "TOTP";
      retryAfterSeconds?: number;
      attemptsRemaining?: number;
    };

export async function loginAction(
  input: LoginInput,
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION",
      error: parsed.error.issues[0]?.message ?? "Invalid credentials",
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const ip = await getClientIp();
  const rateKey = buildLoginRateLimitKey(ip, email);

  const limit = assertLoginAllowed(rateKey);
  if (limit.blocked) {
    return {
      ok: false,
      code: "RATE_LIMITED",
      error: `Too many failed attempts. Try again in ${limit.retryAfterSeconds}s.`,
      retryAfterSeconds: limit.retryAfterSeconds,
      attemptsRemaining: 0,
    };
  }

  if (isRecaptchaConfigured()) {
    const captcha = await verifyRecaptchaToken(
      parsed.data.captchaToken ?? "",
      "login",
      ip,
    );
    if (!captcha.ok) {
      return {
        ok: false,
        code: "CAPTCHA",
        error: captcha.error,
        attemptsRemaining: limit.attemptsRemaining,
      };
    }
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      const afterFail = recordLoginFailure(rateKey);
      if (afterFail.blocked) {
        return {
          ok: false,
          code: "RATE_LIMITED",
          error: `Too many failed attempts. Try again in ${afterFail.retryAfterSeconds}s.`,
          retryAfterSeconds: afterFail.retryAfterSeconds,
          attemptsRemaining: 0,
        };
      }
      return {
        ok: false,
        code: "AUTH",
        error: `Invalid email or password. ${afterFail.attemptsRemaining} attempt${afterFail.attemptsRemaining === 1 ? "" : "s"} left.`,
        attemptsRemaining: afterFail.attemptsRemaining,
      };
    }

    const valid = await verifyPassword(
      parsed.data.password,
      admin.passwordHash,
    );

    if (!valid) {
      const afterFail = recordLoginFailure(rateKey);
      if (afterFail.blocked) {
        return {
          ok: false,
          code: "RATE_LIMITED",
          error: `Too many failed attempts. Try again in ${afterFail.retryAfterSeconds}s.`,
          retryAfterSeconds: afterFail.retryAfterSeconds,
          attemptsRemaining: 0,
        };
      }
      return {
        ok: false,
        code: "AUTH",
        error: `Invalid email or password. ${afterFail.attemptsRemaining} attempt${afterFail.attemptsRemaining === 1 ? "" : "s"} left.`,
        attemptsRemaining: afterFail.attemptsRemaining,
      };
    }

    clearLoginRateLimit(rateKey);

    if (admin.totpEnabled && admin.totpSecret) {
      const pendingToken = await createTotpPendingToken({
        sub: admin.id,
        email: admin.email,
        name: admin.name,
      });
      return {
        ok: true,
        totpRequired: true,
        pendingToken,
      };
    }

    await setAdminSession({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
    });

    return { ok: true };
  } catch (error) {
    console.error("loginAction database error:", error);
    return {
      ok: false,
      code: "AUTH",
      error:
        "Unable to reach the database. Please try again in a moment.",
      attemptsRemaining: limit.attemptsRemaining,
    };
  }
}

export async function verifyTotpAction(
  input: TotpCodeInput,
): Promise<LoginResult> {
  const parsed = totpCodeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION",
      error: parsed.error.issues[0]?.message ?? "Invalid authenticator code",
    };
  }

  const pending = await verifyTotpPendingToken(parsed.data.pendingToken);
  if (!pending) {
    return {
      ok: false,
      code: "TOTP",
      error: "Login session expired. Please sign in again.",
    };
  }

  const ip = await getClientIp();
  const rateKey = buildTotpRateLimitKey(ip, pending.email);
  const limit = assertLoginAllowed(rateKey);
  if (limit.blocked) {
    return {
      ok: false,
      code: "RATE_LIMITED",
      error: `Too many failed 2FA attempts. Try again in ${limit.retryAfterSeconds}s.`,
      retryAfterSeconds: limit.retryAfterSeconds,
      attemptsRemaining: 0,
    };
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: pending.sub },
    });

    if (!admin?.totpEnabled || !admin.totpSecret) {
      return {
        ok: false,
        code: "TOTP",
        error: "Two-factor authentication is not enabled for this account.",
      };
    }

    const plainSecret = decryptTotpSecret(admin.totpSecret);
    const valid = verifyTotpCode(
      plainSecret,
      parsed.data.code,
      admin.email,
    );

    if (!valid) {
      const afterFail = recordLoginFailure(rateKey);
      if (afterFail.blocked) {
        return {
          ok: false,
          code: "RATE_LIMITED",
          error: `Too many failed 2FA attempts. Try again in ${afterFail.retryAfterSeconds}s.`,
          retryAfterSeconds: afterFail.retryAfterSeconds,
          attemptsRemaining: 0,
        };
      }
      return {
        ok: false,
        code: "TOTP",
        error: `Invalid authenticator code. ${afterFail.attemptsRemaining} attempt${afterFail.attemptsRemaining === 1 ? "" : "s"} left.`,
        attemptsRemaining: afterFail.attemptsRemaining,
      };
    }

    clearLoginRateLimit(rateKey);

    await setAdminSession({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
    });

    return { ok: true };
  } catch (error) {
    console.error("verifyTotpAction error:", error);
    return {
      ok: false,
      code: "TOTP",
      error: "Unable to verify authenticator code. Please try again.",
      attemptsRemaining: limit.attemptsRemaining,
    };
  }
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/login");
}

export async function getLoginSecurityInfo() {
  return {
    recaptchaEnabled: isRecaptchaConfigured(),
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "",
    maxAttempts: LOGIN_MAX_ATTEMPTS,
  };
}
