import { Router } from "express";
import authRouter from "./modules/auth/auth.routes";
import customersRouter from "./modules/customers/customers.routes";
import productsRouter from "./modules/products/products.routes";
import inventoryRouter from "./modules/inventory/inventory.routes";
import challansRouter from "./modules/challans/challans.routes";
import dashboardRouter from "./modules/dashboard/dashboard.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/customers", customersRouter);
router.use("/products", productsRouter);
router.use("/inventory", inventoryRouter);
router.use("/challans", challansRouter);
router.use("/dashboard", dashboardRouter);

export default router;
