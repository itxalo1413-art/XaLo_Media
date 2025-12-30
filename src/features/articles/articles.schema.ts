import { z } from "zod";

const mongoId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid mongo id");

export const mongoIdParamSchema = z.object({ id: mongoId });
export const slugParamSchema = z.object({ slug: z.string().min(1) });

export const publicListQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const adminListQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  status: z.enum(["draft", "published"]).optional(),
  source: z.enum(["manual", "ai"]).optional(),
  includeDeleted: z.coerce.boolean().default(false),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const seoSchema = z
  .object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    ogImageUrl: z.string().optional(),
  })
  .optional();

const aiMetaSchema = z
  .object({
    provider: z.string().optional(),
    model: z.string().optional(),
    prompt: z.string().optional(),
    topic: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    tone: z.string().optional(),
    length: z.string().optional(),
    temperature: z.number().optional(),
    generatedAt: z.coerce.date().optional(),
  })
  .optional()
  .nullable();

export const createArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  contentHtml: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredImageUrl: z.string().optional(),

  status: z.enum(["draft", "published"]).optional(),
  publishedAt: z.coerce.date().optional().nullable(),

  source: z.enum(["manual", "ai"]).optional(),
  aiMeta: aiMetaSchema,

  seo: seoSchema,
});

export const updateArticleSchema = createArticleSchema.partial();
