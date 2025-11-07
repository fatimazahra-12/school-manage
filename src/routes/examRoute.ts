import { Router } from "express";
import { ExamenController } from "../controllers/examController.js";

const router = Router();

router.post("/", ExamenController.create);
router.get("/", ExamenController.getAll);
router.get("/:id", ExamenController.getById);
router.put("/:id", ExamenController.update);
router.delete("/:id", ExamenController.delete);

export default router;
