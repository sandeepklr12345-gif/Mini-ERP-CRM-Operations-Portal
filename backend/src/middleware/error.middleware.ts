import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errorCode: "ROUTE_NOT_FOUND",
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `A record with this ${(err.meta?.target as string[])?.join(", ") ?? "value"} already exists`,
        errorCode: "UNIQUE_CONSTRAINT_VIOLATION",
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
        errorCode: "NOT_FOUND",
      });
    }
  }

  // Unexpected error - log full detail server-side, never leak internals to the client.
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    errorCode: "INTERNAL_ERROR",
    ...(env.nodeEnv === "development" && err instanceof Error ? { debug: err.message } : {}),
  });
}
