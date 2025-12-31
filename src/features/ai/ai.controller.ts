import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";
import { aiGenerateArticleSchema } from "./ai.schema";
import { aiGenerateArticleDraft } from "./ai.service";

export const adminGenerateArticle = asyncHandler(async (req: Request, res: Response) => {
  const body = aiGenerateArticleSchema.parse(req.body);

  const result = await aiGenerateArticleDraft(body);

  if ("article" in result) {
    res.status(201);
    return ok(res, { article: result.article });
  }

  return ok(res, { draft: result.draft });
});
