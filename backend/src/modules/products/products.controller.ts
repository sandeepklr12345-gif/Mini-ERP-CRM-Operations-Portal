import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { created, ok, paginated, parsePagination } from "../../utils/response";
import * as productsService from "./products.service";

export const listProductsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const { search, category, stockStatus } = req.query as Record<string, string | undefined>;
  const { data, total } = await productsService.listProducts({
    page,
    limit,
    skip,
    search,
    category,
    stockStatus: stockStatus as "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | undefined,
  });
  return paginated(res, data, page, limit, total);
});

export const getProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.getProductById(req.params.id);
  return ok(res, product);
});

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.createProduct(req.body, req.user!.id);
  return created(res, product);
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.updateProduct(req.params.id, req.body);
  return ok(res, product);
});
