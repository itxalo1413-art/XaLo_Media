"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogout = exports.postRefresh = exports.postLogin = exports.getHello = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
const Admin_1 = require("../../models/Admin");
const asyncHandler_1 = require("../../utils/asyncHandler");
const response_1 = require("../../utils/response");
const tokens_1 = require("../../utils/tokens");
const auth_schema_1 = require("./auth.schema");
const auth_service_1 = require("./auth.service");
function refreshCookieOptions() {
    const isProd = env_1.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: isProd ? env_1.env.COOKIE_DOMAIN : undefined,
        path: "/api/v1/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}
exports.getHello = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Sử dụng hàm ok để trả về JSON chuẩn theo format dự án
    return (0, response_1.ok)(res, { message: "Hello World" });
});
exports.postLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = auth_schema_1.loginSchema.parse(req.body);
    const { accessToken, refreshToken } = await (0, auth_service_1.login)(body.email, body.password);
    res.cookie("refresh_token", refreshToken, refreshCookieOptions());
    return (0, response_1.ok)(res, { accessToken });
});
exports.postRefresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.refresh_token;
    if (!token) {
        return res.status(401).json({
            success: false,
            error: { code: "UNAUTHORIZED", message: "Missing refresh token" },
        });
    }
    const payload = (0, tokens_1.verifyRefreshToken)(token);
    if (!payload) {
        return res.status(401).json({
            success: false,
            error: { code: "UNAUTHORIZED", message: "Invalid/expired refresh token" },
        });
    }
    const admin = await Admin_1.Admin.findById(payload.sub);
    if (!admin?.refreshTokenHash) {
        return res.status(401).json({
            success: false,
            error: { code: "UNAUTHORIZED", message: "Invalid refresh token" },
        });
    }
    const match = await bcrypt_1.default.compare(token, admin.refreshTokenHash);
    if (!match) {
        return res.status(401).json({
            success: false,
            error: { code: "UNAUTHORIZED", message: "Invalid refresh token" },
        });
    }
    const newPayload = { sub: String(admin._id), email: admin.email };
    const accessToken = (0, tokens_1.signAccessToken)(newPayload);
    const refreshToken = (0, tokens_1.signRefreshToken)(newPayload);
    admin.refreshTokenHash = await bcrypt_1.default.hash(refreshToken, 10);
    await admin.save();
    res.cookie("refresh_token", refreshToken, refreshCookieOptions());
    return (0, response_1.ok)(res, { accessToken });
});
exports.postLogout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.refresh_token;
    if (token) {
        const payload = (0, tokens_1.verifyRefreshToken)(token);
        if (payload) {
            await Admin_1.Admin.findByIdAndUpdate(payload.sub, { refreshTokenHash: null });
        }
    }
    res.clearCookie("refresh_token", refreshCookieOptions());
    return (0, response_1.ok)(res, { loggedOut: true });
});
//# sourceMappingURL=auth.controller.js.map