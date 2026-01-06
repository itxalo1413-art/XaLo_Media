"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUnpublishArticle = exports.adminPublishArticle = exports.adminRestoreArticle = exports.adminDeleteArticle = exports.adminUpdateArticle = exports.adminCreateArticle = exports.adminGetArticle = exports.adminListArticles = exports.getPublicArticleBySlug = exports.getPublicArticles = void 0;
const slugify_1 = __importDefault(require("slugify"));
const Article_1 = require("../../models/Article");
const asyncHandler_1 = require("../../utils/asyncHandler");
const response_1 = require("../../utils/response");
const articles_schema_1 = require("./articles.schema");
function normalizeSlug(input) {
    return (0, slugify_1.default)(input, { lower: true, strict: true, trim: true });
}
async function ensureUniqueSlug(base, excludeId) {
    const root = normalizeSlug(base);
    let slug = root;
    let i = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const exists = await Article_1.Article.findOne({
            slug,
            isDeleted: false,
            ...(excludeId ? { _id: { $ne: excludeId } } : {}),
        })
            .select("_id")
            .lean();
        if (!exists)
            return slug;
        i += 1;
        slug = `${root}-${i}`;
    }
}
/* =========================
   PUBLIC
========================= */
// GET /api/v1/articles
exports.getPublicArticles = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { q, tag, page, limit } = articles_schema_1.publicListQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const filter = { isDeleted: false, status: "published" };
    const sort = { publishedAt: -1, createdAt: -1 };
    if (tag)
        filter.tags = tag;
    if (q) {
        filter.$text = { $search: q };
        sort.score = { $meta: "textScore" };
        sort.publishedAt = -1;
    }
    const [items, total] = await Promise.all([
        Article_1.Article.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select("title slug excerpt tags featuredImageUrl publishedAt createdAt updatedAt")
            .lean(),
        Article_1.Article.countDocuments(filter),
    ]);
    return (0, response_1.ok)(res, { items, page, limit, total });
});
// GET /api/v1/articles/:slug
exports.getPublicArticleBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = articles_schema_1.slugParamSchema.parse(req.params);
    const doc = await Article_1.Article.findOneAndUpdate({ slug, isDeleted: false, status: "published" }, { $inc: { viewCount: 1 } }, { new: true }).lean();
    if (!doc) {
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
    }
    return (0, response_1.ok)(res, { article: doc });
});
/* =========================
   ADMIN
========================= */
// GET /api/v1/admin/articles
exports.adminListArticles = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { q, tag, status, source, includeDeleted, page, limit } = articles_schema_1.adminListQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const filter = {};
    if (!includeDeleted)
        filter.isDeleted = false;
    if (tag)
        filter.tags = tag;
    if (status)
        filter.status = status;
    if (source)
        filter.source = source;
    const sort = { updatedAt: -1, createdAt: -1 };
    if (q) {
        filter.$text = { $search: q };
        sort.score = { $meta: "textScore" };
        sort.updatedAt = -1;
    }
    const [items, total] = await Promise.all([
        Article_1.Article.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Article_1.Article.countDocuments(filter),
    ]);
    return (0, response_1.ok)(res, { items, page, limit, total });
});
// GET /api/v1/admin/articles/:id
exports.adminGetArticle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = articles_schema_1.mongoIdParamSchema.parse(req.params);
    const doc = await Article_1.Article.findById(id).lean();
    if (!doc)
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
    return (0, response_1.ok)(res, { article: doc });
});
// POST /api/v1/admin/articles
exports.adminCreateArticle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = articles_schema_1.createArticleSchema.parse(req.body);
    const slugBase = body.slug?.trim() ? body.slug : body.title;
    const slug = await ensureUniqueSlug(slugBase);
    const isPublishing = body.status === "published";
    const publishedAt = isPublishing ? body.publishedAt ?? new Date() : null;
    const doc = await Article_1.Article.create({
        ...body,
        slug,
        publishedAt,
        seo: body.seo ?? { metaTitle: "", metaDescription: "", ogImageUrl: "" },
    });
    res.status(201);
    return (0, response_1.ok)(res, { article: doc });
});
// PATCH /api/v1/admin/articles/:id
exports.adminUpdateArticle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = articles_schema_1.mongoIdParamSchema.parse(req.params);
    const body = articles_schema_1.updateArticleSchema.parse(req.body);
    const update = { ...body };
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
    const doc = await Article_1.Article.findByIdAndUpdate(id, update, { new: true });
    if (!doc)
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
    return (0, response_1.ok)(res, { article: doc });
});
// DELETE /api/v1/admin/articles/:id (soft delete)
exports.adminDeleteArticle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = articles_schema_1.mongoIdParamSchema.parse(req.params);
    const doc = await Article_1.Article.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!doc)
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
    return (0, response_1.ok)(res, { deleted: true });
});
// POST /api/v1/admin/articles/:id/restore
exports.adminRestoreArticle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = articles_schema_1.mongoIdParamSchema.parse(req.params);
    const doc = await Article_1.Article.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!doc)
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
    return (0, response_1.ok)(res, { restored: true, article: doc });
});
// POST /api/v1/admin/articles/:id/publish
exports.adminPublishArticle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = articles_schema_1.mongoIdParamSchema.parse(req.params);
    const doc = await Article_1.Article.findByIdAndUpdate(id, { status: "published", publishedAt: new Date() }, { new: true });
    if (!doc)
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
    return (0, response_1.ok)(res, { published: true, article: doc });
});
// POST /api/v1/admin/articles/:id/unpublish
exports.adminUnpublishArticle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = articles_schema_1.mongoIdParamSchema.parse(req.params);
    const doc = await Article_1.Article.findByIdAndUpdate(id, { status: "draft", publishedAt: null }, { new: true });
    if (!doc)
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Article not found" } });
    return (0, response_1.ok)(res, { unpublished: true, article: doc });
});
//# sourceMappingURL=articles.controller.js.map