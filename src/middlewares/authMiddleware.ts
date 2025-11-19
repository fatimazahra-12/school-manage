import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "../utils/Jwt";
import prisma from "../config/prisma"; 
import { ResponseHandler } from "../utils/responseHandler";

interface AuthRequest extends Request {
  user?: { id: number; email: string; roleId: number };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ResponseHandler.error(res, "Token manquant", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
          const token = authHeader.split(" ")[1];
    if (!token) {
      return ResponseHandler.error(res, "Token manquant", 401);
    }

    const decoded = verifyAccessToken(token) as {
      id: number;
      email: string;
      roleId: number;
    };
      req.user = { id: Number(decoded.id), email: decoded.email, roleId: Number(decoded.roleId) };
      return next();
    } catch (err: any) {
      if (err.name !== "TokenExpiredError") {
        return ResponseHandler.error(res, "Token invalide", 401);
      }

      const refreshToken = req.cookies?.refreshToken || (req.headers["x-refresh-token"] as string);
      if (!refreshToken) {
        return ResponseHandler.error(res, "Refresh token manquant", 401);
      }

      let decodedRefresh;
      try {
        decodedRefresh = verifyRefreshToken(refreshToken) as { id: number; email: string; roleId: number };
      } catch {
        return ResponseHandler.error(res, "Refresh token invalide", 401);
      }

      const tokenRecord = await prisma.refreshToken.findFirst({
        where: { token: refreshToken, user_id: decodedRefresh.id, revoked: false }
      });

      if (!tokenRecord) {
        return ResponseHandler.error(res, "Refresh token invalide ou révoqué", 401);
      }

      const user = await prisma.user.findUnique({ where: { id: decodedRefresh.id } });
      if (!user) return ResponseHandler.error(res, "Utilisateur introuvable", 401);

      const newAccessToken = generateAccessToken({ id: user.id, email: user.email, roleId: user.role_id });
      res.setHeader("x-access-token", newAccessToken);

      req.user = { id: user.id, email: user.email, roleId: user.role_id };
      return next();
    }
  } catch (error) {
    console.error("AuthMiddleware error:", error);
    return ResponseHandler.error(res, "Unauthorized", 401);
  }
};
