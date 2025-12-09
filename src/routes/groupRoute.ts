import { Router } from 'express';
import { checkPermission } from "../middlewares/roleMiddleware.js";
import {
  listGroupes, getGroupeById, createGroupe, updateGroupe, deleteGroupe,
  getGroupesByFiliere, getGroupesByNiveau, getGroupeWithEtudiants,
  getGroupeWithCours, searchGroupes, countEtudiantsInGroupe, getGroupeStats
} from "../controllers/groupeController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const r = Router();

r.get('/', authMiddleware, checkPermission("GROUPE_VIEW"), listGroupes);
r.get('/:id', authMiddleware, checkPermission("GROUPE_VIEW"), getGroupeById);
r.post('/', authMiddleware, checkPermission("GROUPE_MANAGE"), createGroupe);
r.put('/:id', authMiddleware, checkPermission("GROUPE_MANAGE"), updateGroupe);
r.delete('/:id', authMiddleware, checkPermission("GROUPE_MANAGE"), deleteGroupe);
r.get('/search', authMiddleware, checkPermission("GROUPE_VIEW"), searchGroupes);
r.get('/filiere/:filiere_id', authMiddleware, checkPermission("GROUPE_VIEW"), getGroupesByFiliere);
r.get('/niveau/:niveau_id', authMiddleware, checkPermission("GROUPE_VIEW"), getGroupesByNiveau);
r.get('/:id/etudiants', authMiddleware, checkPermission("GROUPE_VIEW"), getGroupeWithEtudiants);
r.get('/:id/cours', authMiddleware, checkPermission("GROUPE_VIEW"), getGroupeWithCours);
r.get('/:id/count-etudiants', authMiddleware, checkPermission("GROUPE_VIEW"), countEtudiantsInGroupe);
r.get('/:id/stats', authMiddleware, checkPermission("GROUPE_VIEW"), getGroupeStats);

export default r;
