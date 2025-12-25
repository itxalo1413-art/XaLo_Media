import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "XaLo Media API",
      version: "1.0.0",
      description: "Company website + Services + Blog + AI + Inquiries",
    },
    servers: [{ url: "/api/v1" }],
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
  apis: ["src/features/**/*.route.ts"],
});
