import { Router } from "express";
import { getSettings, updateSettings } from "./settings.controller";
import { requireAdmin } from "../../middlewares/auth"; // Assuming you have this middleware

const router = Router();

// Public routes
router.get("/settings", getSettings);

// Admin routes
router.patch("/admin/settings", requireAdmin, updateSettings);

export default router;
