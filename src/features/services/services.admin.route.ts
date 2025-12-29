import { Router } from "express";
import {
  adminCreateService,
  adminDeleteService,
  adminGetService,
  adminListServices,
  adminRestoreService,
  adminUpdateService,
} from "./services.controller";

import { requireAdmin } from "../../middlewares/auth";

export const servicesAdminRouter = Router();

servicesAdminRouter.use(requireAdmin);

/**
 * @openapi
 * components:
 *   schemas:
 *     ServiceCreateInput:
 *       type: object
 *       properties:
 *         title: { type: string, example: "Influencer Marketing" }
 *         slug: { type: string, example: "influencer-marketing" }
 *         iconKey: { type: string, example: "influencer" }
 *         shortDescription: { type: string, example: "Kết nối với 2000+ KOLs/KOCs..." }
 *         highlights:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ServiceHighlight"
 *         stat:
 *           oneOf:
 *             - $ref: "#/components/schemas/ServiceStat"
 *             - type: "null"
 *         contentHtml: { type: string, example: "<p>Chi tiết...</p>" }
 *         coverImageUrl: { type: string, example: "https://res.cloudinary.com/.../cover.jpg" }
 *         seo:
 *           $ref: "#/components/schemas/ServiceSeo"
 *         order: { type: number, example: 1 }
 *         isActive: { type: boolean, example: true }
 *       required: [title]
 *
 *     ServiceUpdateInput:
 *       type: object
 *       properties:
 *         title: { type: string, example: "Influencer Marketing (updated)" }
 *         slug: { type: string, example: "influencer-marketing-updated" }
 *         iconKey: { type: string, example: "influencer" }
 *         shortDescription: { type: string }
 *         highlights:
 *           type: array
 *           items: { $ref: "#/components/schemas/ServiceHighlight" }
 *         stat:
 *           oneOf:
 *             - $ref: "#/components/schemas/ServiceStat"
 *             - type: "null"
 *         contentHtml: { type: string }
 *         coverImageUrl: { type: string }
 *         seo: { $ref: "#/components/schemas/ServiceSeo" }
 *         order: { type: number }
 *         isActive: { type: boolean }
 */

/**
 * @openapi
 * /admin/services:
 *   get:
 *     tags: [Services]
 *     summary: Admin - List services
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: includeDeleted
 *         schema: { type: boolean, example: false }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: OK
 */
servicesAdminRouter.get("/", adminListServices);

/**
 * @openapi
 * /admin/services/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Admin - Get service by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "676e4e0f1f0a2b3c4d5e6f70" }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not Found }
 */
servicesAdminRouter.get("/:id", adminGetService);

/**
 * @openapi
 * /admin/services:
 *   post:
 *     tags: [Services]
 *     summary: Admin - Create service
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/ServiceCreateInput" }
 *     responses:
 *       201: { description: Created }
 *       409: { description: Slug already exists }
 */
servicesAdminRouter.post("/", adminCreateService);

/**
 * @openapi
 * /admin/services/{id}:
 *   patch:
 *     tags: [Services]
 *     summary: Admin - Update service
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "676e4e0f1f0a2b3c4d5e6f70" }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/ServiceUpdateInput" }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not Found }
 *       409: { description: Slug already exists }
 */
servicesAdminRouter.patch("/:id", adminUpdateService);

/**
 * @openapi
 * /admin/services/{id}:
 *   delete:
 *     tags: [Services]
 *     summary: Admin - Soft delete service (isDeleted=true, isActive=false)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "676e4e0f1f0a2b3c4d5e6f70" }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not Found }
 */
servicesAdminRouter.delete("/:id", adminDeleteService);

/**
 * @openapi
 * /admin/services/{id}/restore:
 *   post:
 *     tags: [Services]
 *     summary: Admin - Restore soft-deleted service (isDeleted=false)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "676e4e0f1f0a2b3c4d5e6f70" }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not Found }
 */
servicesAdminRouter.post("/:id/restore", adminRestoreService);
