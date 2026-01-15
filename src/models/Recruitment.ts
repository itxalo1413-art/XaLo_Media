import { Schema, model, models } from "mongoose";

const RecruitmentSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    salaryRange: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    department: { type: String, required: false }, // Optional
    deadline: { type: Date, required: false },     // Optional
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Recruitment = models.Recruitment || model("Recruitment", RecruitmentSchema);
