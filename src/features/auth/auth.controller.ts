import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { env } from "../../config/env";
import { Admin } from "../../models/Admin";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "../../utils/tokens";
import { loginSchema } from "./auth.schema";
import { login } from "./auth.service";

function refreshCookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ("none" as const) : ("lax" as const),
    domain: isProd ? env.COOKIE_DOMAIN : undefined,
    path: "/api/v1/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export const getHello = asyncHandler(async (req: Request, res: Response) => {
  // Sử dụng hàm ok để trả về JSON chuẩn theo format dự án
  return ok(res, { message: "Hello World" });
});

export const postLogin = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);
  const { accessToken, refreshToken } = await login(body.email, body.password);
  res.cookie("refresh_token", refreshToken, refreshCookieOptions());
  return ok(res, { accessToken });
});

export const postRefresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Missing refresh token" },
    });
  }

  const payload = verifyRefreshToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid/expired refresh token" },
    });
  }

  const admin = await Admin.findById(payload.sub);
  if (!admin?.refreshTokenHash) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid refresh token" },
    });
  }

  const match = await bcrypt.compare(token, admin.refreshTokenHash);
  if (!match) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid refresh token" },
    });
  }

  const newPayload = { sub: String(admin._id), email: admin.email };
  const accessToken = signAccessToken(newPayload);
  const refreshToken = signRefreshToken(newPayload);

  admin.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await admin.save();

  res.cookie("refresh_token", refreshToken, refreshCookieOptions());
  return ok(res, { accessToken });
});

export const postLogout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;

  if (token) {
    const payload = verifyRefreshToken(token);
    if (payload) {
      await Admin.findByIdAndUpdate(payload.sub, { refreshTokenHash: null });
    }
  }

  res.clearCookie("refresh_token", refreshCookieOptions());
  return ok(res, { loggedOut: true });
});
