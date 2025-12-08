import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  listCours,
  getCoursById,
  createCours,
  updateCours,
  deleteCours,
  getCoursByGroupe,
  getCoursByEnseignant,
  getCoursByModule,
  getCoursOfDay,
  getCoursBetweenDates,
  detectCoursConflict
} from "../controllers/coursController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const r = Router();

// Specialized queries (before :id routes)
r.get('/groupe/:groupe_id', authMiddleware, checkPermission("CLASSE_VIEW"), getCoursByGroupe);
r.get('/enseignant/:enseignant_id', authMiddleware, checkPermission("CLASSE_VIEW"), getCoursByEnseignant);
r.get('/module/:module_id', authMiddleware, checkPermission("CLASSE_VIEW"), getCoursByModule);
r.get('/date/:date', authMiddleware, checkPermission("CLASSE_VIEW"), getCoursOfDay);
r.get('/between', authMiddleware, checkPermission("CLASSE_VIEW"), getCoursBetweenDates);

// Standard CRUD routes
r.get('/', authMiddleware, checkPermission("CLASSE_VIEW"), listCours);
r.get('/:id', authMiddleware, checkPermission("CLASSE_VIEW"), getCoursById);
r.post('/', authMiddleware, checkPermission("CLASSE_MANAGE"), createCours);
r.post('/detect-conflict', authMiddleware, checkPermission("CLASSE_VIEW"), detectCoursConflict);
r.put('/:id', authMiddleware, checkPermission("CLASSE_MANAGE"), updateCours);
r.delete('/:id', authMiddleware, checkPermission("CLASSE_MANAGE"), deleteCours);

export default r;
