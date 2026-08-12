import { prisma } from "../../config/prisma";

export async function getDashboardStats() {
  const [totalCustomers, totalProducts, allProducts, draftChallans, confirmedChallans, recentChallans] =
    await Promise.all([
      prisma.customer.count(),
      prisma.product.count(),
      prisma.product.findMany({ select: { currentStock: true, minimumStock: true } }),
      prisma.challan.count({ where: { status: "DRAFT" } }),
      prisma.challan.count({ where: { status: "CONFIRMED" } }),
      prisma.challan.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { name: true } } },
      }),
    ]);

  const lowStockProducts = allProducts.filter(
    (p) => p.currentStock > 0 && p.currentStock <= p.minimumStock
  ).length;
  const outOfStockProducts = allProducts.filter((p) => p.currentStock === 0).length;

  return {
    totalCustomers,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    draftChallans,
    confirmedChallans,
    recentChallans,
  };
}
