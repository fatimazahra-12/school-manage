import dotenv from "dotenv";
dotenv.config();

import jwt, { SignOptions, Secret } from "jsonwebtoken";

// Load environment variables
const {
  AUTH_SECRET,
  AUTH_SECRET_EXPIRES_IN,
  AUTH_REFRESH_SECRET,
  AUTH_REFRESH_SECRET_EXPIRES_IN,
  RESET_SECRET,
  RESET_EXPIRES_IN,
} = process.env;

if (!AUTH_SECRET || !AUTH_REFRESH_SECRET || !RESET_SECRET) {
  throw new Error("JWT secrets are missing in environment variables!");
}

const accessSecret: Secret = AUTH_SECRET;
const refreshSecret: Secret = AUTH_REFRESH_SECRET;
const resetSecret: Secret = RESET_SECRET;

const accessExpiresIn: SignOptions['expiresIn'] = (AUTH_SECRET_EXPIRES_IN ?? "15m") as unknown as SignOptions['expiresIn'];
const refreshExpiresIn: SignOptions['expiresIn'] = (AUTH_REFRESH_SECRET_EXPIRES_IN ?? "24h") as unknown as SignOptions['expiresIn'];
const resetExpiresIn: SignOptions['expiresIn'] = (RESET_EXPIRES_IN ?? "15m") as unknown as SignOptions['expiresIn'];

const accessTokenOptions: SignOptions = { expiresIn: accessExpiresIn ?? "15m" };
const refreshTokenOptions: SignOptions = { expiresIn: refreshExpiresIn ?? "24h"};
const resetTokenOptions: SignOptions = { expiresIn: resetExpiresIn ?? "15m" };

// Generate access token
export const generateAccessToken = (payload: object) =>
  jwt.sign(payload, accessSecret, accessTokenOptions);

// Verify access token
export const verifyAccessToken = (token: string) =>
  jwt.verify(token, accessSecret);

// Generate refresh token
export const generateRefreshToken = (payload: object) =>
  jwt.sign(payload, refreshSecret, refreshTokenOptions);

// Verify refresh token
export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshSecret);

// Generate reset password token
export const generateResetToken = (payload: object) =>
  jwt.sign(payload, resetSecret, resetTokenOptions);

// Verify reset token
export const verifyResetToken = (token: string) =>
  jwt.verify(token, resetSecret);
