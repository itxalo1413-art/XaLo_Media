"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlesAdminRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const articles_controller_1 = require("./articles.controller");
exports.articlesAdminRouter = (0, express_1.Router)();
exports.articlesAdminRouter.use(auth_1.requireAdmin);
/**
 * @openapi
 * /api/v1/admin/articles:
 *   get:
 *     tags: [Admin Articles]
 *     summary: List articles (admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
exports.articlesAdminRouter.get("/", articles_controller_1.adminListArticles);
/**
 * @openapi
 * /api/v1/admin/articles/{id}:
 *   get:
 *     tags: [Admin Articles]
 *     summary: Get article by id (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
exports.articlesAdminRouter.get("/:id", articles_controller_1.adminGetArticle);
/**
 * @openapi
 * /api/v1/admin/articles:
 *   post:
 *     tags: [Admin Articles]
 *     summary: Create article (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               slug: { type: string }
 *               excerpt: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               featuredImageUrl: { type: string }
 *               contentHtml: { type: string }
 *               source: { type: string, enum: [manual, ai] }
 *               status: { type: string, enum: [draft, published] }
 *     responses:
 *       201: { description: Created }
 */
exports.articlesAdminRouter.post("/", articles_controller_1.adminCreateArticle);
/**
 * @openapi
 * /api/v1/admin/articles/{id}:
 *   patch:
 *     tags: [Admin Articles]
 *     summary: Update article (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
exports.articlesAdminRouter.patch("/:id", articles_controller_1.adminUpdateArticle);
/**
 * @openapi
 * /api/v1/admin/articles/{id}:
 *   delete:
 *     tags: [Admin Articles]
 *     summary: Soft delete article (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
exports.articlesAdminRouter.delete("/:id", articles_controller_1.adminDeleteArticle);
/**
 * @openapi
 * /api/v1/admin/articles/{id}/restore:
 *   post:
 *     tags: [Admin Articles]
 *     summary: Restore deleted article (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
exports.articlesAdminRouter.post("/:id/restore", articles_controller_1.adminRestoreArticle);
/**
 * @openapi
 * /api/v1/admin/articles/{id}/publish:
 *   post:
 *     tags: [Admin Articles]
 *     summary: Publish article (admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
exports.articlesAdminRouter.post("/:id/publish", articles_controller_1.adminPublishArticle);
/**
 * @openapi
 * /api/v1/admin/articles/{id}/unpublish:
 *   post:
 *     tags: [Admin Articles]
 *     summary: Unpublish article (admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
exports.articlesAdminRouter.post("/:id/unpublish", articles_controller_1.adminUnpublishArticle);
//# sourceMappingURL=articles.admin.route.js.map