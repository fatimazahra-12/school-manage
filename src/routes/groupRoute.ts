import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  listGroupes, getGroupeById, createGroupe, updateGroupe, deleteGroupe,
} from "../controllers/groupeController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const r = Router();

r.get('/', authMiddleware, checkPermission("GROUPE_VIEW"), listGroupes);
r.get('/:id', authMiddleware, checkPermission("GROUPE_VIEW"), getGroupeById);
r.post('/', authMiddleware, checkPermission("GROUPE_MANAGE"), createGroupe);
r.put('/:id', authMiddleware, checkPermission("GROUPE_MANAGE"), updateGroupe);
r.delete('/:id', authMiddleware, checkPermission("GROUPE_MANAGE"), deleteGroupe);

export default r;
