import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = (
    process.env.ADMIN_EMAIL || "nooruleman.a.3@gmail.com"
  )
    .trim()
    .toLowerCase();
  const name = (process.env.ADMIN_NAME || "Noor-Ul-Eman").trim();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  const passwordHash = await hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
    },
    create: {
      email,
      name,
      passwordHash,
    },
  });

  console.log(`Seeded admin: ${admin.email} (${admin.name})`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
