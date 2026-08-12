import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { createChallanSchema, updateChallanSchema } from "./challans.schema";
import {
  listChallansHandler,
  getChallanHandler,
  createChallanHandler,
  updateChallanHandler,
  confirmChallanHandler,
  cancelChallanHandler,
} from "./challans.controller";

const router = Router();

router.use(authenticateJWT);

router.get("/", authorizeRoles("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"), listChallansHandler);
router.get("/:id", authorizeRoles("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"), getChallanHandler);
router.post("/", authorizeRoles("ADMIN", "SALES"), validate(createChallanSchema), createChallanHandler);
router.put("/:id", authorizeRoles("ADMIN", "SALES"), validate(updateChallanSchema), updateChallanHandler);
router.post("/:id/confirm", authorizeRoles("ADMIN", "SALES"), confirmChallanHandler);
router.post("/:id/cancel", authorizeRoles("ADMIN", "SALES"), cancelChallanHandler);

export default router;
