import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { listPlanning, createPlanning, deletePlanning } from "../controllers/planningController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const r = Router();

r.get('/', authMiddleware, checkPermission("PLANNING_VIEW"), listPlanning);
r.post('/', authMiddleware, checkPermission("PLANNING_MANAGE"), createPlanning);
r.delete('/:id', authMiddleware, checkPermission("PLANNING_MANAGE"), deletePlanning);

export default r;
