import { Request, Response } from "express";
import slugify from "slugify";
import { Article } from "../../models/Article";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";

import {
  adminListQuerySchema,
  createArticleSchema,
  mongoIdParamSchema,
  publicListQuerySchema,
  slugParamSchema,
  updateArticleSchema,
} from "./articles.schema";

function normalizeSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  const root = normalizeSlug(base);
  let slug = root;
  let i = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await Article.findOne({
      slug,
      isDeleted: false,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
      .select("_id")
      .lean();

    if (!exists) return slug;
    i += 1;
    slug = `${root}-${i}`;
  }
}

/* =========================
   PUBLIC
========================= */

// GET /api/v1/articles
export const getPublicArticles = asyncHandler(async (req: Request, res: Response) => {
  const { q, tag, page, limit } = publicListQuerySchema.parse(req.query);
  const skip = (page - 1) * limit;

  const filter: any = { isDeleted: false, status: "published" };
  const sort: any = { publishedAt: -1, createdAt: -1 };

  if (tag) filter.tags = tag;

  if (q) {
    filter.$text = { $search: q };
    sort.score = { $meta: "textScore" };
    sort.publishedAt = -1;
  }

  const [items, total] = await Promise.all([
    Article.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt tags featuredImageUrl publishedAt createdAt updatedAt")
      .lean(),
    Article.countDocuments(filter),
  ]);

  return ok(res, { items, page, limit, total });
});

// GET /api/v1/articles/:slug
export const getPublicArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = slugParamSchema.parse(req.params);

  const doc = await Article.findOneAndUpdate(
    { slug, isDeleted: false, status: "published" },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).lean();

  if (!doc) {
    return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
  }

  return ok(res, { article: doc });
});

/* =========================
   ADMIN
========================= */

// GET /api/v1/admin/articles
export const adminListArticles = asyncHandler(async (req: Request, res: Response) => {
  const { q, tag, status, source, includeDeleted, page, limit } = adminListQuerySchema.parse(req.query);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (!includeDeleted) filter.isDeleted = false;
  if (tag) filter.tags = tag;
  if (status) filter.status = status;
  if (source) filter.source = source;

  const sort: any = { updatedAt: -1, createdAt: -1 };
  if (q) {
    filter.$text = { $search: q };
    sort.score = { $meta: "textScore" };
    sort.updatedAt = -1;
  }

  const [items, total] = await Promise.all([
    Article.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Article.countDocuments(filter),
  ]);

  return ok(res, { items, page, limit, total });
});

// GET /api/v1/admin/articles/:id
export const adminGetArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);

  const doc = await Article.findById(id).lean();
  if (!doc) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });

  return ok(res, { article: doc });
});

// POST /api/v1/admin/articles
export const adminCreateArticle = asyncHandler(async (req: Request, res: Response) => {
  const body = createArticleSchema.parse(req.body);

  const slugBase = body.slug?.trim() ? body.slug : body.title;
  const slug = await ensureUniqueSlug(slugBase);

  const isPublishing = body.status === "published";
  const publishedAt = isPublishing ? body.publishedAt ?? new Date() : null;

  const doc = await Article.create({
    ...body,
    slug,
    publishedAt,
    seo: body.seo ?? { metaTitle: "", metaDescription: "", ogImageUrl: "" },
  });

  res.status(201);
  return ok(res, { article: doc });
});

// PATCH /api/v1/admin/articles/:id
export const adminUpdateArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);
  const body = updateArticleSchema.parse(req.body);

  const update: any = { ...body };

  if (typeof body.title === "string" && !body.slug) {
    update.slug = await ensureUniqueSlug(body.title, id);
  }
  if (typeof body.slug === "string") {
    update.slug = await ensureUniqueSlug(body.slug, id);
  }

  // Nếu set status=published mà chưa có publishedAt => set now
  if (body.status === "published" && !body.publishedAt) {
    update.publishedAt = new Date();
  }
  if (body.status === "draft") {
    update.publishedAt = null;
  }

  const doc = await Article.findByIdAndUpdate(id, update, { new: true });
  if (!doc) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });

  return ok(res, { article: doc });
});

// DELETE /api/v1/admin/articles/:id (soft delete)
export const adminDeleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);

  const doc = await Article.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!doc) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });

  return ok(res, { deleted: true });
});

// POST /api/v1/admin/articles/:id/restore
export const adminRestoreArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);

  const doc = await Article.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
  if (!doc) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });

  return ok(res, { restored: true, article: doc });
});

// POST /api/v1/admin/articles/:id/publish
export const adminPublishArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);

  const doc = await Article.findByIdAndUpdate(
    id,
    { status: "published", publishedAt: new Date() },
    { new: true }
  );

  if (!doc) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
  return ok(res, { published: true, article: doc });
});

// POST /api/v1/admin/articles/:id/unpublish
export const adminUnpublishArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = mongoIdParamSchema.parse(req.params);

  const doc = await Article.findByIdAndUpdate(
    id,
    { status: "draft", publishedAt: null },
    { new: true }
  );

  if (!doc) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
  return ok(res, { unpublished: true, article: doc });
});
