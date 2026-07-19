"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/auth/client-ip";
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
  createAnonAuthClient,
  isSupabaseAuthConfigured,
} from "@/lib/supabase/admin";
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

function authFail(
  rateKey: string,
  attemptsRemainingFallback: number,
): Extract<LoginResult, { ok: false }> {
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
    attemptsRemaining: afterFail.attemptsRemaining ?? attemptsRemainingFallback,
  };
}

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

  if (!isSupabaseAuthConfigured()) {
    return {
      ok: false,
      code: "AUTH",
      error: "Authentication is not configured. Missing Supabase credentials.",
      attemptsRemaining: limit.attemptsRemaining,
    };
  }

  try {
    const supabase = createAnonAuthClient();
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password: parsed.data.password,
      });

    if (authError || !authData.user) {
      return authFail(rateKey, limit.attemptsRemaining);
    }

    const profile = await prisma.profile.findUnique({
      where: { id: authData.user.id },
    });

    // End Supabase session cookie/state — dashboard uses our signed admin cookie.
    await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);

    if (!profile || profile.role !== "Admin") {
      return authFail(rateKey, limit.attemptsRemaining);
    }

    clearLoginRateLimit(rateKey);

    if (profile.totpEnabled && profile.totpSecret) {
      const pendingToken = await createTotpPendingToken({
        sub: profile.id,
        email: profile.email,
        name: profile.name,
      });
      return {
        ok: true,
        totpRequired: true,
        pendingToken,
      };
    }

    await setAdminSession({
      sub: profile.id,
      email: profile.email,
      name: profile.name,
    });

    return { ok: true };
  } catch (error) {
    console.error("loginAction error:", error);
    return {
      ok: false,
      code: "AUTH",
      error:
        "Unable to sign in right now. Please try again in a moment.",
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
    const profile = await prisma.profile.findUnique({
      where: { id: pending.sub },
    });

    if (!profile?.totpEnabled || !profile.totpSecret) {
      return {
        ok: false,
        code: "TOTP",
        error: "Two-factor authentication is not enabled for this account.",
      };
    }

    const plainSecret = decryptTotpSecret(profile.totpSecret);
    const valid = verifyTotpCode(
      plainSecret,
      parsed.data.code,
      profile.email,
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
      sub: profile.id,
      email: profile.email,
      name: profile.name,
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
