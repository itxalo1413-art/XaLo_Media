import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError, fail } from "../utils/response";
import { logger } from "../config/logger";

export function errorMiddleware(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error("API Error", {
    rid: (req as any).requestId,
    method: req.method,
    path: req.path,
    message: err?.message,
    stack: err?.stack,
  });

  if (err instanceof ZodError) return fail(res, "VALIDATION_ERROR", "Invalid request", err.flatten(), 422);
  if (err instanceof AppError) return fail(res, err.code, err.message, err.details, err.statusCode);

  return fail(res, "INTERNAL_ERROR", "Something went wrong", null, 500);
}
