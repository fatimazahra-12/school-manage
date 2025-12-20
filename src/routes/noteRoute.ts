import { Router } from "express";
import { NoteController } from "../controllers/noteController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, checkPermission("NOTE_MANAGE"), NoteController.create);
router.get("/", authMiddleware, checkPermission("NOTE_VIEW"), NoteController.getAll);
router.get("/:id", authMiddleware, checkPermission("NOTE_VIEW"), NoteController.getById);
router.put("/:id", authMiddleware, checkPermission("NOTE_MANAGE"), NoteController.update);
router.delete("/:id", authMiddleware, checkPermission("NOTE_MANAGE"), NoteController.delete);
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
