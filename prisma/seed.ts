/**
 * Prisma seed entrypoint — delegates to Task 6 seed-admin script
 * (Supabase Auth user + profiles table).
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const result = spawnSync(
  process.execPath,
  ["--import", "tsx", resolve("scripts/seed-admin.ts")],
  {
    stdio: "inherit",
    env: process.env,
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
