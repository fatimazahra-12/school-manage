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

const router = Router();

router.post("/", createModule);

router.get("/", getAllModules);

router.get("/filiere/:id", getModulesByFiliere);

router.get("/teacher/:id", getModulesByTeacher);

router.get("/cours/:id", getModuleWithCours);

router.get("/examens/:id", getModuleWithExamens);

router.get("/search/:key", searchModules);

router.get("/stats/:id", getModuleStats);

router.get("/:id", getModuleById);

router.put("/:id", updateModule);

router.delete("/:id", deleteModule);

export default router;
