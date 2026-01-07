import { Schema, model, type InferSchemaType } from "mongoose";

const KolSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },

    name: { type: String, required: true, trim: true },
    niche: { type: String, required: true, trim: true },
    img: { type: String, required: true, trim: true },

    // store numeric for sort/filter; accept string via z.coerce in schema
    rating: { type: Number, default: 0, min: 0, max: 5 },

    followers: { type: String, default: "", trim: true },   // "750K"
    engagement: { type: String, default: "", trim: true },  // "10%"
    views: { type: String, default: "", trim: true },       // "800K"
    success: { type: String, default: "", trim: true },     // "98%"

    platforms: { type: [String], default: [] }, // ["youtube","tiktok",...]
    tags: { type: [String], default: [] },

    description: { type: String, default: "" },

    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Search
KolSchema.index({ name: "text", niche: "text", tags: "text", description: "text" });

export type Kol = InferSchemaType<typeof KolSchema>;
export const KolModel = model("Kol", KolSchema);
