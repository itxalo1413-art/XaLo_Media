import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";
import { fail } from "../utils/response";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return fail(res, "UNAUTHORIZED", "Missing token", null, 401);

  const payload = verifyAccessToken(header.slice(7));
  if (!payload) return fail(res, "UNAUTHORIZED", "Invalid/expired token", null, 401);

  req.admin = payload;
  return next();
}
