"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const isProd = process.env.NODE_ENV === "production";
const apis = isProd
    ? [path_1.default.resolve(__dirname, "../features/**/*.route.js")]
    : [path_1.default.resolve(process.cwd(), "src/features/**/*.route.ts")];
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "XaLo Media API",
            version: "1.0.0",
            description: "Company website + Services + Blog + AI + Inquiries",
        },
        servers: [{ url: process.env.SWAGGER_SERVER_URL ?? "/api/v1" }],
        tags: [
            { name: "Auth" },
            { name: "Company" },
            { name: "Services" },
            { name: "Articles" },
            { name: "Inquiries" },
            { name: "Media" },
            { name: "AI" },
            { name: "Admin" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            },
            schemas: {
                ApiResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        data: {},
                        meta: {},
                    },
                },
                ApiError: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        error: {
                            type: "object",
                            properties: {
                                code: { type: "string", example: "UNAUTHORIZED" },
                                message: { type: "string", example: "Invalid token" },
                                details: {},
                            },
                        },
                    },
                },
            },
        },
    },
    apis,
});
//# sourceMappingURL=swagger.js.map