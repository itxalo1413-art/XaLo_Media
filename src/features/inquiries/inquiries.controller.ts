import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Inquiry } from "../../models/Inquiry";
import {
  adminListInquiryQuerySchema,
  adminUpdateInquiryBodySchema,
  createInquiryBodySchema,
} from "./inquiries.schema";

const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePhone(phone: string) {
  return phone.replace(/[\s.-]/g, "").trim();
}

function getClientIp(req: Request) {
  const xff = (req.headers["x-forwarded-for"] as string) || "";
  return xff.split(",")[0]?.trim() || req.ip || "";
}

/**
 * PUBLIC: POST /api/v1/inquiries
 */
export const createInquiryPublic = asyncHandler(async (req: Request, res: Response) => {
  const body = createInquiryBodySchema.parse(req.body);

  const doc = await Inquiry.create({
    ...body,
    phone: normalizePhone(body.phone),
    status: "new",
    isDeleted: false,
    deletedAt: null,
    ip: getClientIp(req),
    userAgent: req.headers["user-agent"] || "",
  });

  return res.status(201).json({
    success: true,
    data: { id: doc._id, status: doc.status, createdAt: doc.createdAt },
  });
});

/**
 * ADMIN: GET /api/v1/admin/inquiries
 */
export const listInquiriesAdmin = asyncHandler(async (req: Request, res: Response) => {
  const q = adminListInquiryQuerySchema.parse(req.query);

  const filter: any = {};
  if (q.status) filter.status = q.status;
  if (q.source) filter.source = q.source;

  // mặc định không show item đã xoá
  if (!q.includeDeleted) filter.isDeleted = { $ne: true };

  if (q.q) {
    const regex = new RegExp(escapeRegex(q.q), "i");
    filter.$or = [
      { fullName: regex },
      { phone: regex },
      { email: regex },
      { company: regex },
      { message: regex },
    ];
  }

  const skip = (q.page - 1) * q.limit;

  const [items, total] = await Promise.all([
    Inquiry.find(filter).sort(q.sort).skip(skip).limit(q.limit).lean(),
    Inquiry.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: {
      items,
      pagination: {
        page: q.page,
        limit: q.limit,
        total,
        totalPages: Math.ceil(total / q.limit),
      },
    },
  });
});

/**
 * ADMIN: GET /api/v1/admin/inquiries/:id
 * (trả cả item deleted để admin có thể restore nếu cần)
 */
export const getInquiryAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_ID", message: "Invalid inquiry id" },
    });
  }

  const doc = await Inquiry.findById(id).lean();
  if (!doc) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Inquiry not found" },
    });
  }

  return res.json({ success: true, data: doc });
});

/**
 * ADMIN: PATCH /api/v1/admin/inquiries/:id
 * (không cho update nếu đã deleted)
 */
export const updateInquiryAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_ID", message: "Invalid inquiry id" },
    });
  }

  const payload = adminUpdateInquiryBodySchema.parse(req.body);

  const existing = await Inquiry.findById(id).select("isDeleted").lean();
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Inquiry not found" },
    });
  }
  if (existing.isDeleted) {
    return res.status(409).json({
      success: false,
      error: { code: "DELETED", message: "Inquiry is deleted. Restore first." },
    });
  }

  const update: any = { ...payload };

  if (payload.status && payload.status !== "new" && payload.handledAt === undefined) {
    update.handledAt = new Date();
  }

  const doc = await Inquiry.findByIdAndUpdate(id, update, { new: true }).lean();

  return res.json({ success: true, data: doc });
});

/**
 * ADMIN: DELETE /api/v1/admin/inquiries/:id
 * Soft delete (idempotent)
 */
export const deleteInquiryAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_ID", message: "Invalid inquiry id" },
    });
  }

  // nếu chưa delete -> set deleted
  const updated = await Inquiry.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } }, // false/undefined -> set true
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  ).lean();

  if (updated) {
    return res.json({
      success: true,
      data: { id: updated._id, isDeleted: updated.isDeleted, deletedAt: updated.deletedAt },
    });
  }

  // nếu không update được: hoặc đã deleted, hoặc không tồn tại
  const existing = await Inquiry.findById(id).select("isDeleted deletedAt").lean();
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Inquiry not found" },
    });
  }

  // đã deleted rồi -> trả về trạng thái hiện tại
  return res.json({
    success: true,
    data: { id, isDeleted: existing.isDeleted, deletedAt: existing.deletedAt },
  });
});

/**
 * ADMIN: POST /api/v1/admin/inquiries/:id/restore
 * Restore (idempotent)
 */
export const restoreInquiryAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_ID", message: "Invalid inquiry id" },
    });
  }

  const updated = await Inquiry.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: false } }, // true/undefined -> set false
    { isDeleted: false, deletedAt: null },
    { new: true }
  ).lean();

  if (updated) {
    return res.json({
      success: true,
      data: { id: updated._id, isDeleted: updated.isDeleted, deletedAt: updated.deletedAt },
    });
  }

  const existing = await Inquiry.findById(id).select("isDeleted deletedAt").lean();
  if (!existing) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Inquiry not found" },
    });
  }

  return res.json({
    success: true,
    data: { id, isDeleted: existing.isDeleted, deletedAt: existing.deletedAt },
  });
});
