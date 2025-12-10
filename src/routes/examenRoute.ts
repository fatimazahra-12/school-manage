import express from "express";
import {
  createExamen,
  getAllExamens,
  getExamenById,
  updateExamen,
  deleteExamen,
  getExamensByModule,
  getExamensBySalle,
  getExamensOfDay,
  getExamensForGroupe,
  detectExamConflict,
} from "../controllers/examenController.js";

const router = express.Router();

// CRUD routes
router.post("/", createExamen);
router.get("/", getAllExamens);

// Advanced routes (before /:id to avoid conflicts)
router.get("/module/:module_id", getExamensByModule);
router.get("/salle/:salle_id", getExamensBySalle);
router.get("/day/:date", getExamensOfDay);
router.get("/groupe/:groupe_id", getExamensForGroupe);
router.get("/conflict/:salle_id/:date", detectExamConflict);

// CRUD routes with :id
router.get("/:id", getExamenById);
router.put("/:id", updateExamen);
router.delete("/:id", deleteExamen);

export default router;
