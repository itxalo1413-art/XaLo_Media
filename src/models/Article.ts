import { Schema, model } from "mongoose";

const AiMetaSchema = new Schema(
  {
    provider: { type: String, default: "gemini" },
    model: { type: String, default: "" },
    prompt: { type: String, default: "" },
    topic: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    tone: { type: String, default: "" },
    length: { type: String, default: "" },
    temperature: { type: Number, default: null },
    generatedAt: { type: Date, default: null },
  },
  { _id: false }
);

const SeoSchema = new Schema(
  { metaTitle: { type: String, default: "" }, metaDescription: { type: String, default: "" }, ogImageUrl: { type: String, default: "" } },
  { _id: false }
);

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },

    contentHtml: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    tags: { type: [String], default: [] },
    featuredImageUrl: { type: String, default: "" },

    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: null },
    viewCount: { type: Number, default: 0 },

    source: { type: String, enum: ["manual", "ai"], default: "manual", index: true },
    aiMeta: { type: AiMetaSchema, default: null },

    seo: { type: SeoSchema, default: () => ({}) },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index để tìm kiếm văn bản (Search bar)
ArticleSchema.index({ title: "text", contentHtml: "text" });

// Index riêng cho tags để filter nhanh (Category/Tags list)
ArticleSchema.index({ tags: 1 });

export const Article = model("Article", ArticleSchema);
