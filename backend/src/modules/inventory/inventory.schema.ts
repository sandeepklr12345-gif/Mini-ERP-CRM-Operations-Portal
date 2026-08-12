import { z } from "zod";
import { MovementType } from "@prisma/client";

export const createMovementSchema = z.object({
  productId: z.string().uuid("A valid productId is required"),
  quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
  movementType: z.nativeEnum(MovementType),
  reason: z.string().min(1, "Reason is required"),
});

export const listMovementsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  productId: z.string().uuid().optional(),
  movementType: z.nativeEnum(MovementType).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export type CreateMovementInput = z.infer<typeof createMovementSchema>;
