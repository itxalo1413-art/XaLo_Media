import morgan from "morgan";
import { logger } from "../config/logger";

morgan.token("request-id", (req) => (req as any).requestId);

export const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms rid=:request-id",
  {
    stream: { write: (msg) => logger.info(msg.trim()) },
    skip: (_req, res) => res.statusCode < 400, // log lỗi >= 400
  }
);
