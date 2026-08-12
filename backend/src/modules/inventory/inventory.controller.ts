import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { created, paginated, parsePagination } from "../../utils/response";
import * as inventoryService from "./inventory.service";

export const createMovementHandler = asyncHandler(async (req: Request, res: Response) => {
  const movement = await inventoryService.createMovement(req.body, req.user!.id);
  return created(res, movement);
});

export const listMovementsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const { productId, movementType, dateFrom, dateTo } = req.query as Record<string, string | undefined>;
  const { data, total } = await inventoryService.listMovements({
    page,
    limit,
    skip,
    productId,
    movementType: movementType as "IN" | "OUT" | undefined,
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
  });
  return paginated(res, data, page, limit, total);
});
