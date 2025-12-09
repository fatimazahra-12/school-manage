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

// Filter by filiere
router.get("/filiere/:filiere_id", authMiddleware, ModuleController.getModulesByFiliere);

// Filter by teacher
router.get("/teacher/:enseignant_id", authMiddleware, ModuleController.getModulesByTeacher);

// Get module with courses
router.get("/:id/cours", authMiddleware, ModuleController.getModuleWithCours);

// Get module with exams
router.get("/:id/examens", authMiddleware, ModuleController.getModuleWithExamens);

// Search modules by keyword
router.get("/search/:keyword", authMiddleware, ModuleController.searchModules);

// Get module statistics
router.get("/:id/stats", authMiddleware, ModuleController.getModuleStats);

export default router;
