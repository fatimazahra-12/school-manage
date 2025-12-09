import type { Response } from "express";

export class ResponseHandler {
  static success(res: Response, message = "OK", data?: any, status = 200) {
    return res.status(status).json({ message, data });
  }

  static created(res: Response, message = "Created", data?: any) {
    return res.status(201).json({ message, data });
  }

  static error(res: Response, message = "Error", status = 500, error?: any) {
    const payload: any = { message };
    if (process.env.NODE_ENV !== "production" && error) payload.error = error;
    return res.status(status).json(payload);
  }
}
