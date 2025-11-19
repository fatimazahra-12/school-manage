  import { Request, Response } from "express";
  import { AuthService } from "../services/authService";
  import { ResponseHandler } from "../utils/responseHandler";

  export class AuthController {
    // ---------------- SIGNUP ----------------
    static async signup(req: Request, res: Response) {
      try {
        const { nom, email, mot_de_passe, role_id } = req.body;
        const result = await AuthService.signup({ nom, email, mot_de_passe, role_id });
        return ResponseHandler.success(res, result.message);
      } catch (error: any) {
        console.error(error);
        return ResponseHandler.error(res, error.message || "Signup failed", 400);
      }
    }

    // ---------------- SIGNIN ----------------
    static async signin(req: Request, res: Response) {
      try {
        const { email, mot_de_passe } = req.body;
        const result = await AuthService.signin(email, mot_de_passe);
        return ResponseHandler.success(res, "Login successful", result);
      } catch (error: any) {
        console.error(error);
        return ResponseHandler.error(res, error.message || "Login failed", 400);
      }
    }

    // ---------------- REFRESH TOKEN ----------------
    static async refreshToken(req: Request, res: Response) {
      try {
        const token = req.body.token || req.headers["x-refresh-token"];
        if (!token) return ResponseHandler.error(res, "Refresh token is required", 400);

        const accessToken = await AuthService.refreshToken(token as string);
        return ResponseHandler.success(res, "Access token refreshed", { accessToken });
      } catch (error: any) {
        console.error(error);
        return ResponseHandler.error(res, error.message || "Token refresh failed", 401);
      }
    }

    // ---------------- LOGOUT ----------------
    static async logout(req: Request, res: Response) {
      try {
        const token = req.body.token || req.headers["x-refresh-token"];
        if (!token) return ResponseHandler.error(res, "Refresh token is required", 400);

        await AuthService.logout(token as string);
        return ResponseHandler.success(res, "Logged out successfully");
      } catch (error: any) {
        console.error(error);
        return ResponseHandler.error(res, error.message || "Logout failed", 400);
      }
    }

    // ---------------- VERIFY EMAIL ----------------
    static async verifyEmail(req: Request, res: Response) {
      try {
        const { token } = req.params;
        if (!token) return ResponseHandler.error(res, "Verification token is required", 400);

        const result = await AuthService.verifyEmail(token);
        return ResponseHandler.success(res, result.message);
      } catch (error: any) {
        console.error(error);
        return ResponseHandler.error(res, error.message || "Email verification failed", 400);
      }
    }

    // ---------------- RESET PASSWORD ----------------
    static async resetPassword(req: Request, res: Response) {
      try {
        const { newPassword } = req.body;
        const token = req.params.token;
        if (!token || !newPassword)
          return ResponseHandler.error(res, "Token and new password are required", 400);

        const result = await AuthService.resetPassword(token, newPassword);
        return ResponseHandler.success(res, result.message, { user: result.user });
      } catch (error: any) {
        console.error(error);
        return ResponseHandler.error(res, error.message || "Password reset failed", 400);
      }
    }

    static async forgotPassword(req: Request, res: Response) {
      try {
        const { email } = req.body;
        if (!email) return ResponseHandler.error(res, "Email is required", 400);

        // Generate reset token and send email
        const result = await AuthService.sendResetPasswordEmail(email);
        return ResponseHandler.success(res, result.message);
      } catch (error: any) {
        console.error(error);
        return ResponseHandler.error(res, error.message || "Failed to send reset password email", 400);
      }
    }
  }
