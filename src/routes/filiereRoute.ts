import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  listFilieres, getFiliereById, createFiliere, updateFiliere, deleteFiliere,
} from "../controllers/filiereController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const r = Router();

r.get('/', authMiddleware, checkPermission("FILIERE_VIEW"), listFilieres);
r.get('/:id', authMiddleware, checkPermission("FILIERE_VIEW"), getFiliereById);
r.post('/', authMiddleware, checkPermission("FILIERE_MANAGE"), createFiliere);
r.put('/:id', authMiddleware, checkPermission("FILIERE_MANAGE"), updateFiliere);
r.delete('/:id', authMiddleware, checkPermission("FILIERE_MANAGE"), deleteFiliere);

export default r;
