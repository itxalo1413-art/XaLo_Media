"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const tokens_1 = require("../utils/tokens");
const response_1 = require("../utils/response");
function requireAdmin(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return (0, response_1.fail)(res, "UNAUTHORIZED", "Missing token", null, 401);
    const payload = (0, tokens_1.verifyAccessToken)(header.slice(7));
    if (!payload)
        return (0, response_1.fail)(res, "UNAUTHORIZED", "Invalid/expired token", null, 401);
    req.admin = payload;
    return next();
}
//# sourceMappingURL=auth.js.map