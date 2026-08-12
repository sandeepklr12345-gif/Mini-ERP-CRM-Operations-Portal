import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import {
  createCustomerSchema,
  updateCustomerSchema,
  addFollowupSchema,
} from "./customers.schema";
import {
  listCustomersHandler,
  getCustomerHandler,
  createCustomerHandler,
  updateCustomerHandler,
  addFollowupHandler,
} from "./customers.controller";

const router = Router();

router.use(authenticateJWT);

// All roles may view customers; only ADMIN/SALES may create/edit/follow-up.
router.get("/", authorizeRoles("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"), listCustomersHandler);
router.get("/:id", authorizeRoles("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"), getCustomerHandler);
router.post("/", authorizeRoles("ADMIN", "SALES"), validate(createCustomerSchema), createCustomerHandler);
router.put("/:id", authorizeRoles("ADMIN", "SALES"), validate(updateCustomerSchema), updateCustomerHandler);
router.post(
  "/:id/followups",
  authorizeRoles("ADMIN", "SALES"),
  validate(addFollowupSchema),
  addFollowupHandler
);

export default router;
