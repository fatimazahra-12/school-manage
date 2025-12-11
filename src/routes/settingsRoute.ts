import { Router, Request, Response, NextFunction } from "express";
import {
  getSettingsByUser,
  createSettings,
  updateTheme,
  updateLangue,
  toggleNotifications,
  updateFormatDate,
  updateSettings,
  deleteSettings,
} from "../controllers/settingsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Simple admin guard: roleId === 1
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.roleId !== 1) {
    return res.status(403).json({ message: "Accès refusé : admin requis" });
  }
  return next();
};

// Current user routes
router.get("/me", authMiddleware, getSettingsByUser);
router.patch("/me/theme", authMiddleware, updateTheme);
router.patch("/me/langue", authMiddleware, updateLangue);
router.patch("/me/notifications/toggle", authMiddleware, toggleNotifications);
router.patch("/me/format-date", authMiddleware, updateFormatDate);

//admin access to specific user by id :Optional
router.post("/", authMiddleware, requireAdmin, createSettings);
router.get("/:userId", authMiddleware, requireAdmin, getSettingsByUser);
router.patch("/:userId", authMiddleware, requireAdmin, updateSettings);
router.patch("/:userId/theme", authMiddleware, requireAdmin, updateTheme);
router.patch("/:userId/langue", authMiddleware, requireAdmin, updateLangue);
router.patch("/:userId/notifications/toggle", authMiddleware, requireAdmin, toggleNotifications);
router.patch("/:userId/format-date", authMiddleware, requireAdmin, updateFormatDate);
router.delete("/:userId", authMiddleware, requireAdmin, deleteSettings);

export default router;
