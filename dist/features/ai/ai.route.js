"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = require("../../middlewares/auth");
const ai_controller_1 = require("./ai.controller");
const router = (0, express_1.Router)();
const aiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: { code: "RATE_LIMITED", message: "Too many AI requests, please try again later." },
    },
});
router.use(auth_1.requireAdmin);
/**
 * @openapi
 * /api/v1/ai/articles/generate:
 *   post:
 *     tags:
 *       - Admin / AI
 *     summary: Generate Article draft by AI (Gemini)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [topic]
 *             properties:
 *               topic: { type: string, example: "Marketing toàn cầu (Global Marketing) là gì" }
 *               keywords:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["global marketing", "SME", "startup"]
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["marketing"]
 *               tone: { type: string, example: "professional" }
 *               length: { type: string, example: "medium" }
 *               language: { type: string, example: "vi" }
 *               featuredImageUrl: { type: string, example: "https://res.cloudinary.com/.../image.jpg" }
 *               createDraft: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Draft returned (createDraft=false)
 *       201:
 *         description: Draft created in DB
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limited
 */
router.post("/articles/generate", aiLimiter, ai_controller_1.adminGenerateArticle);
exports.default = router;
//# sourceMappingURL=ai.route.js.map