"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlesPublicRouter = void 0;
const express_1 = require("express");
const articles_controller_1 = require("./articles.controller");
exports.articlesPublicRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/v1/articles:
 *   get:
 *     tags: [Articles]
 *     summary: List published articles (public)
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Full-text search (title/content)
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *         description: Filter by tag (UI dùng như category)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12, maximum: 50 }
 *     responses:
 *       200:
 *         description: OK
 */
exports.articlesPublicRouter.get("/", articles_controller_1.getPublicArticles);
/**
 * @openapi
 * /api/v1/articles/{slug}:
 *   get:
 *     tags: [Articles]
 *     summary: Get article detail by slug (public)
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
exports.articlesPublicRouter.get("/:slug", articles_controller_1.getPublicArticleBySlug);
//# sourceMappingURL=articles.public.route.js.map