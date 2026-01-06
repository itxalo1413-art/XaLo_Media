"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminListQuerySchema = exports.publicListQuerySchema = exports.slugParamSchema = exports.mongoIdParamSchema = exports.updateServiceSchema = exports.createServiceSchema = exports.seoSchema = exports.statSchema = exports.highlightSchema = void 0;
const zod_1 = require("zod");
exports.highlightSchema = zod_1.z.object({
    text: zod_1.z.string().trim().min(1, "highlight.text is required"),
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.statSchema = zod_1.z.object({
    value: zod_1.z.string().trim().min(1, "stat.value is required"),
    label: zod_1.z.string().trim().min(1, "stat.label is required"),
});
exports.seoSchema = zod_1.z.object({
    metaTitle: zod_1.z.string().optional().default(""),
    metaDescription: zod_1.z.string().optional().default(""),
    ogImageUrl: zod_1.z.string().optional().default(""),
});
exports.createServiceSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1),
    slug: zod_1.z.string().trim().min(1).optional(), // optional -> tự generate từ title
    iconKey: zod_1.z.string().optional().default(""),
    shortDescription: zod_1.z.string().optional().default(""),
    highlights: zod_1.z.array(exports.highlightSchema).optional().default([]),
    stat: exports.statSchema.nullish(), // null | undefined | object
    contentHtml: zod_1.z.string().optional().default(""),
    coverImageUrl: zod_1.z.string().optional().default(""),
    seo: exports.seoSchema.optional().default({ metaTitle: "", metaDescription: "", ogImageUrl: "" }),
    order: zod_1.z.coerce.number().int().default(0),
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.updateServiceSchema = exports.createServiceSchema
    .partial()
    .extend({
    isDeleted: zod_1.z.boolean().optional(), // admin có thể set nếu cần
});
exports.mongoIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Mongo ObjectId"),
});
exports.slugParamSchema = zod_1.z.object({
    slug: zod_1.z.string().trim().min(1),
});
exports.publicListQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
exports.adminListQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
    includeDeleted: zod_1.z
        .union([zod_1.z.literal("true"), zod_1.z.literal("false")])
        .optional()
        .transform((v) => v === "true"),
    isActive: zod_1.z
        .union([zod_1.z.literal("true"), zod_1.z.literal("false")])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === "true")),
});
//# sourceMappingURL=services.schema.js.map