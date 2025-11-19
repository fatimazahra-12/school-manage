import { Router } from "express";
import { ExamenController } from "../controllers/examController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/", checkPermission("EXAM_MANAGE"), ExamenController.create);
router.get("/", checkPermission("EXAM_VIEW"), ExamenController.getAll);
router.get("/:id", checkPermission("EXAM_VIEW"), ExamenController.getById);
router.put("/:id", checkPermission("EXAM_MANAGE"), ExamenController.update);
router.delete("/:id", checkPermission("EXAM_MANAGE"), ExamenController.delete);

export default router;
