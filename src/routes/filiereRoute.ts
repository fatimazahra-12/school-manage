import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  listFilieres, getFiliereById, createFiliere, updateFiliere, deleteFiliere,
} from "../controllers/filiereController.js";

const r = Router();

r.get('/', checkPermission("FILIERE_VIEW"), listFilieres);
r.get('/:id', checkPermission("FILIERE_VIEW"), getFiliereById);
r.post('/', checkPermission("FILIERE_MANAGE"), createFiliere);
r.put('/:id', checkPermission("FILIERE_MANAGE"), updateFiliere);
r.delete('/:id', checkPermission("FILIERE_MANAGE"), deleteFiliere);

export default r;
