import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const isProd = process.env.NODE_ENV === "production";

const apis = isProd
  ? [
      path.resolve(process.cwd(), "dist/features/**/*.route.js"),
      path.resolve(process.cwd(), "dist/src/features/**/*.route.js"),
      path.resolve(process.cwd(), "dist/**/**/*.route.js"),
    ]
  : [path.resolve(process.cwd(), "src/features/**/*.route.ts")];
const serverUrl =
  process.env.SWAGGER_SERVER_URL ??
  (process.env.SWAGGER_PATHS_INCLUDE_API_V1 === "true" ? "/" : "/api/v1");

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "XaLo Media API",
      version: "1.0.0",
      description: "Company website + Services + Blog + AI + Inquiries",
    },
    servers: [{ url: serverUrl }],
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
