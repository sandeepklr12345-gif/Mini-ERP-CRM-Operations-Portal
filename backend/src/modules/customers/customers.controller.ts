import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { created, ok, paginated, parsePagination } from "../../utils/response";
import * as customersService from "./customers.service";

export const listCustomersHandler = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const { search, status, type } = req.query as Record<string, string | undefined>;
  const { data, total } = await customersService.listCustomers({
    page,
    limit,
    skip,
    search,
    status,
    type,
  });
  return paginated(res, data, page, limit, total);
});

export const getCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customersService.getCustomerById(req.params.id);
  return ok(res, customer);
});

export const createCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customersService.createCustomer(req.body, req.user!.id);
  return created(res, customer);
});

export const updateCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customersService.updateCustomer(req.params.id, req.body);
  return ok(res, customer);
});

export const addFollowupHandler = asyncHandler(async (req: Request, res: Response) => {
  const followup = await customersService.addFollowup(req.params.id, req.body, req.user!.id);
  return created(res, followup);
});
