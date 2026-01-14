import { z } from "zod";

export const recruitmentValidationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  jobType: z.string().min(3, "Job type is required"), 
  salaryRange: z.string().min(3, "Salary range is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  department: z.string().optional(),
  deadline: z.union([z.string(), z.date()]).optional().transform((val) => val === "" ? undefined : val), 
  isActive: z.boolean().optional(),
});
