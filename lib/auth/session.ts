import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_DAYS,
  createSessionToken,
  verifySessionToken,
  type AdminSessionPayload,
} from "@/lib/auth/session-token";

export {
  ADMIN_SESSION_COOKIE,
  verifySessionToken,
  type AdminSessionPayload,
} from "@/lib/auth/session-token";

export async function setAdminSession(payload: AdminSessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
