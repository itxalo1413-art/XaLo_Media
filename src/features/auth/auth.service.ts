import bcrypt from "bcrypt";
import { env } from "../../config/env";
import { Admin } from "../../models/Admin";
import { AppError } from "../../utils/response";
import { signAccessToken, signRefreshToken, type JwtPayload } from "../../utils/tokens";

export async function seedAdmin() {
  const existed = await Admin.findOne({ email: env.ADMIN_EMAIL });
  if (existed) return;

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  await Admin.create({ email: env.ADMIN_EMAIL, passwordHash });
  console.log("✅ Admin seeded");
}

export async function login(email: string, password: string) {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new AppError("UNAUTHORIZED", "Invalid credentials", 401);

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw new AppError("UNAUTHORIZED", "Invalid credentials", 401);

  const payload: JwtPayload = { sub: String(admin._id), email: admin.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  admin.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await admin.save();

  return { accessToken, refreshToken };
}
