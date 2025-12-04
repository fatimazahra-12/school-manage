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

export default router;
