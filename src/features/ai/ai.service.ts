import slugify from "slugify";
import { env } from "../../config/env";
import { Article } from "../../models/Article";

type AiArticleJson = {
  title: string;
  excerpt: string;
  tags: string[];
  contentHtml: string;
  seo: { metaTitle: string; metaDescription: string; ogImageUrl?: string };
};

function normalizeSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

async function uniqueSlug(base: string) {
  let slug = normalizeSlug(base) || `article-${Date.now()}`;
  let i = 2;

  while (await Article.exists({ slug, isDeleted: false })) {
    slug = `${normalizeSlug(base)}-${i++}`;
    if (i > 30) slug = `${normalizeSlug(base)}-${Date.now()}`;
  }

  return slug;
}

function extractText(resp: any): string {
  if (!resp) return "";
  if (typeof resp.text === "string") return resp.text;

  const parts = resp.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) return parts.map((p: any) => p?.text ?? "").join("");

  return "";
}

async function generateJson<T>(prompt: string): Promise<T> {
  // Dùng SDK @google/genai (bạn đang có dependency)
  const { GoogleGenAI } = await import("@google/genai");
  const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  const resp = await gemini.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      temperature: env.GEMINI_TEMPERATURE,
      responseMimeType: "application/json",
    } as any,
  });

  const raw = extractText(resp).trim();
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const s = cleaned.indexOf("{");
    const e = cleaned.lastIndexOf("}");
    if (s >= 0 && e > s) return JSON.parse(cleaned.slice(s, e + 1)) as T;
    throw new Error("AI response is not valid JSON");
  }
}

function buildArticlePrompt(input: {
  topic: string;
  keywords: string[];
  tags: string[];
  tone: string;
  length: string;
  language: string;
}) {
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

export async function aiGenerateArticleDraft(input: {
  topic: string;
  keywords: string[];
  tags: string[];
  tone: string;
  length: string;
  language: string;
  featuredImageUrl?: string;
  createDraft: boolean;
}) {
  const prompt = buildArticlePrompt(input);
  const ai = await generateJson<AiArticleJson>(prompt);

  const title = (ai.title || input.topic).trim();
  const slug = await uniqueSlug(title);

  const draft = {
    title,
    slug,
    contentHtml: (ai.contentHtml ?? "").trim(),
    excerpt: (ai.excerpt ?? "").trim(),
    tags: Array.isArray(ai.tags) && ai.tags.length ? ai.tags : input.tags,
    featuredImageUrl: input.featuredImageUrl ?? "",

    status: "draft" as const,
    publishedAt: null,
    viewCount: 0,

    source: "ai" as const,
    aiMeta: {
      provider: "gemini",
      model: env.GEMINI_MODEL,
      prompt,
      topic: input.topic,
      keywords: input.keywords,
      tone: input.tone,
      length: input.length,
      temperature: env.GEMINI_TEMPERATURE,
      generatedAt: new Date(),
    },

    seo: {
      metaTitle: ai.seo?.metaTitle ?? title,
      metaDescription: ai.seo?.metaDescription ?? (ai.excerpt ?? ""),
      ogImageUrl: ai.seo?.ogImageUrl ?? input.featuredImageUrl ?? "",
    },

    isDeleted: false,
  };

  if (!input.createDraft) return { draft };

  const doc = await Article.create(draft);
  return { article: doc };
}
