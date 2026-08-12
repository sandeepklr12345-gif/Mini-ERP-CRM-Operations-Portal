import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateProductInput, UpdateProductInput } from "./products.schema";

interface ListParams {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  category?: string;
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

// stockStatus is derived (currentStock vs minimumStock), so it can't be
// pushed into a plain WHERE — filter it in application code after the
// DB query for search/category. Fine at this scale; would move to a raw
// query or generated column if the catalog grew large.
export async function listProducts(params: ListParams) {
  const where: Prisma.ProductWhereInput = {
    ...(params.category ? { category: params.category } : {}),
    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { sku: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  if (!params.stockStatus) {
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: params.skip,
        take: params.limit,
        orderBy: { name: "asc" },
      }),
      prisma.product.count({ where }),
    ]);
    return { data, total };
  }

  // Filtered by derived stock status: fetch all matching search/category,
  // filter, then paginate in memory. Acceptable for a small-to-mid catalog.
  const all = await prisma.product.findMany({ where, orderBy: { name: "asc" } });
  const filtered = all.filter((p) => {
    if (params.stockStatus === "OUT_OF_STOCK") return p.currentStock === 0;
    if (params.stockStatus === "LOW_STOCK") return p.currentStock > 0 && p.currentStock <= p.minimumStock;
    return p.currentStock > p.minimumStock;
  });
  const total = filtered.length;
  const data = filtered.slice(params.skip, params.skip + params.limit);
  return { data, total };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw AppError.notFound("Product not found");
  return product;
}

export async function createProduct(input: CreateProductInput, createdById: string) {
  return prisma.product.create({
    data: { ...input, createdById },
  });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  await getProductById(id);
  return prisma.product.update({ where: { id }, data: input });
}
