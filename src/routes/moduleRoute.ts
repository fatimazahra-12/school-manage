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



// Create Module
router.post("/", createModule);

// Get All Modules
router.get("/", getAllModules);



// Get Modules By Filiere
router.get("/filiere/:id", getModulesByFiliere);

// Get Modules By Teacher
router.get("/teacher/:id", getModulesByTeacher);

// Get Module With Cours
router.get("/cours/:id", getModuleWithCours);

// Get Module With Examens
router.get("/examens/:id", getModuleWithExamens);

// Search Modules
router.get("/search/:key", searchModules);

// Get Module Stats
router.get("/stats/:id", getModuleStats);



// Get Module By ID
router.get("/:id", getModuleById);

// Update Module
router.put("/:id", updateModule);

// Delete Module
router.delete("/:id", deleteModule);

export default router;
