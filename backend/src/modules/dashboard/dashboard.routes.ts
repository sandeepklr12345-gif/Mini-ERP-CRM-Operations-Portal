import { Router } from "express";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";
import { getDashboardStats } from "./dashboard.service";

const router = Router();

router.get(
  "/",
  authenticateJWT,
  asyncHandler(async (_req, res) => {
    const stats = await getDashboardStats();
    return ok(res, stats);
  })
);

export default router;
