import { Router } from "express";
import { ExamenController } from "../controllers/examController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, checkPermission("EXAM_MANAGE"), ExamenController.create);
router.get("/", authMiddleware, checkPermission("EXAM_VIEW"), ExamenController.getAll);
router.get("/:id", authMiddleware, checkPermission("EXAM_VIEW"), ExamenController.getById);
router.put("/:id", authMiddleware, checkPermission("EXAM_MANAGE"), ExamenController.update);
router.delete("/:id", authMiddleware, checkPermission("EXAM_MANAGE"), ExamenController.delete);

export default router;
