"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.ok = ok;
exports.fail = fail;
function ok(res, data = null, meta = null) {
    return res.json({ success: true, data, meta });
}
function fail(res, code, message, details, status = 400) {
    return res.status(status).json({ success: false, error: { code, message, details } });
}
class AppError extends Error {
    constructor(code, message, statusCode = 400, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=response.js.map