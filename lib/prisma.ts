import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client across serverless invocations in every environment.
globalForPrisma.prisma = prisma;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}
