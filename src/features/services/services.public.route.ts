import { Router } from "express";
import { getPublicServiceBySlug, getPublicServices } from "./services.controller";

export const servicesPublicRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ServiceHighlight:
 *       type: object
 *       properties:
 *         text: { type: string, example: "2000+ KOLs/KOCs verified" }
 *         order: { type: number, example: 0 }
 *
 *     ServiceStat:
 *       type: object
 *       properties:
 *         value: { type: string, example: "2000+" }
 *         label: { type: string, example: "Active KOLs" }
 *
 *     ServiceSeo:
 *       type: object
 *       properties:
 *         metaTitle: { type: string, example: "Influencer Marketing | XaLo Media" }
 *         metaDescription: { type: string, example: "Kết nối với 2000+ KOLs/KOCs chất lượng cao..." }
 *         ogImageUrl: { type: string, example: "https://res.cloudinary.com/.../og.jpg" }
 *
 *     Service:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "676e4e0f1f0a2b3c4d5e6f70" }
 *         title: { type: string, example: "Influencer Marketing" }
 *         slug: { type: string, example: "influencer-marketing" }
 *         iconKey: { type: string, example: "influencer" }
 *         shortDescription: { type: string, example: "Kết nối với 2000+ KOLs/KOCs..." }
 *         highlights:
 *           type: array
 *           items: { $ref: "#/components/schemas/ServiceHighlight" }
 *         stat:
 *           oneOf:
 *             - $ref: "#/components/schemas/ServiceStat"
 *             - type: "null"
 *         contentHtml: { type: string, example: "<p>Chi tiết dịch vụ...</p>" }
 *         coverImageUrl: { type: string, example: "https://res.cloudinary.com/.../cover.jpg" }
 *         seo: { $ref: "#/components/schemas/ServiceSeo" }
 *         order: { type: number, example: 1 }
 *         isActive: { type: boolean, example: true }
 *         isDeleted: { type: boolean, example: false }
 *         createdAt: { type: string, example: "2025-12-27T10:00:00.000Z" }
 *         updatedAt: { type: string, example: "2025-12-27T10:10:00.000Z" }
 *
 *     PaginatedServices:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items: { $ref: "#/components/schemas/Service" }
 *         page: { type: number, example: 1 }
 *         limit: { type: number, example: 10 }
 *         total: { type: number, example: 42 }
 */

/**
 * @openapi
 * /services:
 *   get:
 *     tags: [Services]
 *     summary: Public - List active services
 *     description: Chỉ trả về service isActive=true và isDeleted=false
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Full-text search theo title/shortDescription/highlights
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: "#/components/schemas/PaginatedServices" }
 */
servicesPublicRouter.get("/", getPublicServices);

/**
 * @openapi
 * /services/{slug}:
 *   get:
 *     tags: [Services]
 *     summary: Public - Get service detail by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string, example: "influencer-marketing" }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     service: { $ref: "#/components/schemas/Service" }
 *       404:
 *         description: Not Found
 */
servicesPublicRouter.get("/:slug", getPublicServiceBySlug);
