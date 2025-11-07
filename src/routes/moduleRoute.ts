import { Router } from "express";
import { ModuleController } from "../controllers/moduleController.js";

const router = Router();

// CRUD routes
router.post("/", ModuleController.createModule);
router.get("/", ModuleController.getModules);
router.get("/:id", ModuleController.getModuleById);
router.put("/:id", ModuleController.updateModule);
router.delete("/:id", ModuleController.deleteModule);

export default router;
