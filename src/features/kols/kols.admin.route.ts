import { Router } from "express";
import {
  createKolAdmin,
  deleteKolAdmin,
  getKolAdmin,
  listKolsAdmin,
  restoreKolAdmin,
  updateKolAdmin,
} from "./kols.admin.controller";

import { requireAdmin } from "../../middlewares/auth";
export const kolsAdminRouter = Router();

kolsAdminRouter.use(requireAdmin);

/**
 * @openapi
 * /admin/kols:
 *   get:
 *     tags: [Admin, KOLs]
 *     summary: List KOLs (admin)
 *     security: [{ bearerAuth: [] }]
 */
kolsAdminRouter.get("/", listKolsAdmin);

/**
 * @openapi
 * /admin/kols:
 *   post:
 *     tags: [Admin, KOLs]
 *     summary: Create KOL (admin)
 *     security: [{ bearerAuth: [] }]
 */
kolsAdminRouter.post("/", createKolAdmin);
kolsAdminRouter.get("/:id", getKolAdmin);
kolsAdminRouter.patch("/:id", updateKolAdmin);
kolsAdminRouter.delete("/:id", deleteKolAdmin);
kolsAdminRouter.post("/:id/restore", restoreKolAdmin);
