import { PrismaClient } from "@prisma/client";

// Single shared Prisma instance across the app (avoids exhausting DB
// connections in dev with hot-reload, and keeps one pool in prod).
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV === "development") {
  global.__prisma = prisma;
}
