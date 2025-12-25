import { Response } from "express";

export function ok(res: Response, data: any = null, meta: any = null) {
  return res.json({ success: true, data, meta });
}

export function fail(res: Response, code: string, message: string, details?: any, status = 400) {
  return res.status(status).json({ success: false, error: { code, message, details } });
}

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(code: string, message: string, statusCode = 400, details?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
