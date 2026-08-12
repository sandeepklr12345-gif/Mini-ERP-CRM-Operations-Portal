import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Verifies the Bearer JWT on the Authorization header and attaches the
 * decoded user to req.user. Rejects missing, malformed, expired or
 * otherwise invalid tokens with 401.
 */
export function authenticateJWT(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Missing or malformed Authorization header"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthUser;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(AppError.unauthorized("Token has expired", "TOKEN_EXPIRED"));
    }
    return next(AppError.unauthorized("Invalid token", "INVALID_TOKEN"));
  }
}

/**
 * Restricts a route to one or more roles. Must run after authenticateJWT.
 * Usage: router.get("/x", authenticateJWT, authorizeRoles("ADMIN", "SALES"), handler)
 */
export function authorizeRoles(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          `Role '${req.user.role}' is not permitted to perform this action`
        )
      );
    }
    next();
  };
}
