import { Router, Request, Response, NextFunction } from "express";
import {
  createNotificationHandler,
  getAllNotificationsHandler,
  getMyNotificationsHandler,
  getUnreadNotificationsHandler,
  markAsReadHandler,
  markAllAsReadHandler,
  deleteNotificationHandler,
} from "../controllers/notificationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Simple role guard: allow only roleId = 1 (admin). Adjust as needed.
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.roleId !== 1) {
    return res.status(403).json({ message: "Accès refusé : admin requis" });
  }
  return next();
};

// Create notification (admin-only)
router.post("/", authMiddleware, requireAdmin, createNotificationHandler);

// Admin/global list (protect with auth; add role middleware if needed)
router.get("/all", authMiddleware, requireAdmin, getAllNotificationsHandler);

// Protected user routes
router.get("/me", authMiddleware, getMyNotificationsHandler);
router.get("/me/unread", authMiddleware, getUnreadNotificationsHandler);
router.patch("/me/read-all", authMiddleware, markAllAsReadHandler);
router.patch("/:id/read", authMiddleware, markAsReadHandler);
router.delete("/:id", authMiddleware, deleteNotificationHandler);

export default router;
