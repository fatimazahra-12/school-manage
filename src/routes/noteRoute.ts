import { Router } from "express";
import { NoteController } from "../controllers/noteController.js";

const router = Router();

// CRUD routes
router.post("/", NoteController.create);
router.get("/", NoteController.getAll);
router.get("/:id", NoteController.getById);
router.put("/:id", NoteController.update);
router.delete("/:id", NoteController.delete);

// GET notes by etudiant
router.get("/etudiant/:etudiant_id", NoteController.getNotesByEtudiant);

// GET notes by examen
router.get("/examen/:examen_id", NoteController.getNotesByExamen);

// GET moyenne d'un etudiant dans un module
router.get("/moyenne/:etudiant_id/:module_id", NoteController.getMoyenneModule);

// GET resultats by module
router.get("/module/:module_id", NoteController.getResultatsByModule);

// GET bulletin (toutes les notes d'un etudiant)
router.get("/bulletin/:etudiant_id", NoteController.getBulletin);

export default router;
