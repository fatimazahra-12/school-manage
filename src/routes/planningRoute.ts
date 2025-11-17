import { Router } from "express";
import {
  createPlanning,
  getAllPlannings,
  getPlanningById,
  updatePlanning,
  deletePlanning,
  generateWeeklyPlanning,
} from "../controllers/planningController.js";

const router = Router();

router.post("/", createPlanning);
router.get("/", getAllPlannings);
router.get("/:id", getPlanningById);
router.put("/:id", updatePlanning);
router.delete("/:id", deletePlanning);

// Génération automatique d’un planning hebdomadaire
router.post("/generate", generateWeeklyPlanning);

export default router;
