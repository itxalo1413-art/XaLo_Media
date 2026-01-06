"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const error_1 = require("./middlewares/error");
const auth_route_1 = __importDefault(require("./features/auth/auth.route"));
const requestId_1 = require("./middlewares/requestId");
const requestLogger_1 = require("./middlewares/requestLogger");
// import companyRoutes from "./features/company/company.route";
const services_public_route_1 = require("./features/services/services.public.route");
const services_admin_route_1 = require("./features/services/services.admin.route");
const articles_public_route_1 = require("./features/articles/articles.public.route");
const articles_admin_route_1 = require("./features/articles/articles.admin.route");
// import inquiriesPublicRoutes from "./features/inquiries/inquiries.public.route";
// import inquiriesAdminRoutes from "./features/inquiries/inquiries.admin.route";
const media_route_1 = require("./features/media/media.route");
const ai_route_1 = __importDefault(require("./features/ai/ai.route"));
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.use(requestId_1.requestId);
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: "2mb" }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
    app.use(requestLogger_1.requestLogger);
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    // auth + public
    app.use("/api/v1/auth", auth_route_1.default);
    // app.use("/api/v1/company", companyRoutes);
    app.use("/api/v1/services", services_public_route_1.servicesPublicRouter);
    app.use("/api/v1/articles", articles_public_route_1.articlesPublicRouter);
    // app.use("/api/v1/inquiries", inquiriesPublicRoutes);
    // // admin
    app.use("/api/v1/admin/services", services_admin_route_1.servicesAdminRouter);
    app.use("/api/v1/admin/articles", articles_admin_route_1.articlesAdminRouter);
    // app.use("/api/v1/admin/inquiries", inquiriesAdminRoutes);
    // // tools
    app.use("/api/v1/media", media_route_1.mediaRouter);
    app.use("/api/v1/ai", ai_route_1.default);
    app.use(error_1.errorMiddleware);
    return app;
}
//# sourceMappingURL=app.js.map