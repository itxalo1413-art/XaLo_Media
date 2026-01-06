"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.postLogin);
router.get("/hello", auth_controller_1.getHello);
router.post("/refresh", auth_controller_1.postRefresh);
router.post("/logout", auth_controller_1.postLogout);
exports.default = router;
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
//# sourceMappingURL=auth.route.js.map