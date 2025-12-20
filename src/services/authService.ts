import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { sendMail } from "./mailService";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateResetToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyResetToken,
  verifyAccessToken,
} from "../utils/Jwt";


interface SignupData {
  nom: string;
  email: string;
  mot_de_passe: string;
  role_id?: number;
}

export class AuthService {
  // ---------------- SIGNUP ----------------
  static async signup(data: SignupData) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("Email is already in use!");

    const role =
      data.role_id ||
      (await prisma.role.findFirst({ where: { nom: "etudiant" } }))?.id;
    if (!role) throw new Error("Default role not found!");

    const hashedPassword = await bcrypt.hash(data.mot_de_passe, 10);

    const user = await prisma.user.create({
      data: {
        nom: data.nom,
        email: data.email,
        mot_de_passe: hashedPassword,
        role_id: role,
        is_verified: false,
      },
    });

    const verifyToken = generateAccessToken({ id: user.id });
    const verifyLink = `${process.env.APP_URL}/api/auth/verify/${verifyToken}`;

    await sendMail(
      user.email,
      "Verify your email address",
      `Hello ${user.nom}, please verify your email by clicking this link: ${verifyLink}`
    );

    return { message: "Account created! Please check your email to verify your account." };
  }

  // ---------------- SIGNIN ----------------
  static async signin(email: string, mot_de_passe: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found.");
    if (!user.is_verified) throw new Error("Please verify your email before logging in.");

    const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isValid) throw new Error("Invalid password!");

    const role = await prisma.role.findUnique({ where: { id: user.role_id } });
    const authorities = role ? [`ROLE_${role.nom.toUpperCase()}`] : [];

    const refreshToken = generateRefreshToken({ id: user.id });
    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiry
        revoked: false,
      },
    });

    // Include roleId so downstream guards (requireAdmin) can authorize properly
    const accessToken = generateAccessToken({ id: user.id, roleId: user.role_id, roles: authorities });

    return { user, accessToken, refreshToken, authorities };
  }

  // ---------------- REFRESH TOKEN ----------------
  static async refreshToken(token: string) {
    const decoded = verifyRefreshToken(token) as { id: number };

    const tokenRecord = await prisma.refreshToken.findFirst({
      where: { token, user_id: decoded.id, revoked: false },
    });
    if (!tokenRecord) throw new Error("Invalid refresh token!");

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new Error("User not found.");

    const role = await prisma.role.findUnique({ where: { id: user.role_id } });
    const authorities = role ? [`ROLE_${role.nom.toUpperCase()}`] : [];

    return generateAccessToken({ id: user.id, roles: authorities });
  }

  // ---------------- LOGOUT ----------------
  static async logout(token: string) {
    const decoded = verifyRefreshToken(token) as { id: number };

    await prisma.refreshToken.updateMany({
      where: { token, user_id: decoded.id },
      data: { revoked: true },
    });

    return { message: "Logged out successfully." };
  }

  // ---------------- VERIFY EMAIL ----------------
  static async verifyEmail(token: string) {
    const decoded = verifyAccessToken(token) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new Error("User not found.");
    if (user.is_verified) throw new Error("Email already verified.");

    await prisma.user.update({
      where: { id: user.id },
      data: { is_verified: true },
    });

    await sendMail(
      user.email,
      "Welcome! 🎉",
      `Hello ${user.nom}, your account has been successfully verified. Welcome aboard!`
    );

    return { message: "Email verified successfully!" };
  }

  // ---------------- SEND RESET PASSWORD EMAIL ----------------
  static async sendResetPasswordEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found.");

    const resetSecret = process.env.RESET_SECRET;

    const resetToken = generateResetToken({ id: user.id }); 
    console.log("==== RESET TOKEN GENERATED ====");
    console.log("RESET_SECRET USED TO SIGN:", resetSecret);
    console.log("RESET TOKEN:", resetToken);
    const resetLink = `${process.env.APP_URL}/api/auth/reset-password/${resetToken}`;

    await sendMail(
      user.email,
      "Reset Your Password",
      `Hello ${user.nom}, reset your password by clicking this link: ${resetLink}`
    );

    return { message: "Reset password email sent successfully." };
  }

  // ---------------- RESET PASSWORD ----------------
  static async resetPassword(token: string, newPassword: string) {
    const resetSecret = process.env.RESET_SECRET;
    console.log("==== RECEIVED RESET TOKEN ====");
  console.log("Token from client:", token);

  // Check if token is decodable
  console.log("Decoded token:", jwt.decode(token));

  // Check verify secret
  console.log("RESET_SECRET USED TO VERIFY:", resetSecret);
    const payload = verifyResetToken(token) as { id: number };
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: { mot_de_passe: hashedPassword },
    });

    return { message: "Password reset successfully.", user: updatedUser };
  }
}
