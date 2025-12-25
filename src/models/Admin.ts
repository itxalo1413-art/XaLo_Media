import { Schema, model } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    refreshTokenHash: { type: String, default: null },
  },
  { timestamps: true }
);

export const Admin = model("Admin", AdminSchema);
