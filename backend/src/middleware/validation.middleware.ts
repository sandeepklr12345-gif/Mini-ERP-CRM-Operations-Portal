import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/AppError";

type RequestPart = "body" | "query" | "params";

/**
 * Validates and replaces req[part] with the parsed (and type-coerced)
 * result of the given Zod schema. Throws a 422 AppError with field-level
 * details on failure.
 */
export function validate(schema: ZodSchema, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[part]);
      (req as unknown as Record<RequestPart, unknown>)[part] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        next(AppError.validation("Validation failed", details));
        return;
      }
      next(err);
    }
  };
}
