import express from 'express';
import {
  getAllNiveaux,
  getNiveauById,
  createNiveau,
  updateNiveau,
  deleteNiveau
} from "../controllers/niveauController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { checkPermission } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllNiveaux);
router.get('/:id', authMiddleware, getNiveauById);
router.post('/', authMiddleware, createNiveau);
router.put('/:id', authMiddleware, updateNiveau);
router.delete('/:id', authMiddleware, deleteNiveau);

export default router;
