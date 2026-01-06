"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const app_1 = require("./app");
const auth_service_1 = require("./features/auth/auth.service");
const swagger_1 = require("./config/swagger");
async function bootstrap() {
    await (0, db_1.connectDB)();
    await (0, auth_service_1.seedAdmin)();
    const app = (0, app_1.createApp)();
    // ✅ Debug swagger spec (tạm thời)
    app.get("/api/v1/docs-json", (req, res) => res.json(swagger_1.swaggerSpec));
    app.listen(env_1.env.PORT, () => console.log(`🚀 Server running on :${env_1.env.PORT}`));
}
bootstrap().catch((e) => {
    console.error("❌ Bootstrap failed:", e);
    process.exit(1);
});
//# sourceMappingURL=server.js.map