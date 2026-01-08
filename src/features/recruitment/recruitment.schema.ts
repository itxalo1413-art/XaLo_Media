import { z } from "zod";

export const recruitmentValidationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  jobType: z.string().min(3, "Job type is required"), // Toàn thời gian, bán thời gian, remote...
  salaryRange: z.string().min(3, "Salary range is required"), // e.g. "15 - 25 triệu"
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
  benefits: z.array(z.string()).min(1, "At least one benefit is needed"),
});
