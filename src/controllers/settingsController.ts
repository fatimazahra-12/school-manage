import { Request, Response } from "express";
import prisma from "../config/prisma";
import { ResponseHandler } from "../utils/responseHandler";

const getUserId = (req: Request): number | null => {
  const paramId = req.params.userId ? Number(req.params.userId) : null;
  const authId = (req as any).user?.id ? Number((req as any).user.id) : null;
  return paramId ?? authId ?? null;
};

const allowedThemes = new Set(["clair", "sombre", "system"]);
const allowedLangues = new Set(["ar", "fr", "en"]);
const allowedFormats = new Set(["dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd"]);

const isValidTheme = (value: unknown) => typeof value === "string" && allowedThemes.has(value);
const isValidLangue = (value: unknown) => typeof value === "string" && allowedLangues.has(value);
const isValidFormat = (value: unknown) => typeof value === "string" && allowedFormats.has(value);
const isValidBool = (value: unknown) => typeof value === "boolean";

// Build an update/create payload while validating provided fields
const buildSettingsPayload = (body: any) => {
  const data: any = {};

  if (body.theme !== undefined) {
    if (!isValidTheme(body.theme)) throw new Error("Invalid theme");
    data.theme = body.theme;
  }

  if (body.langue !== undefined) {
    if (!isValidLangue(body.langue)) throw new Error("Invalid langue");
    data.langue = body.langue;
  }

  if (body.notifications_activees !== undefined) {
    if (!isValidBool(body.notifications_activees)) throw new Error("Invalid notifications_activees");
    data.notifications_activees = body.notifications_activees;
  }

  if (body.format !== undefined) {
    if (!isValidFormat(body.format)) throw new Error("Invalid format");
    data.format_date = body.format;
  }

  return data;
};

export const getSettingsByUser = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return ResponseHandler.error(res, "userId required", 400);
  const settings = await prisma.settings.findUnique({ where: { user_id: userId } });
  return ResponseHandler.success(res, "OK", settings);
};

// Admin: create settings for a user (or upsert if exists)
export const createSettings = async (req: Request, res: Response) => {
  try {
    const { userId, ...rest } = req.body as { userId?: number };
    if (!userId) return ResponseHandler.error(res, "userId required", 400);

    const data = buildSettingsPayload(rest);
    if (Object.keys(data).length === 0) return ResponseHandler.error(res, "No valid settings provided", 400);

    const settings = await prisma.settings.upsert({
      where: { user_id: Number(userId) },
      update: data,
      create: { user_id: Number(userId), ...data },
    });

    return ResponseHandler.success(res, "Settings created", settings, 201);
  } catch (err: any) {
    return ResponseHandler.error(res, err.message || "Could not create settings", 400);
  }
};

export const updateTheme = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { theme } = req.body;
  if (!userId || !isValidTheme(theme)) return ResponseHandler.error(res, "userId and valid theme required", 400);
  const settings = await prisma.settings.upsert({
    where: { user_id: userId },
    update: { theme },
    create: { user_id: userId, theme },
  });
  return ResponseHandler.success(res, "Theme updated", settings);
};

export const updateLangue = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { langue } = req.body;
  if (!userId || !isValidLangue(langue)) return ResponseHandler.error(res, "userId and valid langue required", 400);
  const settings = await prisma.settings.upsert({
    where: { user_id: userId },
    update: { langue },
    create: { user_id: userId, langue },
  });
  return ResponseHandler.success(res, "Langue updated", settings);
};

export const toggleNotifications = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return ResponseHandler.error(res, "userId required", 400);
  const current = await prisma.settings.findUnique({ where: { user_id: userId } });
  const nextValue = !(current?.notifications_activees ?? true);
  const settings = await prisma.settings.upsert({
    where: { user_id: userId },
    update: { notifications_activees: nextValue },
    create: { user_id: userId, notifications_activees: nextValue },
  });
  return ResponseHandler.success(res, "Notifications toggled", settings);
};

export const updateFormatDate = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { format } = req.body;
  if (!userId || !isValidFormat(format)) return ResponseHandler.error(res, "userId and valid format required", 400);
  const settings = await prisma.settings.upsert({
    where: { user_id: userId },
    update: { format_date: format },
    create: { user_id: userId, format_date: format },
  });
  return ResponseHandler.success(res, "Date format updated", settings);
};

// Admin: update multiple fields for a specific user
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return ResponseHandler.error(res, "userId required", 400);

    const data = buildSettingsPayload(req.body);
    if (Object.keys(data).length === 0) return ResponseHandler.error(res, "No valid settings provided", 400);

    const settings = await prisma.settings.upsert({
      where: { user_id: userId },
      update: data,
      create: { user_id: userId, ...data },
    });
    return ResponseHandler.success(res, "Settings updated", settings);
  } catch (err: any) {
    return ResponseHandler.error(res, err.message || "Could not update settings", 400);
  }
};

// Admin: delete settings for a specific user
export const deleteSettings = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return ResponseHandler.error(res, "userId required", 400);

  try {
    await prisma.settings.delete({ where: { user_id: userId } });
    return ResponseHandler.success(res, "Settings deleted", null);
  } catch (err: any) {
    return ResponseHandler.error(res, "Settings not found", 404);
  }
};

export default {
  getSettingsByUser,
  createSettings,
  updateTheme,
  updateLangue,
  toggleNotifications,
  updateFormatDate,
  updateSettings,
  deleteSettings,
};
