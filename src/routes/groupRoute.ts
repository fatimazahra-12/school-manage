import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  listGroupes, getGroupeById, createGroupe, updateGroupe, deleteGroupe,
} from "../controllers/groupeController.js";

const r = Router();

r.get('/', checkPermission("GROUPE_VIEW"), listGroupes);
r.get('/:id', checkPermission("GROUPE_VIEW"), getGroupeById);
r.post('/', checkPermission("GROUPE_MANAGE"), createGroupe);
r.put('/:id', checkPermission("GROUPE_MANAGE"), updateGroupe);
r.delete('/:id', checkPermission("GROUPE_MANAGE"), deleteGroupe);

export default r;
