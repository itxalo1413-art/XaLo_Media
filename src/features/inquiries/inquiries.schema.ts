import { z } from "zod";
import { INQUIRY_BUDGETS, INQUIRY_SERVICES } from "../../models/Inquiry";

const serviceEnum = z.enum(INQUIRY_SERVICES);
const budgetEnum = z.enum(INQUIRY_BUDGETS);

export const createInquiryBodySchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(200).optional().default(""),

  interestedServices: z.array(serviceEnum).optional().default([]),
  budgetRange: budgetEnum.optional().or(z.literal("")).default(""),
  message: z.string().trim().max(3000).optional().default(""),

  // Đã xóa dòng consent: z.literal(true)
  source: z.string().trim().max(100).optional().default("website_form"),
});

export const adminListInquiryQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.enum(["new", "contacted", "qualified", "closed", "spam"]).optional(),
  source: z.string().trim().optional(),

  // nếu muốn xem cả deleted -> ?includeDeleted=true
  includeDeleted: z
    .preprocess((v) => {
      if (v === undefined) return false;
      if (typeof v === "string") return v === "true" || v === "1";
      return Boolean(v);
    }, z.boolean())
    .optional()
    .default(false),

  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: z.string().trim().optional().default("-createdAt"),
});

export const adminUpdateInquiryBodySchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "closed", "spam"]).optional(),
  note: z.string().trim().max(2000).optional(),
  handledAt: z.coerce.date().nullable().optional(),
});