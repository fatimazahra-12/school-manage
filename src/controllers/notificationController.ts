import { Request, Response } from "express";
import NotificationService from "../services/notificationService";
import { ResponseHandler } from "../utils/responseHandler";

interface AuthRequest extends Request {
  user?: { id: number; email?: string; roleId?: number };
}

export const createNotificationHandler = async (req: Request, res: Response) => {
  try {
    const { user_id, user_ids, actor_id, titre, message, type, channels, metadata } = req.body as any;

    if (!titre || !message) return ResponseHandler.error(res, "titre and message required", 400);

    if (user_ids && Array.isArray(user_ids)) {
      const created = await NotificationService.createNotificationsForUsers(user_ids, {
        titre,
        message,
        type,
        channels,
        metadata,
        actorId: actor_id,
      });
      return ResponseHandler.created(res, "Notifications créées", created);
    }

    if (!user_id) return ResponseHandler.error(res, "user_id or user_ids required", 400);

    const created = await NotificationService.createNotification({
      userIds: [user_id],
      titre,
      message,
      type,
      channels,
      metadata,
      actorId: actor_id,
    });
    return ResponseHandler.created(res, "Notification créée", created);
  } catch (err) {
    console.error("createNotificationHandler error:", err);
    return ResponseHandler.error(res, "Erreur lors de la création", 500, err);
  }
};

export const getAllNotificationsHandler = async (_req: AuthRequest, res: Response) => {
  try {
    const all = await NotificationService.getAllNotifications();
    return ResponseHandler.success(res, "OK", all);
  } catch (err) {
    console.error("getAllNotificationsHandler error:", err);
    return ResponseHandler.error(res, "Erreur", 500, err);
  }
};

export const getMyNotificationsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return ResponseHandler.error(res, "Unauthorized", 401);
    const notifs = await NotificationService.getUserNotificationsFlattened(userId);
    return ResponseHandler.success(res, "OK", notifs);
  } catch (err) {
    console.error("getMyNotificationsHandler error:", err);
    return ResponseHandler.error(res, "Erreur", 500, err);
  }
};

export const getUnreadNotificationsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return ResponseHandler.error(res, "Unauthorized", 401);
    const notifs = await NotificationService.getUnreadNotifications(userId);
    return ResponseHandler.success(res, "OK", notifs);
  } catch (err) {
    console.error("getUnreadNotificationsHandler error:", err);
    return ResponseHandler.error(res, "Erreur", 500, err);
  }
};

export const markAsReadHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const id = Number(req.params.id);
    if (!userId) return ResponseHandler.error(res, "Unauthorized", 401);
    const updated = await NotificationService.markAsRead(userId, id);
    if (!updated) return ResponseHandler.error(res, "Notification not found", 404);
    return ResponseHandler.success(res, "Marked as read", updated);
  } catch (err) {
    console.error("markAsReadHandler error:", err);
    return ResponseHandler.error(res, "Erreur", 500, err);
  }
};

export const markAllAsReadHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return ResponseHandler.error(res, "Unauthorized", 401);
    const result = await NotificationService.markAllAsRead(userId);
    return ResponseHandler.success(res, "Marked all as read", result);
  } catch (err) {
    console.error("markAllAsReadHandler error:", err);
    return ResponseHandler.error(res, "Erreur", 500, err);
  }
};

export const deleteNotificationHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const id = Number(req.params.id);
    if (!userId) return ResponseHandler.error(res, "Unauthorized", 401);
    const removed = await NotificationService.removeNotification(userId, id);
    if (!removed) return ResponseHandler.error(res, "Notification not found", 404);
    return ResponseHandler.success(res, "Deleted", removed);
  } catch (err) {
    console.error("deleteNotificationHandler error:", err);
    return ResponseHandler.error(res, "Erreur", 500, err);
  }
};

export default {
  createNotificationHandler,
  getAllNotificationsHandler,
  getMyNotificationsHandler,
  getUnreadNotificationsHandler,
  markAsReadHandler,
  markAllAsReadHandler,
  deleteNotificationHandler,
};
