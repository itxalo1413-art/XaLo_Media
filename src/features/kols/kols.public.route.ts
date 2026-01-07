import { Router } from "express";
import { getKolBySlugPublic, listKolsPublic } from "./kols.public.controller";

export const kolsPublicRouter = Router();

/**
 * @openapi
 * /kols:
 *   get:
 *     tags: [KOLs]
 *     summary: List KOLs (public)
 */
kolsPublicRouter.get("/", listKolsPublic);

/**
 * @openapi
 * /kols/{slug}:
 *   get:
 *     tags: [KOLs]
 *     summary: Get KOL detail by slug (public)
 */
kolsPublicRouter.get("/:slug", getKolBySlugPublic);
