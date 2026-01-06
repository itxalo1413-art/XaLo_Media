"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGenerateArticle = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const response_1 = require("../../utils/response");
const ai_schema_1 = require("./ai.schema");
const ai_service_1 = require("./ai.service");
exports.adminGenerateArticle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = ai_schema_1.aiGenerateArticleSchema.parse(req.body);
    const result = await (0, ai_service_1.aiGenerateArticleDraft)(body);
    if ("article" in result) {
        res.status(201);
        return (0, response_1.ok)(res, { article: result.article });
    }
    return (0, response_1.ok)(res, { draft: result.draft });
});
//# sourceMappingURL=ai.controller.js.map