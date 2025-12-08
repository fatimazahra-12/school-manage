import express from 'express';
import {
  getAllNiveaux,
  getNiveauById,
  createNiveau,
  updateNiveau,
  deleteNiveau,
  getNiveauxByFiliere,
  getNiveauWithGroupes,
  searchNiveaux
} from "../controllers/niveauController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { checkPermission } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/search', authMiddleware, checkPermission('NIVEAUX_VIEW'), searchNiveaux);
router.get('/filiere/:filiere_id', authMiddleware, checkPermission('NIVEAUX_VIEW'), getNiveauxByFiliere);
router.get('/:id/groupes', authMiddleware, checkPermission('NIVEAUX_VIEW'), getNiveauWithGroupes);

router.get('/', authMiddleware, checkPermission('NIVEAUX_VIEW'), getAllNiveaux);
router.get('/:id', authMiddleware, checkPermission('NIVEAUX_VIEW'), getNiveauById);
router.post('/', authMiddleware, checkPermission('NIVEAUX_MANAGE'), createNiveau);
router.put('/:id', authMiddleware, checkPermission('NIVEAUX_MANAGE'), updateNiveau);
router.delete('/:id', authMiddleware, checkPermission('NIVEAUX_MANAGE'), deleteNiveau);

export default router;
