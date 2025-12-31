import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { fail } from "../utils/response";
import { logger } from "../config/logger";

export function errorMiddleware(err: any, req: Request, res: Response, _next: NextFunction) {
  const rid = (req as any).rid;

  logger.error("API Error", {
    rid,
    message: err?.message,
    stack: err?.stack,
    path: req.path,
    method: req.method,
  });

  // 1) Zod validation
  if (err instanceof ZodError) {
    return fail(res, "VALIDATION_ERROR", "Invalid request", err.flatten(), 400);
  }

  // 2) Mongoose duplicate key (unique slug)
  if (err?.code === 11000) {
    return fail(res, "CONFLICT", "Duplicate key", err.keyValue ?? null, 409);
  }

  // 3) Mongoose validation
  if (err instanceof mongoose.Error.ValidationError) {
    return fail(res, "VALIDATION_ERROR", err.message, err.errors, 400);
  }

  // 4) Lỗi AI custom
  const statusCode = err?.statusCode || 500;
  if (statusCode === 502) {
    return fail(res, "AI_ERROR", err.message || "AI provider error", null, 502);
  }

  return fail(res, "INTERNAL_ERROR", err?.message || "Internal server error", null, 500);
}
