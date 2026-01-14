import { Router } from "express";
import {
  createRecruitment,
  updateRecruitment,
  deleteRecruitment,
  getRecruitment,
  getRecruitmentById,
} from "./recruitment.controller";
import { requireAdmin } from "../../middlewares/auth";

export const recruitmentAdminRoutes = Router();

recruitmentAdminRoutes.use(requireAdmin);

recruitmentAdminRoutes.get("/", getRecruitment);
recruitmentAdminRoutes.get("/:id", getRecruitmentById);
recruitmentAdminRoutes.post("/", createRecruitment);
recruitmentAdminRoutes.patch("/:id", updateRecruitment);
recruitmentAdminRoutes.delete("/:id", deleteRecruitment);

