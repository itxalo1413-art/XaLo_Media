import { env } from "./config/env";
import { connectDB } from "./config/db";
import { createApp } from "./app";
import { seedAdmin } from "./features/auth/auth.service";
import { swaggerSpec } from "./config/swagger";
import { requireAdmin } from "./middlewares/auth";

async function bootstrap() {
  await connectDB();
  await seedAdmin();

  const app = createApp();
  app.get('/api/v1/admin', requireAdmin, (req, res) => {
  res.json({
    message: 'Chào mừng bạn đến với trang quản trị!',
  });
});
  app.listen(env.PORT, () => console.log(`🚀 Server running on :${env.PORT}`));
}

bootstrap().catch((e) => {
  console.error("❌ Bootstrap failed:", e);
  process.exit(1);
});
