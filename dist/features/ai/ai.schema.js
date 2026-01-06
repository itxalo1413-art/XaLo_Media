"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiGenerateArticleSchema = void 0;
const zod_1 = require("zod");
exports.aiGenerateArticleSchema = zod_1.z.object({
    topic: zod_1.z.string().min(3),
    keywords: zod_1.z.array(zod_1.z.string().min(1)).default([]),
    tags: zod_1.z.array(zod_1.z.string().min(1)).default([]),
    tone: zod_1.z.string().default("professional"),
    length: zod_1.z.string().default("medium"),
    language: zod_1.z.string().default("vi"),
    featuredImageUrl: zod_1.z.string().url().optional(),
    // true = lưu draft vào DB
    createDraft: zod_1.z.boolean().default(true),
});
//# sourceMappingURL=ai.schema.js.map