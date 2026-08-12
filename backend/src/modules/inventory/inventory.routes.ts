import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { createMovementSchema } from "./inventory.schema";
import { createMovementHandler, listMovementsHandler } from "./inventory.controller";

const router = Router();

router.use(authenticateJWT);

router.get("/movements", authorizeRoles("ADMIN", "WAREHOUSE", "SALES", "ACCOUNTS"), listMovementsHandler);
router.post("/movements", authorizeRoles("ADMIN", "WAREHOUSE"), validate(createMovementSchema), createMovementHandler);

export default router;
