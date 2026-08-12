import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateMovementInput } from "./inventory.schema";

interface ListParams {
  page: number;
  limit: number;
  skip: number;
  productId?: string;
  movementType?: "IN" | "OUT";
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Manual stock movement (e.g. warehouse receiving new stock, or a
 * correction). Challan-driven OUT movements are created inside the
 * challan confirmation transaction, not here - see challans.service.
 */
export async function createMovement(input: CreateMovementInput, createdById: string) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: input.productId } });
    if (!product) throw AppError.notFound("Product not found");

    const delta = input.movementType === "IN" ? input.quantity : -input.quantity;
    const newStock = product.currentStock + delta;

    if (newStock < 0) {
      throw AppError.badRequest(
        `Insufficient stock for product ${product.name}. Available: ${product.currentStock}, Requested: ${input.quantity}`,
        "INSUFFICIENT_STOCK"
      );
    }

    const [movement] = await Promise.all([
      tx.stockMovement.create({
        data: {
          productId: input.productId,
          quantity: input.quantity,
          movementType: input.movementType,
          reason: input.reason,
          createdById,
        },
      }),
      tx.product.update({ where: { id: input.productId }, data: { currentStock: newStock } }),
    ]);

    return movement;
  });
}

export async function listMovements(params: ListParams) {
  const where: Prisma.StockMovementWhereInput = {
    ...(params.productId ? { productId: params.productId } : {}),
    ...(params.movementType ? { movementType: params.movementType } : {}),
    ...(params.dateFrom || params.dateTo
      ? {
          createdAt: {
            ...(params.dateFrom ? { gte: params.dateFrom } : {}),
            ...(params.dateTo ? { lte: params.dateTo } : {}),
          },
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true, sku: true } } },
    }),
    prisma.stockMovement.count({ where }),
  ]);

  return { data, total };
}