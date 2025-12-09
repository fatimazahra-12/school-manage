import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  listFilieres, getFiliereById, createFiliere, updateFiliere, deleteFiliere,
  getFiliereWithNiveaux, getFiliereWithGroupes, getFiliereStats,
  searchFilieres, getAllFilieresDetailed
} from "../controllers/filiereController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const r = Router();

r.get('/', authMiddleware, checkPermission("FILIERE_VIEW"), listFilieres);
r.get('/:id', authMiddleware, checkPermission("FILIERE_VIEW"), getFiliereById);
r.post('/', authMiddleware, checkPermission("FILIERE_MANAGE"), createFiliere);
r.put('/:id', authMiddleware, checkPermission("FILIERE_MANAGE"), updateFiliere);
r.delete('/:id', authMiddleware, checkPermission("FILIERE_MANAGE"), deleteFiliere);
r.get('/search', authMiddleware, checkPermission("FILIERE_VIEW"), searchFilieres);
r.get('/detailed', authMiddleware, checkPermission("FILIERE_VIEW"), getAllFilieresDetailed);
r.get('/:id/niveaux', authMiddleware, checkPermission("FILIERE_VIEW"), getFiliereWithNiveaux);
r.get('/:id/groupes', authMiddleware, checkPermission("FILIERE_VIEW"), getFiliereWithGroupes);
r.get('/:id/stats', authMiddleware, checkPermission("FILIERE_VIEW"), getFiliereStats);

export default r;
