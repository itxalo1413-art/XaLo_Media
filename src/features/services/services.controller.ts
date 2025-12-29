import { Request, Response } from "express";
import slugify from "slugify";
import { Service } from "../../models/Service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";

import {
  adminListQuerySchema,
  createServiceSchema,
  mongoIdParamSchema,
  publicListQuerySchema,
  slugParamSchema,
  updateServiceSchema,
} from "./services.schema";

function normalizeSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

function sortHighlights(list: Array<{ text: string; order?: number }>) {
  return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/* =========================
   PUBLIC
========================= */

export const getPublicServices = asyncHandler(async (req: Request, res: Response) => {
  const { q, page, limit } = publicListQuerySchema.parse(req.query);
  const skip = (page - 1) * limit;

  const filter: any = { isDeleted: false, isActive: true };
  const sort: any = { order: 1, createdAt: -1 };

  if (q) {
    filter.$text = { $search: q };
    sort.score = { $meta: "textScore" };
    sort.order = 1;
  }

  const [items, total] = await Promise.all([
    Service.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("title slug iconKey shortDescription highlights stat coverImageUrl order seo createdAt updatedAt")
      .lean(),
    Service.countDocuments(filter),
  ]);

  return ok(res, { items, page, limit, total });
});

export const getPublicServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = slugParamSchema.parse(req.params);

  const doc = await Service.findOne({ slug, isDeleted: false, isActive: true }).lean();
  if (!doc) {
    return res
      .status(404)
      .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
  }

  return ok(res, { service: doc });
});

/* =========================
   ADMIN
========================= */

export const adminListServices = asyncHandler(async (req: Request, res: Response) => {
  const { q, page, limit, includeDeleted, isActive } = adminListQuerySchema.parse(req.query);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (!includeDeleted) filter.isDeleted = false;
  if (typeof isActive === "boolean") filter.isActive = isActive;

  const sort: any = { order: 1, createdAt: -1 };
  if (q) {
    filter.$text = { $search: q };
    sort.score = { $meta: "textScore" };
    sort.order = 1;
  }

  const [items, total] = await Promise.all([
    Service.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Service.countDocuments(filter),
  ]);

  return ok(res, { items, page, limit, total });
});

export const adminGetService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);

  const doc = await Service.findById(id).lean();
  if (!doc) {
    return res
      .status(404)
      .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
  }

  return ok(res, { service: doc });
});

export const adminCreateService = asyncHandler(async (req: Request, res: Response) => {
  const body = createServiceSchema.parse(req.body);

  const slug = body.slug ? normalizeSlug(body.slug) : normalizeSlug(body.title);

  const exists = await Service.findOne({ slug, isDeleted: false }).select("_id").lean();
  if (exists) {
    return res
      .status(409)
      .json({ success: false, error: { code: "CONFLICT", message: "Slug already exists" } });
  }

  const doc = await Service.create({
    ...body,
    slug,
    highlights: sortHighlights(body.highlights ?? []),
    seo: body.seo ?? { metaTitle: "", metaDescription: "", ogImageUrl: "" },
  });

  res.status(201);
  return ok(res, { service: doc });
});

export const adminUpdateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);
  const body = updateServiceSchema.parse(req.body);

  const update: any = { ...body };

  if (typeof body.title === "string" && !body.slug) {
    update.slug = normalizeSlug(body.title);
  }
  if (typeof body.slug === "string") {
    update.slug = normalizeSlug(body.slug);
  }
  if (body.highlights) {
    update.highlights = sortHighlights(body.highlights);
  }

  if (update.slug) {
    const exists = await Service.findOne({ slug: update.slug, _id: { $ne: id }, isDeleted: false })
      .select("_id")
      .lean();
    if (exists) {
      return res
        .status(409)
        .json({ success: false, error: { code: "CONFLICT", message: "Slug already exists" } });
    }
  }

  const doc = await Service.findByIdAndUpdate(id, update, { new: true });
  if (!doc) {
    return res
      .status(404)
      .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
  }

  return ok(res, { service: doc });
});

export const adminDeleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);

  const doc = await Service.findByIdAndUpdate(id, { isDeleted: true, isActive: false }, { new: true });
  if (!doc) {
    return res
      .status(404)
      .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
  }

  return ok(res, { deleted: true });
});

export const adminRestoreService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);

  const doc = await Service.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
  if (!doc) {
    return res
      .status(404)
      .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
  }

  return ok(res, { restored: true, service: doc });
});
