import { Router } from "express";
import { createInquiryPublic } from "./inquiries.controller";

export const inquiriesPublicRoutes = Router();

/**
 * @openapi
 * /api/v1/inquiries:
 *   post:
 *     tags: [Inquiries]
 *     summary: Submit inquiry from website form
 */
inquiriesPublicRoutes.post("/", createInquiryPublic);


