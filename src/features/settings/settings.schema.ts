import { z } from "zod";

export const updateSettingsSchema = z.object({
  siteName: z.string().trim().optional(),
  siteDescription: z.string().trim().optional(),

  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  workingHours: z.string().trim().optional(),
  mapUrl: z.string().trim().optional(),

  facebook: z.string().trim().optional(),
  zalo: z.string().trim().optional(),
  tiktok: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  instagram: z.string().trim().optional(),

  defaultMetaTitle: z.string().trim().optional(),
  defaultMetaDescription: z.string().trim().optional(),
  defaultOgImage: z.string().trim().optional(),

  popupActive: z.boolean().optional(),
  popupImageUrl: z.string().trim().optional(),
  popupLinkUrl: z.string().trim().optional(),
});
