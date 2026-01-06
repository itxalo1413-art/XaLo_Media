"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const HighlightSchema = new mongoose_1.Schema({ text: { type: String, required: true }, order: { type: Number, default: 0 } }, { _id: false });
const StatSchema = new mongoose_1.Schema({ value: { type: String, required: true }, label: { type: String, required: true } }, { _id: false });
const SeoSchema = new mongoose_1.Schema({ metaTitle: { type: String, default: "" }, metaDescription: { type: String, default: "" }, ogImageUrl: { type: String, default: "" } }, { _id: false });
const ServiceSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    iconKey: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    highlights: { type: [HighlightSchema], default: [] },
    stat: { type: StatSchema, default: null },
    contentHtml: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    seo: { type: SeoSchema, default: () => ({}) },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
ServiceSchema.index({ title: "text", shortDescription: "text", "highlights.text": "text" });
exports.Service = (0, mongoose_1.model)("Service", ServiceSchema);
//# sourceMappingURL=Service.js.map