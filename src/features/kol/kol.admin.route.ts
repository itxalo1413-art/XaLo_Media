import { Router } from "express";
import {
  createKolAdmin,
  deleteKolAdmin,
  getKolAdmin,
  listKolAdmin,
  restoreKolAdmin,
  updateKolAdmin,
} from "./kol.admin.controller";

import { requireAdmin } from "../../middlewares/auth";
export const kolAdminRouter = Router();

kolAdminRouter.use(requireAdmin);

/**
 * @openapi
 * /admin/kols:
 *   get:
 *     tags: [Admin, KOLs]
 *     summary: List KOLs (admin)
 *     security: [{ bearerAuth: [] }]
 */
kolAdminRouter.get("/", listKolAdmin);

/**
 * @openapi
 * /admin/kol:
 *   post:
 *     tags: [Admin, KOL]
 *     summary: Create KOL (admin)
 *     security: [{ bearerAuth: [] }]
 */
kolAdminRouter.post("/", createKolAdmin);
kolAdminRouter.get("/:id", getKolAdmin);
kolAdminRouter.patch("/:id", updateKolAdmin);
kolAdminRouter.delete("/:id", deleteKolAdmin);
kolAdminRouter.post("/:id/restore", restoreKolAdmin);
