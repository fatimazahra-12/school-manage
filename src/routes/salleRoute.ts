import { Router } from 'express';
import { authorize } from '../middlewares/authorize';
import {
  listSalles, getSalleById, createSalle, updateSalle, deleteSalle,
} from '../controllers/salleController';

const r = Router();

r.get('/', authorize('SALLE_READ'), listSalles);
r.get('/:id', authorize('SALLE_READ'), getSalleById);
r.post('/', authorize('SALLE_CREATE'), createSalle);
r.put('/:id', authorize('SALLE_UPDATE'), updateSalle);
r.delete('/:id', authorize('SALLE_DELETE'), deleteSalle);

export default r;
