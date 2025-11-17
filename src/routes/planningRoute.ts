import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { listPlanning, createPlanning, deletePlanning } from "../controllers/planningController.js";

const r = Router();

r.get('/', checkPermission("PLANNING_VIEW"), listPlanning);
r.post('/', checkPermission("PLANNING_MANAGE"), createPlanning);
r.delete('/:id', checkPermission("PLANNING_MANAGE"), deletePlanning);

export default r;
