import { Router } from "express";
import { NoteController } from "../controllers/noteController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/", checkPermission("NOTE_MANAGE"), NoteController.create);
router.get("/", checkPermission("NOTE_VIEW"), NoteController.getAll);
router.get("/:id", checkPermission("NOTE_VIEW"), NoteController.getById);
router.put("/:id", checkPermission("NOTE_MANAGE"), NoteController.update);
router.delete("/:id", checkPermission("NOTE_MANAGE"), NoteController.delete);

export default router;
