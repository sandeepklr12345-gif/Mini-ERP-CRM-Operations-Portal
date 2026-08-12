import { Prisma, PrismaClient } from "@prisma/client";

type TxClient = Prisma.TransactionClient | PrismaClient;

/**
 * Generates the next challan number for the current year, e.g. CH-2026-000001.
 * Uses an upsert + atomic increment on a per-year sequence row so that
 * concurrent challan creations never collide, without needing a raw
 * SQL sequence object. Must be called inside the same transaction that
 * creates the Challan row, so the increment and the insert commit together.
 */
export async function nextChallanNumber(tx: TxClient): Promise<string> {
  const year = new Date().getFullYear();

  const sequence = await tx.challanSequence.upsert({
    where: { year },
    create: { year, lastSeq: 1 },
    update: { lastSeq: { increment: 1 } },
  });

  const padded = String(sequence.lastSeq).padStart(6, "0");
  return `CH-${year}-${padded}`;
}
