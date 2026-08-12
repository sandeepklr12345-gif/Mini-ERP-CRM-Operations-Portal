import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateChallanInput, UpdateChallanInput } from "./challans.schema";
import { nextChallanNumber } from "./challanNumber";

interface ListParams {
  page: number;
  limit: number;
  skip: number;
  status?: string;
  customerId?: string;
  challanNumber?: string;
}

async function buildItemsFromInput(
  tx: Prisma.TransactionClient,
  items: { productId: string; quantity: number }[]
) {
  const productIds = items.map((i) => i.productId);
  const products = await tx.product.findMany({ where: { id: { in: productIds } } });

  const productMap = new Map(products.map((p) => [p.id, p]));
  const missing = productIds.filter((id) => !productMap.has(id));
  if (missing.length > 0) {
    throw AppError.badRequest(`Unknown product id(s): ${missing.join(", ")}`, "UNKNOWN_PRODUCT");
  }

  let totalQuantity = 0;
  const itemsData = items.map((item) => {
    const product = productMap.get(item.productId)!;
    const lineTotal = new Prisma.Decimal(product.unitPrice).mul(item.quantity);
    totalQuantity += item.quantity;
    return {
      productId: product.id,
      productNameSnapshot: product.name,
      skuSnapshot: product.sku,
      unitPriceSnapshot: product.unitPrice,
      quantity: item.quantity,
      lineTotal,
    };
  });

  return { itemsData, totalQuantity };
}

/**
 * Creates a challan in DRAFT status. Draft creation never touches stock
 * (per spec: "Draft creation should NOT reduce stock"). Product data is
 * snapshotted at creation time so later price/name changes don't alter
 * historical challans.
 */
export async function createChallan(input: CreateChallanInput, createdById: string) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { id: input.customerId } });
    if (!customer) throw AppError.notFound("Customer not found");

    const { itemsData, totalQuantity } = await buildItemsFromInput(tx, input.items);
    const challanNumber = await nextChallanNumber(tx);

    return tx.challan.create({
      data: {
        challanNumber,
        customerId: input.customerId,
        status: "DRAFT",
        totalQuantity,
        createdById,
        items: { create: itemsData },
      },
      include: { items: true, customer: true },
    });
}, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function getChallanById(id: string) {
  const challan = await prisma.challan.findUnique({
    where: { id },
    include: { items: true, customer: true, createdBy: { select: { name: true, email: true } } },
  });
  if (!challan) throw AppError.notFound("Challan not found");
  return challan;
}

export async function listChallans(params: ListParams) {
  const where: Prisma.ChallanWhereInput = {
    ...(params.status ? { status: params.status as never } : {}),
    ...(params.customerId ? { customerId: params.customerId } : {}),
    ...(params.challanNumber ? { challanNumber: { contains: params.challanNumber, mode: "insensitive" } } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.challan.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      orderBy: { createdAt: "desc" },
      include: { items: true, customer: { select: { name: true, businessName: true } } },
    }),
    prisma.challan.count({ where }),
  ]);

  return { data, total };
}

/**
 * A DRAFT challan can have its customer/items fully replaced before
 * confirmation. Not allowed once CONFIRMED or CANCELLED.
 */
export async function updateChallan(id: string, input: UpdateChallanInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.challan.findUnique({ where: { id } });
    if (!existing) throw AppError.notFound("Challan not found");
    if (existing.status !== "DRAFT") {
      throw AppError.badRequest("Only DRAFT challans can be edited", "CHALLAN_NOT_EDITABLE");
    }

    if (input.customerId) {
      const customer = await tx.customer.findUnique({ where: { id: input.customerId } });
      if (!customer) throw AppError.notFound("Customer not found");
    }

    if (input.items) {
      const { itemsData, totalQuantity } = await buildItemsFromInput(tx, input.items);
      await tx.challanItem.deleteMany({ where: { challanId: id } });
      return tx.challan.update({
        where: { id },
        data: {
          ...(input.customerId ? { customerId: input.customerId } : {}),
          totalQuantity,
          items: { create: itemsData },
        },
        include: { items: true, customer: true },
      });
    }

    return tx.challan.update({
      where: { id },
      data: { ...(input.customerId ? { customerId: input.customerId } : {}) },
      include: { items: true, customer: true },
    });
  });
}

/**
 * Confirms a DRAFT challan: validates live stock for every line item,
 * rejects the whole confirmation if ANY line is short (no partial
 * fulfillment), then atomically reduces stock, writes an OUT stock
 * movement per line, and flips the challan to CONFIRMED. All-or-nothing
 * via a single DB transaction - if any step fails, everything rolls back
 * and stock is left exactly as it was.
 */
export async function confirmChallan(id: string, confirmedById: string) {
  return prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({ where: { id }, include: { items: true } });
    if (!challan) throw AppError.notFound("Challan not found");
    if (challan.status !== "DRAFT") {
      throw AppError.badRequest(
        `Only DRAFT challans can be confirmed (current status: ${challan.status})`,
        "CHALLAN_NOT_DRAFT"
      );
    }

    // Validate stock for every line before mutating anything.
    const productIds = challan.items.map((i) => i.productId);
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const shortages: string[] = [];
    for (const item of challan.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        shortages.push(`${item.productNameSnapshot}: product no longer exists`);
        continue;
      }
      if (product.currentStock < item.quantity) {
        shortages.push(
          `${product.name}: available ${product.currentStock}, requested ${item.quantity}`
        );
      }
    }

    if (shortages.length > 0) {
      throw AppError.badRequest(
        `Insufficient stock for one or more items: ${shortages.join("; ")}`,
        "INSUFFICIENT_STOCK"
      );
    }

    // All lines have sufficient stock - reduce stock and log OUT movements.
    for (const item of challan.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { currentStock: { decrement: item.quantity } },
      });
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          movementType: "OUT",
          reason: `Challan ${challan.challanNumber} confirmed`,
          createdById: confirmedById,
        },
      });
    }

    return tx.challan.update({
      where: { id },
      data: { status: "CONFIRMED" },
      include: { items: true, customer: true },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

/**
 * Cancels a challan. DRAFT -> CANCELLED is always safe (no stock was
 * ever touched). CONFIRMED -> CANCELLED restores the stock that was
 * deducted at confirmation time via IN movements, so inventory stays
 * consistent. This restore-on-cancel behavior is a documented
 * assumption (see README) since the spec left it open.
 */
export async function cancelChallan(id: string, cancelledById: string) {
  return prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({ where: { id }, include: { items: true } });
    if (!challan) throw AppError.notFound("Challan not found");

    if (challan.status === "CANCELLED") {
      throw AppError.badRequest("Challan is already cancelled", "ALREADY_CANCELLED");
    }

    if (challan.status === "CONFIRMED") {
      for (const item of challan.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: { increment: item.quantity } },
        });
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            movementType: "IN",
            reason: `Challan ${challan.challanNumber} cancelled - stock restored`,
            createdById: cancelledById,
          },
        });
      }
    }

    return tx.challan.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { items: true, customer: true },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
