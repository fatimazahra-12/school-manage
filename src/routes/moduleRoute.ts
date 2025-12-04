import { Router } from "express";
import { ModuleController } from "../controllers/moduleController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// CRUD routes
router.post("/", authMiddleware, checkPermission("MODULE_MANAGE"), ModuleController.createModule);
router.get("/", authMiddleware, checkPermission("MODULE_VIEW"), ModuleController.getModules);
router.get("/:id", authMiddleware, checkPermission("MODULE_VIEW"), ModuleController.getModuleById);
router.put("/:id", authMiddleware, checkPermission("MODULE_MANAGE"), ModuleController.updateModule);
router.delete("/:id", authMiddleware, checkPermission("MODULE_MANAGE"), ModuleController.deleteModule);

export default router;
