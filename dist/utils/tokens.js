"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const accessSecret = env_1.env.JWT_ACCESS_SECRET;
const refreshSecret = env_1.env.JWT_REFRESH_SECRET;
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, accessSecret, { expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN });
}
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, refreshSecret, { expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN });
}
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, accessSecret);
    }
    catch {
        return null;
    }
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, refreshSecret);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=tokens.js.map