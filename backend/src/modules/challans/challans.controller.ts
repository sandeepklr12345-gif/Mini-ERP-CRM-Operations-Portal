import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { created, ok, paginated, parsePagination } from "../../utils/response";
import * as challansService from "./challans.service";

export const listChallansHandler = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const { status, customerId, challanNumber } = req.query as Record<string, string | undefined>;
  const { data, total } = await challansService.listChallans({
    page,
    limit,
    skip,
    status,
    customerId,
    challanNumber,
  });
  return paginated(res, data, page, limit, total);
});

export const getChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challansService.getChallanById(req.params.id);
  return ok(res, challan);
});

export const createChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challansService.createChallan(req.body, req.user!.id);
  return created(res, challan);
});

export const updateChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challansService.updateChallan(req.params.id, req.body);
  return ok(res, challan);
});

export const confirmChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challansService.confirmChallan(req.params.id, req.user!.id);
  return ok(res, challan);
});

export const cancelChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const challan = await challansService.cancelChallan(req.params.id, req.user!.id);
  return ok(res, challan);
});
