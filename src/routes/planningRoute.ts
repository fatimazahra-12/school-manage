import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import { listPlanning, createPlanning, deletePlanning,
    getPlanningByCours, getPlanningByDay, getPlanningForGroupe,
    getPlanningForEnseignant, detectPlanningConflict } from "../controllers/planningController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const r = Router();

r.get('/', authMiddleware, checkPermission("PLANNING_VIEW"), listPlanning);
r.post('/', authMiddleware, checkPermission("PLANNING_MANAGE"), createPlanning);
r.delete('/:id', authMiddleware, checkPermission("PLANNING_MANAGE"), deletePlanning);
r.get('/cours/:cours_id', authMiddleware, checkPermission("PLANNING_VIEW"), getPlanningByCours);
r.get('/jour/:jour', authMiddleware, checkPermission("PLANNING_VIEW"), getPlanningByDay);
r.get('/groupe/:groupe_id', authMiddleware, checkPermission("PLANNING_VIEW"), getPlanningForGroupe);
r.get('/enseignant/:enseignant_id', authMiddleware, checkPermission("PLANNING_VIEW"), getPlanningForEnseignant);
r.post('/detect-conflict', authMiddleware, checkPermission("PLANNING_VIEW"), detectPlanningConflict);

export default r;
