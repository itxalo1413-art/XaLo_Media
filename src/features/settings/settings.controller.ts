import type { Request, Response } from "express";
import { Setting } from "../../models/Setting";
import { updateSettingsSchema } from "./settings.schema";

const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * PUBLIC/ADMIN: GET /api/v1/settings
 * Get global settings (singleton)
 */
export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  // Find the singleton setting document
  let settings = await Setting.findOne({ key: "general" }).lean();

  // If not exists, create default
  if (!settings) {
    settings = await Setting.create({ key: "general" });
  }

  return res.json({
    success: true,
    data: settings,
  });
});

/**
 * ADMIN: PATCH /api/v1/admin/settings
 * Update global settings
 */
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateSettingsSchema.parse(req.body);

  const settings = await Setting.findOneAndUpdate(
    { key: "general" },
    { ...payload },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return res.json({
    success: true,
    data: settings,
  });
});
