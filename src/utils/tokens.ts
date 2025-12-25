import jwt, { type Secret } from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = { sub: string; email: string };

const accessSecret: Secret = env.JWT_ACCESS_SECRET;
const refreshSecret: Secret = env.JWT_REFRESH_SECRET;

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, accessSecret, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, accessSecret) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, refreshSecret) as JwtPayload;
  } catch {
    return null;
  }
}
