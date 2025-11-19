import { Router } from 'express';
import { checkPermission } from '../middlewares/roleMiddleware';
import {
  listPlanning,
  getPlanning,
  createPlanning,
  updatePlanning,
  deletePlanning,
} from '../controllers/planningController';

const router = Router();

router.get('/', checkPermission('PLANNING_VIEW'), listPlanning);
router.get('/:id', checkPermission('PLANNING_VIEW'), getPlanning);
router.post('/', checkPermission('PLANNING_MANAGE'), createPlanning);
router.put('/:id', checkPermission('PLANNING_MANAGE'), updatePlanning);
router.delete('/:id', checkPermission('PLANNING_MANAGE'), deletePlanning);

export default router;
