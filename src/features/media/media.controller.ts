import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/response";

export const getCloudinarySignature = asyncHandler(async (req: Request, res: Response) => {
  const folder = String(req.query.folder ?? "xalomedia");
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, any> = { timestamp, folder };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, env.CLOUDINARY_API_SECRET);

  return ok(res, {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
});
