import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth";
import { getCloudinarySignature } from "./media.controller";

export const mediaRouter = Router();

mediaRouter.use(requireAdmin);

/**
 * @openapi
 * /api/v1/media/signature:
 *   get:
 *     tags: ["Admin", "Media"]
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
mediaRouter.get("/signature", getCloudinarySignature);
