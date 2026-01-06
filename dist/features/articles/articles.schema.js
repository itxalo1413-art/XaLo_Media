"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateArticleSchema = exports.createArticleSchema = exports.adminListQuerySchema = exports.publicListQuerySchema = exports.slugParamSchema = exports.mongoIdParamSchema = void 0;
const zod_1 = require("zod");
const mongoId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid mongo id");
exports.mongoIdParamSchema = zod_1.z.object({ id: mongoId });
exports.slugParamSchema = zod_1.z.object({ slug: zod_1.z.string().min(1) });
exports.publicListQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().min(1).optional(),
    tag: zod_1.z.string().trim().min(1).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(12),
});
exports.adminListQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().min(1).optional(),
    tag: zod_1.z.string().trim().min(1).optional(),
    status: zod_1.z.enum(["draft", "published"]).optional(),
    source: zod_1.z.enum(["manual", "ai"]).optional(),
    includeDeleted: zod_1.z.coerce.boolean().default(false),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
const seoSchema = zod_1.z
    .object({
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    ogImageUrl: zod_1.z.string().optional(),
})
    .optional();
const aiMetaSchema = zod_1.z
    .object({
    provider: zod_1.z.string().optional(),
    model: zod_1.z.string().optional(),
    prompt: zod_1.z.string().optional(),
    topic: zod_1.z.string().optional(),
    keywords: zod_1.z.array(zod_1.z.string()).optional(),
    tone: zod_1.z.string().optional(),
    length: zod_1.z.string().optional(),
    temperature: zod_1.z.number().optional(),
    generatedAt: zod_1.z.coerce.date().optional(),
})
    .optional()
    .nullable();
exports.createArticleSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().optional(),
    contentHtml: zod_1.z.string().optional(),
    excerpt: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    featuredImageUrl: zod_1.z.string().optional(),
    status: zod_1.z.enum(["draft", "published"]).optional(),
    publishedAt: zod_1.z.coerce.date().optional().nullable(),
    source: zod_1.z.enum(["manual", "ai"]).optional(),
    aiMeta: aiMetaSchema,
    seo: seoSchema,
});
exports.updateArticleSchema = exports.createArticleSchema.partial();
//# sourceMappingURL=articles.schema.js.map