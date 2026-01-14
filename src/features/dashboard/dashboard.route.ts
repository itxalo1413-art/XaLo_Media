import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth";
import { getDashboardStats } from "./dashboard.controller";

const router = Router();

router.use(requireAdmin);

/**
 * @openapi
 * /admin/dashboard/stats:
 *   get:
 *     tags: [Admin, Dashboard]
 *     summary: Get dashboard statistics
 *     security: [{ bearerAuth: [] }]
 */
router.get("/stats", getDashboardStats);

export default router;
