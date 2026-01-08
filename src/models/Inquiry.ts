import { Schema, model, models } from "mongoose";

export const INQUIRY_SERVICES = [
  "Influencer Marketing",
  "Livestream Services",
  "Content Creation",
  "TikTok Management",
  "Talent Booking",
  "Brand Partnership",
] as const;

export const INQUIRY_BUDGETS = [
  "Dưới 50 triệu",
  "50 - 100 triệu",
  "100 - 500 triệu",
  "Trên 500 triệu",
] as const;

const InquirySchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, default: "", trim: true },

    interestedServices: { type: [String], default: [] },
    budgetRange: { type: String, default: "" },
    message: { type: String, default: "", trim: true },

    consent: { type: Boolean, required: true },

    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "closed", "spam"],
      default: "new",
      index: true,
    },
    source: { type: String, default: "website_form", index: true },

    // soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },

    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },

    note: { type: String, default: "" },
    handledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ isDeleted: 1, createdAt: -1 });
InquirySchema.index({ email: 1, phone: 1 });

export const Inquiry = models.Inquiry || model("Inquiry", InquirySchema);
