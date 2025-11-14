import { Router } from 'express';
import { authorize } from '../middlewares/authorize';
import {
  listCours,
  getCoursById,
  createCours,
  updateCours,
  deleteCours,
} from '../controllers/coursController';

const r = Router();

r.get('/', authorize('COURS_READ'), listCours);
r.get('/:id', authorize('COURS_READ'), getCoursById);
r.post('/', authorize('COURS_CREATE'), createCours);
r.put('/:id', authorize('COURS_UPDATE'), updateCours);
r.delete('/:id', authorize('COURS_DELETE'), deleteCours);

export default r;
