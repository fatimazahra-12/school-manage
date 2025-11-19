import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  listCours,
  getCoursById,
  createCours,
  updateCours,
  deleteCours,
} from "../controllers/coursController.js";

const r = Router();

r.get('/', checkPermission("CLASSE_VIEW"), listCours);
r.get('/:id', checkPermission("CLASSE_VIEW"), getCoursById);
r.post('/', checkPermission("CLASSE_MANAGE"), createCours);
r.put('/:id', checkPermission("CLASSE_MANAGE"), updateCours);
r.delete('/:id', checkPermission("CLASSE_MANAGE"), deleteCours);

export default r;
