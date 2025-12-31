import { z } from "zod";

export const aiGenerateArticleSchema = z.object({
  topic: z.string().min(3),

  keywords: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),

  tone: z.string().default("professional"),
  length: z.string().default("medium"),
  language: z.string().default("vi"),

  featuredImageUrl: z.string().url().optional(),

  // true = lưu draft vào DB
  createDraft: z.boolean().default(true),
});

export type AiGenerateArticleInput = z.infer<typeof aiGenerateArticleSchema>;
