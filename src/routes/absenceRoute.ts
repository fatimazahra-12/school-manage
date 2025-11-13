import { Router } from "express";
import {
  getAllAbsences,
  getAbsenceById,
  createAbsence,
  updateAbsence,
  deleteAbsence,
} from "../controllers/absenceController.js";


const router = Router();

router.get("/", getAllAbsences);
router.get("/:id", getAbsenceById);
router.post("/", createAbsence);
router.put("/:id", updateAbsence);
router.delete("/:id", deleteAbsence);

export default router;
