"use server";

import { SignJWT, jwtVerify } from "jose";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { verifyPassword } from "@/lib/auth/password";
import {
  buildTotpUri,
  decryptTotpSecret,
  encryptTotpSecret,
  generateTotpSecret,
  verifyTotpCode,
} from "@/lib/auth/totp";
import {
  totpDisableSchema,
  totpEnableConfirmSchema,
  type TotpDisableInput,
  type TotpEnableConfirmInput,
} from "@/lib/validations";

const SETUP_PURPOSE = "totp_setup";

function getSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

async function createSetupToken(adminId: string, plainSecret: string) {
  return new SignJWT({
    purpose: SETUP_PURPOSE,
    secret: plainSecret,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(getSecret());
}

async function verifySetupToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      !payload.sub ||
      payload.purpose !== SETUP_PURPOSE ||
      typeof payload.secret !== "string"
    ) {
      return null;
    }
    return { adminId: payload.sub, plainSecret: payload.secret };
  } catch {
    return null;
  }
}

export type TotpStatusResult = {
  enabled: boolean;
  verifiedAt: string | null;
};

export async function getTotpStatus(): Promise<TotpStatusResult> {
  const session = await requireAdmin();
  const admin = await prisma.admin.findUnique({
    where: { id: session.sub },
    select: { totpEnabled: true, totpVerifiedAt: true },
  });

  return {
    enabled: Boolean(admin?.totpEnabled),
    verifiedAt: admin?.totpVerifiedAt?.toISOString() ?? null,
  };
}

export type TotpSetupStartResult =
  | {
      ok: true;
      setupToken: string;
      secret: string;
      otpauthUrl: string;
      qrDataUrl: string;
    }
  | { ok: false; error: string };

export async function startTotpSetupAction(): Promise<TotpSetupStartResult> {
  const session = await requireAdmin();

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: session.sub },
      select: { email: true, totpEnabled: true },
    });
    if (!admin) {
      return { ok: false, error: "Admin account not found." };
    }
    if (admin.totpEnabled) {
      return { ok: false, error: "Two-factor authentication is already enabled." };
    }

    const plainSecret = generateTotpSecret();
    const otpauthUrl = buildTotpUri(plainSecret, admin.email);
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 220,
    });
    const setupToken = await createSetupToken(session.sub, plainSecret);

    return {
      ok: true,
      setupToken,
      secret: plainSecret,
      otpauthUrl,
      qrDataUrl,
    };
  } catch (error) {
    console.error("startTotpSetupAction error:", error);
    return {
      ok: false,
      error: "Could not start 2FA setup. Please try again.",
    };
  }
}

export type TotpActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function confirmTotpSetupAction(
  input: TotpEnableConfirmInput,
): Promise<TotpActionResult> {
  const session = await requireAdmin();
  const parsed = totpEnableConfirmSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid authenticator code",
    };
  }

  const setup = await verifySetupToken(parsed.data.setupToken);
  if (!setup || setup.adminId !== session.sub) {
    return {
      ok: false,
      error: "Setup session expired. Generate a new QR code and try again.",
    };
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: session.sub },
      select: { email: true, totpEnabled: true },
    });
    if (!admin) {
      return { ok: false, error: "Admin account not found." };
    }
    if (admin.totpEnabled) {
      return { ok: false, error: "Two-factor authentication is already enabled." };
    }

    const valid = verifyTotpCode(
      setup.plainSecret,
      parsed.data.code,
      admin.email,
    );
    if (!valid) {
      return {
        ok: false,
        error: "Invalid authenticator code. Check your app and try again.",
      };
    }

    await prisma.admin.update({
      where: { id: session.sub },
      data: {
        totpSecret: encryptTotpSecret(setup.plainSecret),
        totpEnabled: true,
        totpVerifiedAt: new Date(),
      },
    });

    return {
      ok: true,
      message: "Two-factor authentication is now enabled for your account.",
    };
  } catch (error) {
    console.error("confirmTotpSetupAction error:", error);
    return {
      ok: false,
      error: "Could not enable 2FA. Please try again.",
    };
  }
}

export async function disableTotpAction(
  input: TotpDisableInput,
): Promise<TotpActionResult> {
  const session = await requireAdmin();
  const parsed = totpDisableSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: session.sub },
    });
    if (!admin) {
      return { ok: false, error: "Admin account not found." };
    }
    if (!admin.totpEnabled || !admin.totpSecret) {
      return { ok: false, error: "Two-factor authentication is not enabled." };
    }

    const passwordOk = await verifyPassword(
      parsed.data.password,
      admin.passwordHash,
    );
    if (!passwordOk) {
      return { ok: false, error: "Incorrect password." };
    }

    const plainSecret = decryptTotpSecret(admin.totpSecret);
    const codeOk = verifyTotpCode(
      plainSecret,
      parsed.data.code,
      admin.email,
    );
    if (!codeOk) {
      return { ok: false, error: "Invalid authenticator code." };
    }

    await prisma.admin.update({
      where: { id: session.sub },
      data: {
        totpSecret: null,
        totpEnabled: false,
        totpVerifiedAt: null,
      },
    });

    return {
      ok: true,
      message: "Two-factor authentication has been disabled.",
    };
  } catch (error) {
    console.error("disableTotpAction error:", error);
    return {
      ok: false,
      error: "Could not disable 2FA. Please try again.",
    };
  }
}
