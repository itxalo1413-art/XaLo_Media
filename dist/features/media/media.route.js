"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const media_controller_1 = require("./media.controller");
exports.mediaRouter = (0, express_1.Router)();
exports.mediaRouter.use(auth_1.requireAdmin);
/**
 * @openapi
 * /api/v1/media/signature:
 *   get:
 *     tags: [Media]
 *     summary: Get Cloudinary upload signature (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema: { type: string, default: "xalomedia" }
 *     responses:
 *       200:
 *         description: OK
 */
exports.mediaRouter.get("/signature", media_controller_1.getCloudinarySignature);
//# sourceMappingURL=media.route.js.map