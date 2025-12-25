import { env } from "./config/env";
import { connectDB } from "./config/db";
import { createApp } from "./app";
import { seedAdmin } from "./features/auth/auth.service";

async function bootstrap() {
  await connectDB();
  await seedAdmin();

  const app = createApp();
  app.listen(env.PORT, () => console.log(`🚀 Server running on :${env.PORT}`));
}

bootstrap().catch((e) => {
  console.error("❌ Bootstrap failed:", e);
  process.exit(1);
});
