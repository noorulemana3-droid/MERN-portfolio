type RateLimitEntry = {
  failures: number;
  windowStartedAt: number;
  lockedUntil: number | null;
};

const store = new Map<string, RateLimitEntry>();

export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_LOCKOUT_MS = 15 * 60 * 1000;

function now() {
  return Date.now();
}

function getEntry(key: string): RateLimitEntry {
  const existing = store.get(key);
  if (!existing) {
    const created: RateLimitEntry = {
      failures: 0,
      windowStartedAt: now(),
      lockedUntil: null,
    };
    store.set(key, created);
    return created;
  }

  // Reset window if expired and not locked
  if (
    !existing.lockedUntil &&
    now() - existing.windowStartedAt > LOGIN_WINDOW_MS
  ) {
    existing.failures = 0;
    existing.windowStartedAt = now();
  }

  // Clear expired lock
  if (existing.lockedUntil && existing.lockedUntil <= now()) {
    existing.lockedUntil = null;
    existing.failures = 0;
    existing.windowStartedAt = now();
  }

  return existing;
}

export type RateLimitStatus = {
  blocked: boolean;
  retryAfterSeconds: number;
  attemptsRemaining: number;
  failures: number;
};

export function getLoginRateLimitStatus(key: string): RateLimitStatus {
  const entry = getEntry(key);
  const lockedMs = entry.lockedUntil ? Math.max(0, entry.lockedUntil - now()) : 0;
  const blocked = lockedMs > 0;

  return {
    blocked,
    retryAfterSeconds: blocked ? Math.ceil(lockedMs / 1000) : 0,
    attemptsRemaining: Math.max(0, LOGIN_MAX_ATTEMPTS - entry.failures),
    failures: entry.failures,
  };
}

/** Call before attempting auth. Returns status; if blocked, abort login. */
export function assertLoginAllowed(key: string): RateLimitStatus {
  return getLoginRateLimitStatus(key);
}

export function recordLoginFailure(key: string): RateLimitStatus {
  const entry = getEntry(key);
  entry.failures += 1;

  if (entry.failures >= LOGIN_MAX_ATTEMPTS) {
    entry.lockedUntil = now() + LOGIN_LOCKOUT_MS;
  }

  store.set(key, entry);
  return getLoginRateLimitStatus(key);
}

export function clearLoginRateLimit(key: string) {
  store.delete(key);
}

/** Build a stable rate-limit key from IP (+ optional email). */
export function buildLoginRateLimitKey(ip: string, email?: string) {
  const safeIp = ip.trim() || "unknown";
  const safeEmail = email?.trim().toLowerCase();
  return safeEmail ? `${safeIp}:${safeEmail}` : safeIp;
}
