import { Router } from "express";
import {
  getRecruitment,
  getRecruitmentById,
} from "./recruitment.controller";

export const recruitmentPublicRoutes = Router();

recruitmentPublicRoutes.get("/", getRecruitment);  // Danh sách công việc tuyển dụng
recruitmentPublicRoutes.get("/:id", getRecruitmentById);

