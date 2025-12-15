import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
  getProfileByUserId,
  updateProfileByUserId,
  listProfiles,
  createProfileByUserId,
  deleteProfileByUserId,
} from "../controllers/profileController.js";

const router = Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

router.get("/", authMiddleware, checkPermission("USER_VIEW"), listProfiles);
router.get("/:userId", authMiddleware, checkPermission("USER_VIEW"), getProfileByUserId);
router.post("/:userId", authMiddleware, checkPermission("USER_MANAGE"), createProfileByUserId);
router.put("/:userId", authMiddleware, checkPermission("USER_MANAGE"), updateProfileByUserId);
router.delete("/:userId", authMiddleware, checkPermission("USER_MANAGE"), deleteProfileByUserId);

export default router;

