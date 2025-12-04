import { Router } from "express";
import { createRole, deleteRole, getAllRoles, getRoleById, updateRole } from "../controllers/roleController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", checkPermission("ROLE_MANAGE"), getAllRoles);
router.get("/:id", checkPermission("ROLE_MANAGE"), getRoleById);
router.post("/", checkPermission("ROLE_MANAGE"), createRole);
router.put("/:id", checkPermission("ROLE_MANAGE"), updateRole);
router.delete("/:id", checkPermission("ROLE_MANAGE"), deleteRole);

export default router;