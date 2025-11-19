// src/services/TwofactorService.ts
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import prisma from '../config/prisma';

export class TwoFactorService {

  static async generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `School Management (${email})`,
      length: 20,
    });

    // Save secret in DB
    await prisma.user.update({
      where: { email },
      data: { two_factor_secret: secret.base32 },
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);
    return { secret: secret.base32, qrCodeUrl };
  }

  static async generateQRCodeFromSecret(secret: string, email: string) {
    const otpauth = speakeasy.otpauthURL({
      secret,
      label: `School Management (${email})`,
      encoding: 'base32'
    });
    return qrcode.toDataURL(otpauth);
  }

  static async verify2FA(email: string, token: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.two_factor_secret) throw new Error("2FA not set up");

    return speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token,
      window: 1,
    });
  }
}
