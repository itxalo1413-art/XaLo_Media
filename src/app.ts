import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { errorMiddleware } from "./middlewares/error";

import authRoutes from "./features/auth/auth.route";
import { requestId } from "./middlewares/requestId";
import { requestLogger } from "./middlewares/requestLogger";
// import companyRoutes from "./features/company/company.route";
import { servicesPublicRouter } from "./features/services/services.public.route";
import { servicesAdminRouter } from "./features/services/services.admin.route";
import {articlesPublicRouter} from "./features/articles/articles.public.route";
import {articlesAdminRouter} from "./features/articles/articles.admin.route";
// import inquiriesPublicRoutes from "./features/inquiries/inquiries.public.route";
// import inquiriesAdminRoutes from "./features/inquiries/inquiries.admin.route";
import { mediaRouter } from "./features/media/media.route";
import aiRoutes from "./features/ai/ai.route";


export function createApp() {
  const app = express();

  app.use(requestId);
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(requestLogger);

  
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


  // auth + public
  app.use("/api/v1/auth", authRoutes);
  // app.use("/api/v1/company", companyRoutes);
  app.use("/api/v1/services", servicesPublicRouter);
  app.use("/api/v1/articles", articlesPublicRouter);
  // app.use("/api/v1/inquiries", inquiriesPublicRoutes);

  // // admin
  app.use("/api/v1/admin/services", servicesAdminRouter);
  app.use("/api/v1/admin/articles", articlesAdminRouter);
  // app.use("/api/v1/admin/inquiries", inquiriesAdminRoutes);

  // // tools
  app.use("/api/v1/media", mediaRouter);
  app.use("/api/v1/ai", aiRoutes);

  app.use(errorMiddleware);
  return app;
}
