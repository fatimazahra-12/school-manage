import { Router } from "express";
import { TwoFactorController } from "../controllers/twoFactor.controller";

const router = Router();

router.post('/enable-2fa', TwoFactorController.enable2FA);
router.post('/verify-2fa', TwoFactorController.verify2FA);
router.get("/qrcode", TwoFactorController.qrCode);


export default router;