import { Response } from "express";

export class ResponseHandler {
  static success(res: Response, message: string, data?: any, code = 200) {
    return res.status(code).json({ message, data });
  }

  static error(res: Response, message: string, code = 500) {
    return res.status(code).json({ message });
  }
}
