import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  listCours,
  getCoursById,
  createCours,
  updateCours,
  deleteCours,
} from "../controllers/coursController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const r = Router();

r.get('/', authMiddleware, checkPermission("CLASSE_VIEW"), listCours);
r.get('/:id', authMiddleware, checkPermission("CLASSE_VIEW"), getCoursById);
r.post('/', authMiddleware, checkPermission("CLASSE_MANAGE"), createCours);
r.put('/:id', authMiddleware, checkPermission("CLASSE_MANAGE"), updateCours);
r.delete('/:id', authMiddleware, checkPermission("CLASSE_MANAGE"), deleteCours);

export default r;
