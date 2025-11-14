import { Router } from "express";
import { getAllRolePermissions, createRolePermission, deleteRolePermission } from "../controllers/rolepermissionController.js";

const router = Router();

router.get("/", getAllRolePermissions);
router.post("/", createRolePermission);
router.delete("/:id", deleteRolePermission);

export default router;
