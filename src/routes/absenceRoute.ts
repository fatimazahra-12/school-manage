import { Router } from "express";
import {
  getAllAbsences,
  getAbsenceById,
  createAbsence,
  updateAbsence,
  deleteAbsence,
} from "../controllers/absenceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const router = Router();

router.get("/", authMiddleware, getAllAbsences);
router.get("/:id",authMiddleware, getAbsenceById);
router.post("/", authMiddleware, createAbsence);
router.put("/:id", authMiddleware, updateAbsence);
router.delete("/:id", authMiddleware, deleteAbsence);

export default router;
