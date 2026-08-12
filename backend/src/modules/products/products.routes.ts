import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { createProductSchema, updateProductSchema } from "./products.schema";
import {
  listProductsHandler,
  getProductHandler,
  createProductHandler,
  updateProductHandler,
} from "./products.controller";

const router = Router();

router.use(authenticateJWT);

// All roles can view products; only ADMIN/WAREHOUSE manage the catalog.
router.get("/", authorizeRoles("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"), listProductsHandler);
router.get("/:id", authorizeRoles("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"), getProductHandler);
router.post("/", authorizeRoles("ADMIN", "WAREHOUSE"), validate(createProductSchema), createProductHandler);
router.put("/:id", authorizeRoles("ADMIN", "WAREHOUSE"), validate(updateProductSchema), updateProductHandler);

export default router;
