import express from 'express';
import {
  getAllNiveaux,
  getNiveauById,
  createNiveau,
  updateNiveau,
  deleteNiveau
} from '../controllers/niveauController';

const router = express.Router();

// Base path: /api/niveaux
router.get('/', getAllNiveaux);
router.get('/:id', getNiveauById);
router.post('/', createNiveau);
router.put('/:id', updateNiveau);
router.delete('/:id', deleteNiveau);

export default router;
