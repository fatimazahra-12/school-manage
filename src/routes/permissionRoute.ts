import { Router } from "express";
import { getAllPermissions, getPermissionById, createPermission, updatePermission, deletePermission } from "../controllers/permissionController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, checkPermission("PERMISSION_MANAGE"), getAllPermissions);
router.get("/:id", authMiddleware, checkPermission("PERMISSION_MANAGE"), getPermissionById);
router.post("/", authMiddleware, checkPermission("PERMISSION_MANAGE"), createPermission);
router.put("/:id", authMiddleware, checkPermission("PERMISSION_MANAGE"), updatePermission);
router.delete("/:id", authMiddleware, checkPermission("PERMISSION_MANAGE"), deletePermission);

export default router;
