import { Router } from 'express';
import {
  listPlanning,
  getPlanning,
  createPlanning,
  updatePlanning,
  deletePlanning,
} from '../controllers/planningController';

const router = Router();

router.get('/', listPlanning);
router.get('/:id', getPlanning);
router.post('/', createPlanning);
router.put('/:id', updatePlanning);
router.delete('/:id', deletePlanning);

export default router;
