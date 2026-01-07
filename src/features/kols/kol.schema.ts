import { z } from "zod";

export const kolCreateSchema = z.object({
  slug: z.string().min(1).optional(),

  name: z.string().min(1),
  niche: z.string().min(1),
  img: z.string().url(),

  rating: z.coerce.number().min(0).max(5).optional(),

  followers: z.string().optional(),
  engagement: z.string().optional(),
  views: z.string().optional(),
  success: z.string().optional(),

  platforms: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),

  description: z.string().optional(),

  order: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const kolUpdateSchema = kolCreateSchema.partial();

export const kolListQuerySchema = z.object({
  q: z.string().optional(),
  niche: z.string().optional(),
  tag: z.string().optional(),
  platform: z.string().optional(),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),

  sort: z
    .enum(["order", "-order", "rating", "-rating", "newest", "oldest"])
    .default("order"),
});
