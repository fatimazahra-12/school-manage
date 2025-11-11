import { Router } from 'express';
import { authorize } from '../middlewares/authorize';
import {
  listFilieres, getFiliereById, createFiliere, updateFiliere, deleteFiliere
} from '../controllers/filiereController';

const r = Router();

r.get('/', authorize('FILIERE_READ'), listFilieres);
r.get('/:id', authorize('FILIERE_READ'), getFiliereById);
r.post('/', authorize('FILIERE_CREATE'), createFiliere);
r.put('/:id', authorize('FILIERE_UPDATE'), updateFiliere);
r.delete('/:id', authorize('FILIERE_DELETE'), deleteFiliere);

export default r;
