import { Router } from "express";
import { getAllPermissions, getPermissionById, createPermission, updatePermission, deletePermission } from "../controllers/permissionController.js";

const router = Router();

router.get("/", getAllPermissions);
router.get("/:id", getPermissionById);
router.post("/", createPermission);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

export default router;
