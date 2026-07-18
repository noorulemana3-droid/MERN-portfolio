"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/auth/client-ip";
import { verifyPassword } from "@/lib/auth/password";
import {
  assertLoginAllowed,
  buildLoginRateLimitKey,
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
import { loginSchema, type LoginInput } from "@/lib/validations";

export type LoginResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      code?: "RATE_LIMITED" | "CAPTCHA" | "AUTH" | "VALIDATION";
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
      // Don't burn login attempts on captcha/config issues
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
