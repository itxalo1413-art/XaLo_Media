import { Schema, model, models } from "mongoose";

const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "general" }, // Singleton key
    siteName: { type: String, default: "Xalo Media" },
    siteDescription: { type: String, default: "" },

    // Contact Info
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    workingHours: { type: String, default: "" },
    mapUrl: { type: String, default: "" }, // Google Maps embed URL

    // Social Links
    facebook: { type: String, default: "" },
    zalo: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    youtube: { type: String, default: "" },
    instagram: { type: String, default: "" },

    // SEO Defaults
    defaultMetaTitle: { type: String, default: "" },
    defaultMetaDescription: { type: String, default: "" },
    defaultOgImage: { type: String, default: "" },

    // Popup Configuration
    popupActive: { type: Boolean, default: false },
    popupImageUrl: { type: String, default: "" },
    popupLinkUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Setting = models.Setting || model("Setting", SettingSchema);
