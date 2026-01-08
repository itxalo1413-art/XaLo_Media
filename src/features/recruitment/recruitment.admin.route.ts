import { Router } from "express";
import {
  createRecruitment,
  updateRecruitment,
  deleteRecruitment,
} from "./recruitment.controller";
import { requireAdmin } from "../../middlewares/auth";

export const recruitmentAdminRoutes = Router();

recruitmentAdminRoutes.use(requireAdmin);

recruitmentAdminRoutes.post("/", createRecruitment);
recruitmentAdminRoutes.patch("/:id", updateRecruitment);
recruitmentAdminRoutes.delete("/:id", deleteRecruitment);

