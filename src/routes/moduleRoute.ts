import { Router } from "express";
import {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  getModulesByFiliere,
  getModulesByTeacher,
  getModuleWithCours,
  getModuleWithExamens,
  searchModules,
  getModuleStats,
} from "../controllers/moduleController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// CRUD routes
router.post("/", authMiddleware, checkPermission("MODULE_MANAGE"), createModule);
router.get("/", authMiddleware, checkPermission("MODULE_VIEW"), getAllModules);
router.get("/:id", authMiddleware, checkPermission("MODULE_VIEW"), getModuleById);
router.put("/:id", authMiddleware, checkPermission("MODULE_MANAGE"), updateModule);
router.delete("/:id", authMiddleware, checkPermission("MODULE_MANAGE"), deleteModule);
router.get("/filiere/:id", authMiddleware, getModulesByFiliere);
router.get("/teacher/:id", authMiddleware, getModulesByTeacher);
router.get("/cours/:id", authMiddleware, getModuleWithCours);
router.get("/examens/:id", authMiddleware, getModuleWithExamens);
router.get("/search/:key", authMiddleware, searchModules);
router.get("/stats/:id", authMiddleware, getModuleStats);


export default router;
