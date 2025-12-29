import { z } from "zod";

export const highlightSchema = z.object({
  text: z.string().trim().min(1, "highlight.text is required"),
  order: z.coerce.number().int().min(0).default(0),
});

export const statSchema = z.object({
  value: z.string().trim().min(1, "stat.value is required"),
  label: z.string().trim().min(1, "stat.label is required"),
});

export const seoSchema = z.object({
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  ogImageUrl: z.string().optional().default(""),
});

export const createServiceSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).optional(), // optional -> tự generate từ title
  iconKey: z.string().optional().default(""),
  shortDescription: z.string().optional().default(""),

  highlights: z.array(highlightSchema).optional().default([]),
  stat: statSchema.nullish(), // null | undefined | object

  contentHtml: z.string().optional().default(""),
  coverImageUrl: z.string().optional().default(""),

  seo: seoSchema.optional().default({ metaTitle: "", metaDescription: "", ogImageUrl: "" }),

  order: z.coerce.number().int().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateServiceSchema = createServiceSchema
  .partial()
  .extend({
    isDeleted: z.boolean().optional(), // admin có thể set nếu cần
  });

export const mongoIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Mongo ObjectId"),
});

export const slugParamSchema = z.object({
  slug: z.string().trim().min(1),
});

export const publicListQuerySchema = z.object({
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const adminListQuerySchema = z.object({
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),

  includeDeleted: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "true"),

  isActive: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});
