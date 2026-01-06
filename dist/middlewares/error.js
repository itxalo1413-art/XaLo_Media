"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const response_1 = require("../utils/response");
const logger_1 = require("../config/logger");
function errorMiddleware(err, req, res, _next) {
    const rid = req.rid;
    logger_1.logger.error("API Error", {
        rid,
        message: err?.message,
        stack: err?.stack,
        path: req.path,
        method: req.method,
    });
    // 1) Zod validation
    if (err instanceof zod_1.ZodError) {
        return (0, response_1.fail)(res, "VALIDATION_ERROR", "Invalid request", err.flatten(), 400);
    }
    // 2) Mongoose duplicate key (unique slug)
    if (err?.code === 11000) {
        return (0, response_1.fail)(res, "CONFLICT", "Duplicate key", err.keyValue ?? null, 409);
    }
    // 3) Mongoose validation
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        return (0, response_1.fail)(res, "VALIDATION_ERROR", err.message, err.errors, 400);
    }
    // 4) Lỗi AI custom
    const statusCode = err?.statusCode || 500;
    if (statusCode === 502) {
        return (0, response_1.fail)(res, "AI_ERROR", err.message || "AI provider error", null, 502);
    }
    return (0, response_1.fail)(res, "INTERNAL_ERROR", err?.message || "Internal server error", null, 500);
}
//# sourceMappingURL=error.js.map