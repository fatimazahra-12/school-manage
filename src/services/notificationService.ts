import prisma from "../config/prisma";
import { sendMail } from "./mailService";

type CreateOpts = {
  userId?: number;
  userIds?: number[];
  actorId?: number;
  titre: string;
  message: string;
  type?: string;
  channels?: Array<"in_app" | "email" | "sms" | "push">;
  metadata?: any;
};

const DEFAULT_CHANNELS: CreateOpts["channels"] = ["in_app"];

export const createNotification = async (opts: CreateOpts) => {
  const { userIds = [], userId, actorId, titre, message, type = "info", channels = DEFAULT_CHANNELS, metadata } = opts;

  // Determine target user IDs
  const targetUserIds = userIds.length > 0 ? userIds : userId ? [userId] : [];
  if (targetUserIds.length === 0) throw new Error("No target users specified");

  // Create single Notification record
  const notification = await prisma.notification.create({
    data: {
      titre,
      message,
      type,
      actor_id: actorId || null,
      metadata: metadata || null,
    },
  });

  // Create NotificationRecipient for each target user with their channels
  const channelStr = channels.includes("email") ? "EMAIL" : "IN_APP";
  const recipients = await Promise.all(
    targetUserIds.map((uid) =>
      prisma.notificationRecipient.create({
        data: {
          notificationId: notification.id,
          user_id: uid,
          channel: channelStr as any,
          statut: "NON_LU",
        },
      })
    )
  );

  // Send in-app (real-time) via socket.io if in channels
  if (channels.includes("in_app")) {
    try {
      const io = (global as any).io;
      if (io) {
        for (const uid of targetUserIds) {
          io.to(`user_${uid}`).emit("notification", {
            id: notification.id,
            titre: notification.titre,
            message: notification.message,
            type: notification.type,
            created_at: notification.created_at,
          });
        }
      }
    } catch (err) {
      console.error("Error emitting socket notification:", err);
    }
  }

  // Send emails if in channels
  if (channels.includes("email")) {
    try {
      for (const uid of targetUserIds) {
        // eslint-disable-next-line no-await-in-loop
        const settings = await prisma.settings.findUnique({ where: { user_id: uid } });
        if (!settings || settings.notifications_activees) {
          // eslint-disable-next-line no-await-in-loop
          const user = await prisma.user.findUnique({ where: { id: uid } });
          if (user?.email) {
            // eslint-disable-next-line no-await-in-loop
            await sendMail(user.email, titre, message);
          }
        }
      }
    } catch (err) {
      console.error("Error sending notification email:", err);
    }
  }

  // TODO: add push/sms channel integrations when available

  return { notification, recipients };
};

export const createNotificationsForUsers = async (
  userIds: number[],
  payload: Omit<CreateOpts, "userId" | "userIds">
) => {
  return createNotification({ userIds, ...payload });
};

export const getAllNotifications = async () => {
  return prisma.notification.findMany({
    include: { notificationRecipients: true },
    orderBy: { created_at: "desc" },
  });
};

export const getUserNotifications = async (userId: number) => {
  return prisma.notificationRecipient.findMany({
    where: { user_id: userId },
    include: { notification: true },
    orderBy: { created_at: "desc" },
  });
};

export const getUserNotificationsFlattened = async (userId: number) => {
  const recipients = await prisma.notificationRecipient.findMany({
    where: { user_id: userId },
    include: { notification: true },
    orderBy: { created_at: "desc" },
  });

  return recipients.map((r) => ({
    id: r.notification.id,
    titre: r.notification.titre,
    message: r.notification.message,
    type: r.notification.type,
    metadata: r.notification.metadata,
    created_at: r.notification.created_at,
    // recipient-specific metadata
    recipientId: r.id,
    channel: r.channel,
    statut: r.statut,
    read_at: r.read_at,
  }));
};

export const getUnreadNotifications = async (userId: number) => {
  const recipients = await prisma.notificationRecipient.findMany({
    where: { user_id: userId, statut: "NON_LU" },
    include: { notification: true },
    orderBy: { created_at: "desc" },
  });

  return recipients.map((r) => ({
    id: r.notification.id,
    titre: r.notification.titre,
    message: r.notification.message,
    type: r.notification.type,
    metadata: r.notification.metadata,
    created_at: r.notification.created_at,
    recipientId: r.id,
    channel: r.channel,
    statut: r.statut,
    read_at: r.read_at,
  }));
};

export const markAsRead = async (userId: number, recipientId: number) => {
  // ensure ownership
  const recipient = await prisma.notificationRecipient.findUnique({
    where: { id: recipientId },
  });
  if (!recipient || recipient.user_id !== userId) return null;
  return prisma.notificationRecipient.update({
    where: { id: recipientId },
    data: { statut: "LU", read_at: new Date() },
  });
};

export const markAllAsRead = async (userId: number) => {
  return prisma.notificationRecipient.updateMany({
    where: { user_id: userId, statut: "NON_LU" },
    data: { statut: "LU", read_at: new Date() },
  });
};

export const removeNotification = async (userId: number, recipientId: number) => {
  // ensure ownership
  const recipient = await prisma.notificationRecipient.findUnique({
    where: { id: recipientId },
  });
  if (!recipient || recipient.user_id !== userId) return null;
  return prisma.notificationRecipient.delete({ where: { id: recipientId } });
};

export default {
  createNotification,
  createNotificationsForUsers,
  getAllNotifications,
  getUserNotifications,
  getUserNotificationsFlattened,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
};
