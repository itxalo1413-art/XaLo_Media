"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gemini = void 0;
exports.generateText = generateText;
exports.generateJson = generateJson;
// src/config/gemini.ts
const genai_1 = require("@google/genai");
const env_1 = require("./env");
exports.gemini = new genai_1.GoogleGenAI({ apiKey: env_1.env.GEMINI_API_KEY });
function extractText(resp) {
    // SDK có thể trả nhiều shape khác nhau -> cố gắng lấy text robust
    if (!resp)
        return "";
    if (typeof resp.text === "string")
        return resp.text;
    // candidate[0].content.parts[].text
    const parts = resp.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
        return parts.map((p) => p?.text ?? "").join("");
    }
    // fallback
    return "";
}
async function generateText(prompt) {
    const resp = await exports.gemini.models.generateContent({
        model: env_1.env.GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            temperature: env_1.env.GEMINI_TEMPERATURE,
        },
    });
    return extractText(resp).trim();
}
async function generateJson(prompt) {
    // Cố gắng “gợi ý” SDK trả JSON (nếu SDK hỗ trợ)
    // Nếu không hỗ trợ, vẫn parse từ text.
    const resp = await exports.gemini.models.generateContent({
        model: env_1.env.GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            temperature: env_1.env.GEMINI_TEMPERATURE,
            responseMimeType: "application/json", // SDK hỗ trợ thì sẽ chuẩn hơn
        },
    });
    const raw = extractText(resp).trim();
    // Nhiều khi AI bọc ```json ... ```
    const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
    try {
        return JSON.parse(cleaned);
    }
    catch {
        // fallback: tìm JSON block đầu tiên
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return JSON.parse(cleaned.slice(start, end + 1));
        }
        throw new Error("AI response is not valid JSON");
    }
}
//# sourceMappingURL=gemini.js.map