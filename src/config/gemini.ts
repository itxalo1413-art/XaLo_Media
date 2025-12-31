// src/config/gemini.ts
import { GoogleGenAI } from "@google/genai";
import { env } from "./env";

export const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

function extractText(resp: any): string {
  // SDK có thể trả nhiều shape khác nhau -> cố gắng lấy text robust
  if (!resp) return "";
  if (typeof resp.text === "string") return resp.text;

  // candidate[0].content.parts[].text
  const parts = resp.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    return parts.map((p: any) => p?.text ?? "").join("");
  }

  // fallback
  return "";
}

export async function generateText(prompt: string): Promise<string> {
  const resp = await gemini.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      temperature: env.GEMINI_TEMPERATURE,
    },
  });

  return extractText(resp).trim();
}

export async function generateJson<T>(prompt: string): Promise<T> {
  // Cố gắng “gợi ý” SDK trả JSON (nếu SDK hỗ trợ)
  // Nếu không hỗ trợ, vẫn parse từ text.
  const resp = await gemini.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      temperature: env.GEMINI_TEMPERATURE,
      responseMimeType: "application/json", // SDK hỗ trợ thì sẽ chuẩn hơn
    } as any,
  });

  const raw = extractText(resp).trim();

  // Nhiều khi AI bọc ```json ... ```
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // fallback: tìm JSON block đầu tiên
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error("AI response is not valid JSON");
  }
}
