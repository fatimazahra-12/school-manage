import { Router } from 'express';
import { authorize } from '../middlewares/authorize';
import {
  listGroupes, getGroupeById, createGroupe, updateGroupe, deleteGroupe,
} from '../controllers/groupeController';

const r = Router();

r.get('/', authorize('GROUPE_READ'), listGroupes);
r.get('/:id', authorize('GROUPE_READ'), getGroupeById);
r.post('/', authorize('GROUPE_CREATE'), createGroupe);
r.put('/:id', authorize('GROUPE_UPDATE'), updateGroupe);
r.delete('/:id', authorize('GROUPE_DELETE'), deleteGroupe);

export default r;
