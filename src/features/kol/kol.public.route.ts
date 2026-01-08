import { Router } from "express";
import { getKolBySlugPublic, listKolPublic } from "./kol.public.controller";

export const kolPublicRouter = Router();

/**
 * @openapi
 * /kol:
 *   get:
 *     tags: [KOL]
 *     summary: List KOL (public)
 */
kolPublicRouter.get("/", listKolPublic);

/**
 * @openapi
 * /kol/{slug}:
 *   get:
 *     tags: [KOLs]
 *     summary: Get KOL detail by slug (public)
 */
kolPublicRouter.get("/:slug", getKolBySlugPublic);
