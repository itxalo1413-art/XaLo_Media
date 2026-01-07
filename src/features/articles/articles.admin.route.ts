import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth";
import {
  adminCreateArticle,
  adminDeleteArticle,
  adminGetArticle,
  adminListArticles,
  adminPublishArticle,
  adminRestoreArticle,
  adminUnpublishArticle,
  adminUpdateArticle,
} from "./articles.controller";

export const articlesAdminRouter = Router();

articlesAdminRouter.use(requireAdmin);

/**
 * @openapi
 * /api/v1/admin/articles:
 *   get:
 *     tags: ["Admin", "Articles"]
 *     summary: List articles (admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
articlesAdminRouter.get("/", adminListArticles);

/**
 * @openapi
 * /api/v1/admin/articles/{id}:
 *   get:
 *     tags: ["Admin", "Articles"]
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
articlesAdminRouter.get("/:id", adminGetArticle);

/**
 * @openapi
 * /api/v1/admin/articles:
 *   post:
 *     tags: ["Admin", "Articles"]
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
articlesAdminRouter.post("/", adminCreateArticle);

/**
 * @openapi
 * /api/v1/admin/articles/{id}:
 *   patch:
 *     tags: ["Admin", "Articles"]
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
articlesAdminRouter.patch("/:id", adminUpdateArticle);

/**
 * @openapi
 * /api/v1/admin/articles/{id}:
 *   delete:
 *     tags: ["Admin", "Articles"]
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
articlesAdminRouter.delete("/:id", adminDeleteArticle);

/**
 * @openapi
 * /api/v1/admin/articles/{id}/restore:
 *   post:
 *     tags: ["Admin", "Articles"]
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
articlesAdminRouter.post("/:id/restore", adminRestoreArticle);

/**
 * @openapi
 * /api/v1/admin/articles/{id}/publish:
 *   post:
 *     tags: ["Admin", "Articles"]
 *     summary: Publish article (admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
articlesAdminRouter.post("/:id/publish", adminPublishArticle);

/**
 * @openapi
 * /api/v1/admin/articles/{id}/unpublish:
 *   post:
 *     tags: ["Admin", "Articles"]
 *     summary: Unpublish article (admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
articlesAdminRouter.post("/:id/unpublish", adminUnpublishArticle);
