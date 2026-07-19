import { SignJWT, jwtVerify } from "jose";
import type { AdminSessionPayload } from "@/lib/auth/session-token";

const TOTP_PENDING_PURPOSE = "totp_pending";
const TOTP_PENDING_TTL = "5m";

function getSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function createTotpPendingToken(payload: AdminSessionPayload) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    purpose: TOTP_PENDING_PURPOSE,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(TOTP_PENDING_TTL)
    .sign(getSecret());
}

export async function verifyTotpPendingToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      payload.purpose !== TOTP_PENDING_PURPOSE
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "Admin",
    } satisfies AdminSessionPayload;
  } catch {
    return null;
  }
}
