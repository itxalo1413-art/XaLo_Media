import type { JwtPayload } from "../utils/tokens";

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
      requestId?: string;
    }
  }
}
export {};
