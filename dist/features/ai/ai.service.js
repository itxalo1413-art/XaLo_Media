"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiGenerateArticleDraft = aiGenerateArticleDraft;
const slugify_1 = __importDefault(require("slugify"));
const env_1 = require("../../config/env");
const Article_1 = require("../../models/Article");
function normalizeSlug(input) {
    return (0, slugify_1.default)(input, { lower: true, strict: true, trim: true });
}
async function uniqueSlug(base) {
    let slug = normalizeSlug(base) || `article-${Date.now()}`;
    let i = 2;
    while (await Article_1.Article.exists({ slug, isDeleted: false })) {
        slug = `${normalizeSlug(base)}-${i++}`;
        if (i > 30)
            slug = `${normalizeSlug(base)}-${Date.now()}`;
    }
    return slug;
}
function extractText(resp) {
    if (!resp)
        return "";
    if (typeof resp.text === "string")
        return resp.text;
    const parts = resp.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts))
        return parts.map((p) => p?.text ?? "").join("");
    return "";
}
async function generateJson(prompt) {
    // Dùng SDK @google/genai (bạn đang có dependency)
    const { GoogleGenAI } = await Promise.resolve().then(() => __importStar(require("@google/genai")));
    const gemini = new GoogleGenAI({ apiKey: env_1.env.GEMINI_API_KEY });
    const resp = await gemini.models.generateContent({
        model: env_1.env.GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            temperature: env_1.env.GEMINI_TEMPERATURE,
            responseMimeType: "application/json",
        },
    });
    const raw = extractText(resp).trim();
    const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
    try {
        return JSON.parse(cleaned);
    }
    catch {
        const s = cleaned.indexOf("{");
        const e = cleaned.lastIndexOf("}");
        if (s >= 0 && e > s)
            return JSON.parse(cleaned.slice(s, e + 1));
        throw new Error("AI response is not valid JSON");
    }
}
function buildArticlePrompt(input) {
    const { topic, keywords, tags, tone, length, language } = input;
    return `
Bạn là senior content writer của XaLo Media.
Hãy tạo 1 bài blog theo yêu cầu và trả về DUY NHẤT JSON (không markdown, không giải thích).

Yêu cầu:
- Ngôn ngữ: ${language}
- Chủ đề: ${topic}
- Keywords: ${keywords.join(", ")}
- Tags gợi ý: ${tags.join(", ")}
- Tone: ${tone}
- Độ dài: ${length}
- Output phải có HTML hợp lệ trong contentHtml:
  - Có H2/H3
  - Có bullet list + checklist (ul/li)
  - Có đoạn mở bài, thân bài, kết luận + CTA nhẹ (liên hệ XaLo Media)
  - Không chèn link ngoài. Không bịa số liệu chắc chắn nếu không có nguồn.
- excerpt tối đa ~160 ký tự
- seo.metaTitle tối đa ~60 ký tự, seo.metaDescription tối đa ~160 ký tự

Schema JSON bắt buộc:
{
  "title": "string",
  "excerpt": "string",
  "tags": ["string"],
  "contentHtml": "string",
  "seo": {
    "metaTitle": "string",
    "metaDescription": "string",
    "ogImageUrl": "string (optional)"
  }
}
`.trim();
}
async function aiGenerateArticleDraft(input) {
    const prompt = buildArticlePrompt(input);
    const ai = await generateJson(prompt);
    const title = (ai.title || input.topic).trim();
    const slug = await uniqueSlug(title);
    const draft = {
        title,
        slug,
        contentHtml: (ai.contentHtml ?? "").trim(),
        excerpt: (ai.excerpt ?? "").trim(),
        tags: Array.isArray(ai.tags) && ai.tags.length ? ai.tags : input.tags,
        featuredImageUrl: input.featuredImageUrl ?? "",
        status: "draft",
        publishedAt: null,
        viewCount: 0,
        source: "ai",
        aiMeta: {
            provider: "gemini",
            model: env_1.env.GEMINI_MODEL,
            prompt,
            topic: input.topic,
            keywords: input.keywords,
            tone: input.tone,
            length: input.length,
            temperature: env_1.env.GEMINI_TEMPERATURE,
            generatedAt: new Date(),
        },
        seo: {
            metaTitle: ai.seo?.metaTitle ?? title,
            metaDescription: ai.seo?.metaDescription ?? (ai.excerpt ?? ""),
            ogImageUrl: ai.seo?.ogImageUrl ?? input.featuredImageUrl ?? "",
        },
        isDeleted: false,
    };
    if (!input.createDraft)
        return { draft };
    const doc = await Article_1.Article.create(draft);
    return { article: doc };
}
//# sourceMappingURL=ai.service.js.map