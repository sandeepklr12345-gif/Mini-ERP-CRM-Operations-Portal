import { Router } from "express";
import { validate } from "../../middleware/validation.middleware";
import { loginSchema } from "./auth.schema";
import { loginHandler } from "./auth.controller";

const router = Router();

// POST /api/auth/login
router.post("/login", validate(loginSchema), loginHandler);

export default router;
