import { Router } from "express";
import { ModuleController } from "../controllers/moduleController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";

const router = Router();

// CRUD routes
router.post("/", checkPermission("MODULE_MANAGE"), ModuleController.createModule);
router.get("/", checkPermission("MODULE_VIEW"), ModuleController.getModules);
router.get("/:id",checkPermission("MODULE_VIEW"), ModuleController.getModuleById);
router.put("/:id", checkPermission("MODULE_MANAGE"), ModuleController.updateModule);
router.delete("/:id", checkPermission("MODULE_MANAGE"), ModuleController.deleteModule);

export default router;
