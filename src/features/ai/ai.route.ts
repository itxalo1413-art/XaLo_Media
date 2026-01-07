import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../../middlewares/auth";
import { adminGenerateArticle } from "./ai.controller";

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many AI requests, please try again later." },
  },
});

router.use(requireAdmin);

/**
 * @openapi
 * /api/v1/ai/articles/generate:
 *   post:
 *     tags: ["Admin / AI"]
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
router.post("/articles/generate", aiLimiter, adminGenerateArticle);

export default router;
