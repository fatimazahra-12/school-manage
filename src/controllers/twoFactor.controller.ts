import { Request, Response } from "express";
import { TwoFactorService } from "../services/TwofactorService";
import { PrismaClient } from "@prisma/client";
import { ResponseHandler } from "../utils/responseHandler";
import qrcode from "qrcode";

const prisma = new PrismaClient();

export class TwoFactorController {

  // Enable 2FA and return QR code link
  static async enable2FA(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return ResponseHandler.error(res, "Email is required", 400);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return ResponseHandler.error(res, "User not found", 404);

      const { secret, qrCodeUrl } = await TwoFactorService.generateSecret(email);

      return ResponseHandler.success(res, "2FA setup initialized", {
        qrCodeUrl,
        qrCodeLink: `/api/2fa/qrcode?email=${encodeURIComponent(email)}`
      });

    } catch (err) {
      console.error(err);
      return ResponseHandler.error(res, "Error enabling 2FA");
    }
  }

  // Verify 2FA token
  static async verify2FA(req: Request, res: Response) {
    try {
      const { email, token } = req.body;
      if (!email || !token) return ResponseHandler.error(res, "Email and token are required", 400);

      const isValid = await TwoFactorService.verify2FA(email, token);
      if (!isValid) return ResponseHandler.error(res, "Invalid 2FA token", 400);

      await prisma.user.update({
        where: { email },
        data: { is_two_factor_enabled: true }
      });

      return ResponseHandler.success(res, "2FA verified and enabled successfully");

    } catch (err) {
      console.error(err);
      return ResponseHandler.error(res, "Error verifying 2FA");
    }
  }

  // Return QR code as PNG image
  static async qrCode(req: Request, res: Response) {
    try {
      const { email } = req.query;
      if (!email || typeof email !== "string") {
        return ResponseHandler.error(res, "Email query parameter is required", 400);
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.two_factor_secret) {
        return ResponseHandler.error(res, "User or 2FA secret not found", 404);
      }

      const secretUrl = `otpauth://totp/School Management (${email})?secret=${user.two_factor_secret}&issuer=School%20Management`;
      const qrCodeDataUrl = await qrcode.toDataURL(secretUrl);

      const base64Image = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const buffer = Buffer.from(base64Image, "base64");

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buffer.length
      });
      res.end(buffer);

    } catch (err) {
      console.error(err);
      return ResponseHandler.error(res, "Failed to load QR code");
    }
  }
}
