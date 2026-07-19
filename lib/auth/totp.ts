import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import * as OTPAuth from "otpauth";
import { SITE } from "@/data/portfolio";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return createHash("sha256").update(secret).digest();
}

/** Encrypt a TOTP secret for storage. */
export function encryptTotpSecret(plainSecret: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainSecret, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

/** Decrypt a stored TOTP secret. */
export function decryptTotpSecret(payload: string) {
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Invalid TOTP secret payload");
  }
  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivB64, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

export function generateTotpSecret() {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

function buildTotp(plainSecret: string, email: string) {
  return new OTPAuth.TOTP({
    issuer: `${SITE.shortName} Admin`,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(plainSecret),
  });
}

export function buildTotpUri(plainSecret: string, email: string) {
  return buildTotp(plainSecret, email).toString();
}

/** Verify a 6-digit TOTP code (±1 step window). */
export function verifyTotpCode(plainSecret: string, code: string, email: string) {
  const totp = buildTotp(plainSecret, email);
  const delta = totp.validate({ token: code.trim(), window: 1 });
  return delta !== null;
}
