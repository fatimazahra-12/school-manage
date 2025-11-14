import { Router } from 'express';
import { authorize } from '../middlewares/authorize';
import {
  listPlanning, createPlanning, deletePlanning,
} from '../controllers/planningController';

const r = Router();

r.get('/', authorize('PLANNING_READ'), listPlanning);
r.post('/', authorize('PLANNING_CREATE'), createPlanning);
r.delete('/:id', authorize('PLANNING_DELETE'), deletePlanning);

export default r;
