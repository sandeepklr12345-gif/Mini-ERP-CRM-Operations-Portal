import { z } from "zod";
import { ChallanStatus } from "@prisma/client";

const challanItemInput = z.object({
  productId: z.string().uuid("A valid productId is required"),
  quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
});

export const createChallanSchema = z.object({
  customerId: z.string().uuid("A valid customerId is required"),
  items: z.array(challanItemInput).min(1, "At least one product line is required"),
});

export const updateChallanSchema = z.object({
  customerId: z.string().uuid().optional(),
  items: z.array(challanItemInput).min(1).optional(),
});

export const listChallansQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.nativeEnum(ChallanStatus).optional(),
  customerId: z.string().uuid().optional(),
  challanNumber: z.string().optional(),
});

export type CreateChallanInput = z.infer<typeof createChallanSchema>;
export type UpdateChallanInput = z.infer<typeof updateChallanSchema>;
