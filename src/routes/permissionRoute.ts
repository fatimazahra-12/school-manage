import { Router } from "express";
import { getAllPermissions, getPermissionById, createPermission, updatePermission, deletePermission } from "../controllers/permissionController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", checkPermission("PERMISSION_MANAGE"), getAllPermissions);
router.get("/:id", checkPermission("PERMISSION_MANAGE"), getPermissionById);
router.post("/", checkPermission("PERMISSION_MANAGE"), createPermission);
router.put("/:id", checkPermission("PERMISSION_MANAGE"), updatePermission);
router.delete("/:id", checkPermission("PERMISSION_MANAGE"), deletePermission);

export default router;
