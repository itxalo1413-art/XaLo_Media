import { Router } from "express";
import { deleteInquiryAdmin, getInquiryAdmin, listInquiriesAdmin, restoreInquiryAdmin, updateInquiryAdmin } from "./inquiries.controller";

import { requireAdmin } from "../../middlewares/auth";

export const inquiriesAdminRoutes = Router();

inquiriesAdminRoutes.use(requireAdmin);

inquiriesAdminRoutes.get("/", listInquiriesAdmin);
inquiriesAdminRoutes.get("/:id", getInquiryAdmin);
inquiriesAdminRoutes.patch("/:id", updateInquiryAdmin);
inquiriesAdminRoutes.delete("/:id", deleteInquiryAdmin);
inquiriesAdminRoutes.post("/:id/restore", restoreInquiryAdmin);

