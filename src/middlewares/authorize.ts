// src/middlewares/authorize.ts
import { Request, Response, NextFunction } from 'express';

// For MVP: just allow everything. Later you can add real auth here.
export function authorize(_permission: string) {
  return (_req: Request, _res: Response, next: NextFunction) => {
    next();
  };
}
