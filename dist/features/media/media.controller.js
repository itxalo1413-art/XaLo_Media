"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudinarySignature = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("../../config/env");
const asyncHandler_1 = require("../../utils/asyncHandler");
const response_1 = require("../../utils/response");
exports.getCloudinarySignature = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const folder = String(req.query.folder ?? "xalomedia");
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder };
    const signature = cloudinary_1.v2.utils.api_sign_request(paramsToSign, env_1.env.CLOUDINARY_API_SECRET);
    return (0, response_1.ok)(res, {
        cloudName: env_1.env.CLOUDINARY_CLOUD_NAME,
        apiKey: env_1.env.CLOUDINARY_API_KEY,
        timestamp,
        folder,
        signature,
    });
});
//# sourceMappingURL=media.controller.js.map