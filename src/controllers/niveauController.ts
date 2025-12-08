import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

/**
 * Get all niveaux
 */
export const getAllNiveaux = async (req: Request, res: Response) => {
  try {
    const niveaux = await prisma.niveau.findMany({
      include: { filiere: true },
      orderBy: { id: 'asc' },
    });
    res.json(niveaux);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch niveaux', details: error });
  }
};

/**
 * Get one niveau by ID
 */
export const getNiveauById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const niveau = await prisma.niveau.findUnique({
      where: { id: Number(id) },
      include: { filiere: true },
    });
    if (!niveau) return res.status(404).json({ message: 'Niveau not found' });
    res.json(niveau);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch niveau', details: error });
  }
};

/**
 * Create new niveau
 */
export const createNiveau = async (req: Request, res: Response) => {
  const { code, label, filiereId } = req.body;
  try {
    const niveau = await prisma.niveau.create({
      data: { code, label, filiereId: filiereId ? Number(filiereId) : null },
    });
    res.status(201).json(niveau);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create niveau', details: error });
  }
};

/**
 * Update an existing niveau
 */
export const updateNiveau = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, label, filiereId } = req.body;
  try {
    const updated = await prisma.niveau.update({
      where: { id: Number(id) },
      data: { code, label, filiereId: filiereId ? Number(filiereId) : null },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update niveau', details: error });
  }
};

/**
 * Delete a niveau
 */
export const deleteNiveau = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.niveau.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete niveau', details: error });
  }
};

/**
 * Get all niveaux for a specific filiere
 */
export const getNiveauxByFiliere = async (req: Request, res: Response) => {
  const { filiere_id } = req.params;
  try {
    const niveaux = await prisma.niveau.findMany({
      where: { filiereId: Number(filiere_id) },
      include: { filiere: true, groupes: true },
      orderBy: { id: 'asc' },
    });
    res.json(niveaux);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch niveaux by filiere', details: error });
  }
};

/**
 * Get niveau with all associated groupes
 */
export const getNiveauWithGroupes = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const niveau = await prisma.niveau.findUnique({
      where: { id: Number(id) },
      include: {
        filiere: true,
        groupes: {
          include: {
            filiere: true,
          },
        },
      },
    });
    if (!niveau) return res.status(404).json({ message: 'Niveau not found' });
    res.json(niveau);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch niveau with groupes', details: error });
  }
};

/**
 * Search niveaux by keyword (code or label)
 */
export const searchNiveaux = async (req: Request, res: Response) => {
  const { keyword } = req.query;
  try {
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ error: 'Keyword query parameter is required' });
    }

    const niveaux = await prisma.niveau.findMany({
      where: {
        OR: [
          { code: { contains: keyword, mode: 'insensitive' } },
          { label: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      include: { filiere: true },
      orderBy: { id: 'asc' },
    });
    res.json(niveaux);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search niveaux', details: error });
  }
};
