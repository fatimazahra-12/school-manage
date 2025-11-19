import { Router } from 'express';
import { listSalles, getSalleById, createSalle, updateSalle, deleteSalle } from "../controllers/salleController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const r = Router();

r.get('/', authMiddleware, checkPermission("SALLE_VIEW"), listSalles);
r.get('/:id', authMiddleware, checkPermission("SALLE_VIEW"), getSalleById);
r.post('/', authMiddleware, checkPermission("SALLE_MANAGE"), createSalle);
r.put('/:id', authMiddleware, checkPermission("SALLE_MANAGE"), updateSalle);
r.delete('/:id', authMiddleware, checkPermission("SALLE_MANAGE"), deleteSalle);

export default r;
