/**
 * Task 6 — seed the first (and only) Admin user.
 *
 * Creates the user in Supabase Authentication and upserts a matching row in
 * public.profiles (id = auth.users.id, role = Admin).
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *   npm run seed:admin
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL,
 *      ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

async function findAuthUserByEmail(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: { auth: { admin: { listUsers: (...args: any[]) => Promise<any> } } },
  email: string,
) {
  const perPage = 200;
  let page = 1;

  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;

    const match = data.users.find(
      (user: { email?: string | null }) => user.email?.toLowerCase() === email,
    );
    if (match) return match;

    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function main() {
  const url = required("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");
  required("DATABASE_URL");

  const email = (
    process.env.ADMIN_EMAIL || "nooruleman.a.3@gmail.com"
  )
    .trim()
    .toLowerCase();
  const name = (process.env.ADMIN_NAME || "Noor-Ul-Eman").trim();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  let authUser = await findAuthUserByEmail(supabase, email);

  if (authUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(
      authUser.id,
      {
        password,
        email_confirm: true,
        user_metadata: { name, role: "Admin" },
      },
    );
    if (error) throw error;
    authUser = data.user;
    console.log(`Updated existing Supabase Auth user: ${email}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: "Admin" },
    });
    if (error) throw error;
    if (!data.user) throw new Error("createUser returned no user");
    authUser = data.user;
    console.log(`Created Supabase Auth user: ${email}`);
  }

  // Keep profile.id aligned with auth.users.id (primary key).
  const existingByEmail = await prisma.profile.findUnique({ where: { email } });
  if (existingByEmail && existingByEmail.id !== authUser.id) {
    await prisma.profile.delete({ where: { email } });
  }

  const profile = await prisma.profile.upsert({
    where: { id: authUser.id },
    update: {
      email,
      name,
      role: "Admin",
    },
    create: {
      id: authUser.id,
      email,
      name,
      role: "Admin",
    },
  });

  // Enforce single-admin project: remove any other profile rows.
  const removed = await prisma.profile.deleteMany({
    where: { id: { not: profile.id } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} extra profile row(s)`);
  }

  console.log(
    `Seeded Admin profile: ${profile.email} (${profile.name}) id=${profile.id} role=${profile.role}`,
  );
  console.log("Login at /login with ADMIN_EMAIL / ADMIN_PASSWORD");
}

main()
  .catch((error) => {
    console.error("seed-admin failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
