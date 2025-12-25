import { Router } from "express";
import { postLogin, postRefresh, postLogout } from "./auth.controller";

const router = Router();
router.post("/login", postLogin);
router.post("/refresh", postRefresh);
router.post("/logout", postLogout);
export default router;

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@yourdomain.com" }
 *               password: { type: string, example: "StrongPassword123" }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiResponse' }
 */