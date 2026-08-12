import { Response } from "express";

export function ok(res: Response, data: unknown, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function created(res: Response, data: unknown) {
  return ok(res, data, 201);
}

export function paginated(
  res: Response,
  data: unknown[],
  page: number,
  limit: number,
  total: number
) {
  return res.status(200).json({
    success: true,
    data,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, parseInt(String(query.page ?? "1"), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? "10"), 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
