import { Schema, model } from "mongoose";

const HighlightSchema = new Schema(
  { text: { type: String, required: true }, order: { type: Number, default: 0 } },
  { _id: false }
);

const StatSchema = new Schema(
  { value: { type: String, required: true }, label: { type: String, required: true } },
  { _id: false }
);

const SeoSchema = new Schema(
  { metaTitle: { type: String, default: "" }, metaDescription: { type: String, default: "" }, ogImageUrl: { type: String, default: "" } },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

ServiceSchema.index({ title: "text", shortDescription: "text", "highlights.text": "text" });

export const Service = model("Service", ServiceSchema);
