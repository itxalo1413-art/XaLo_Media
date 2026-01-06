"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
const Admin_1 = require("../../models/Admin");
const response_1 = require("../../utils/response");
const tokens_1 = require("../../utils/tokens");
async function seedAdmin() {
    const existed = await Admin_1.Admin.findOne({ email: env_1.env.ADMIN_EMAIL });
    if (existed)
        return;
    const passwordHash = await bcrypt_1.default.hash(env_1.env.ADMIN_PASSWORD, 10);
    await Admin_1.Admin.create({ email: env_1.env.ADMIN_EMAIL, passwordHash });
    console.log("✅ Admin seeded");
}
async function login(email, password) {
    const admin = await Admin_1.Admin.findOne({ email });
    if (!admin)
        throw new response_1.AppError("UNAUTHORIZED", "Invalid credentials", 401);
    const ok = await bcrypt_1.default.compare(password, admin.passwordHash);
    if (!ok)
        throw new response_1.AppError("UNAUTHORIZED", "Invalid credentials", 401);
    const payload = { sub: String(admin._id), email: admin.email };
    const accessToken = (0, tokens_1.signAccessToken)(payload);
    const refreshToken = (0, tokens_1.signRefreshToken)(payload);
    admin.refreshTokenHash = await bcrypt_1.default.hash(refreshToken, 10);
    await admin.save();
    return { accessToken, refreshToken };
}
//# sourceMappingURL=auth.service.js.map