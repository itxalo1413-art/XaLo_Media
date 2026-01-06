"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inquiry = void 0;
const mongoose_1 = require("mongoose");
const InquirySchema = new mongoose_1.Schema({
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, default: "", trim: true },
    interestedServices: { type: [String], default: [] },
    budgetRange: { type: String, default: "" },
    message: { type: String, default: "" },
    consent: { type: Boolean, required: true },
    status: { type: String, enum: ["new", "contacted", "qualified", "closed", "spam"], default: "new", index: true },
    source: { type: String, default: "website_form", index: true },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    note: { type: String, default: "" },
    handledAt: { type: Date, default: null },
}, { timestamps: true });
InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ email: 1, phone: 1 });
exports.Inquiry = (0, mongoose_1.model)("Inquiry", InquirySchema);
//# sourceMappingURL=Inquiry.js.map