import express from 'express';
import {
  getAllNiveaux,
  getNiveauById,
  createNiveau,
  updateNiveau,
  deleteNiveau
} from "../controllers/niveauController.js";

const router = express.Router();

router.get('/', getAllNiveaux);
router.get('/:id', getNiveauById);
router.post('/', createNiveau);
router.put('/:id', updateNiveau);
router.delete('/:id', deleteNiveau);

export default router;
