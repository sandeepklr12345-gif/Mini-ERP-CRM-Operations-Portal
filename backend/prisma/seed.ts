import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123!", 10);

  const [admin, sales, warehouse, accounts] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@erp.test" },
      update: {},
      create: { name: "Admin User", email: "admin@erp.test", passwordHash: password, role: "ADMIN" },
    }),
    prisma.user.upsert({
      where: { email: "sales@erp.test" },
      update: {},
      create: { name: "Sales User", email: "sales@erp.test", passwordHash: password, role: "SALES" },
    }),
    prisma.user.upsert({
      where: { email: "warehouse@erp.test" },
      update: {},
      create: { name: "Warehouse User", email: "warehouse@erp.test", passwordHash: password, role: "WAREHOUSE" },
    }),
    prisma.user.upsert({
      where: { email: "accounts@erp.test" },
      update: {},
      create: { name: "Accounts User", email: "accounts@erp.test", passwordHash: password, role: "ACCOUNTS" },
    }),
  ]);

  const customer = await prisma.customer.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Rohan Traders",
      mobile: "9876543210",
      email: "rohan@rohantraders.com",
      businessName: "Rohan Traders Pvt Ltd",
      customerType: "WHOLESALE",
      status: "ACTIVE",
      address: "MG Road, Bengaluru",
      createdById: sales.id,
    },
  });

  const products = await Promise.all(
    [
      { name: "Steel Pipe 2-inch", sku: "SP-2IN-001", category: "Pipes", unitPrice: 450, currentStock: 200, minimumStock: 30 },
      { name: "PVC Elbow Joint", sku: "PVC-EL-002", category: "Fittings", unitPrice: 25, currentStock: 15, minimumStock: 20 },
      { name: "Copper Wire 1.5mm (100m)", sku: "CW-15-003", category: "Electrical", unitPrice: 3200, currentStock: 0, minimumStock: 5 },
    ].map((p) =>
      prisma.product.upsert({
        where: { sku: p.sku },
        update: {},
        create: { ...p, warehouseLocation: "Main Warehouse", createdById: warehouse.id },
      })
    )
  );

  console.log("Seed complete:");
  console.log({ admin: admin.email, sales: sales.email, warehouse: warehouse.email, accounts: accounts.email });
  console.log("Password for all test users: Password123!");
  console.log(`Sample customer: ${customer.name}`);
  console.log(`Sample products: ${products.map((p) => p.sku).join(", ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
