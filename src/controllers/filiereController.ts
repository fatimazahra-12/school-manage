import { Request, Response } from 'express';
import prisma from "../config/prisma.js";

export async function listFilieres(_req: Request, res: Response) {
  try {
    const data = await prisma.filiere.findMany({ orderBy: { id: 'asc' } });
    return res.json(data);
  } catch (err) {
    console.error('listFilieres error:', err);
    return res.status(500).json({ error: 'Failed to list filières' });
  }
}

export async function getFiliereById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.filiere.findUnique({ where: { id } });
    if (!data) return res.status(404).json({ error: 'Filière not found' });
    return res.json(data);
  } catch (err) {
    console.error('getFiliereById error:', err);
    return res.status(500).json({ error: 'Failed to fetch filière' });
  }
}

export async function createFiliere(req: Request, res: Response) {
  try {
    const { nom, code, description } = req.body as { nom?: string; code?: string; description?: string };
    if (!nom || !code) return res.status(400).json({ error: "'nom' and 'code' are required" });

    const created = await prisma.filiere.create({ data: { nom, code, description: description ?? null } });
    return res.status(201).json(created);
  } catch (err: any) {
    console.error('createFiliere error:', err);
    return res.status(500).json({ error: 'Failed to create filière', detail: err?.message });
  }
}

export async function updateFiliere(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.filiere.update({ where: { id }, data: req.body });
    return res.json(updated);
  } catch (err: any) {
    console.error('updateFiliere error:', err);
    return res.status(500).json({ error: 'Failed to update filière', detail: err?.message });
  }
}

export async function deleteFiliere(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.filiere.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    console.error('deleteFiliere error:', err);
    return res.status(500).json({ error: 'Failed to delete filière' });
  }
}

// Get filiere with all niveaux
export async function getFiliereWithNiveaux(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.filiere.findUnique({
      where: { id },
      include: {
        niveaux: {
          orderBy: { id: 'asc' },
        },
      },
    });
    if (!data) return res.status(404).json({ error: 'Filière not found' });
    return res.json(data);
  } catch (err: any) {
    console.error('getFiliereWithNiveaux error:', err);
    return res.status(500).json({ error: 'Failed to fetch filière with niveaux', detail: err?.message });
  }
}

// Get filiere with all groupes
export async function getFiliereWithGroupes(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.filiere.findUnique({
      where: { id },
      include: {
        groupes: {
          include: { niveau: true },
          orderBy: { id: 'asc' },
        },
      },
    });
    if (!data) return res.status(404).json({ error: 'Filière not found' });
    return res.json(data);
  } catch (err: any) {
    console.error('getFiliereWithGroupes error:', err);
    return res.status(500).json({ error: 'Failed to fetch filière with groupes', detail: err?.message });
  }
}

// Get filiere statistics
export async function getFiliereStats(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const filiere = await prisma.filiere.findUnique({ where: { id } });
    if (!filiere) return res.status(404).json({ error: 'Filière not found' });

    // Count related entities
    const [niveauxCount, groupesCount, modulesCount, etudiantsCount] = await Promise.all([
      prisma.niveau.count({ where: { filiereId: id } }),
      prisma.groupe.count({ where: { filiere_id: id } }),
      prisma.module.count({ where: { filiere_id: id } }),
      prisma.user.count({
        where: {
          groupe: {
            filiere_id: id,
          },
        },
      }),
    ]);

    return res.json({
      filiere: {
        id: filiere.id,
        nom: filiere.nom,
        code: filiere.code,
        description: filiere.description,
      },
      statistics: {
        total_niveaux: niveauxCount,
        total_groupes: groupesCount,
        total_modules: modulesCount,
        total_etudiants: etudiantsCount,
      },
    });
  } catch (err: any) {
    console.error('getFiliereStats error:', err);
    return res.status(500).json({ error: 'Failed to fetch filière stats', detail: err?.message });
  }
}

// Search filieres by keyword (nom or code)
export async function searchFilieres(req: Request, res: Response) {
  try {
    const { keyword } = req.query;
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ error: 'Keyword query parameter is required' });
    }

    const data = await prisma.filiere.findMany({
      where: {
        OR: [
          { nom: { contains: keyword, mode: 'insensitive' } },
          { code: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      orderBy: { id: 'asc' },
    });
    return res.json(data);
  } catch (err: any) {
    console.error('searchFilieres error:', err);
    return res.status(500).json({ error: 'Failed to search filières', detail: err?.message });
  }
}

// Get all filieres with detailed information (modules, groupes, niveaux)
export async function getAllFilieresDetailed(req: Request, res: Response) {
  try {
    const data = await prisma.filiere.findMany({
      include: {
        niveaux: {
          orderBy: { id: 'asc' },
        },
        groupes: {
          include: { niveau: true },
          orderBy: { id: 'asc' },
        },
        modules: {
          include: {
            enseignant: {
              select: { id: true, nom: true, email: true },
            },
          },
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });
    return res.json(data);
  } catch (err: any) {
    console.error('getAllFilieresDetailed error:', err);
    return res.status(500).json({ error: 'Failed to fetch detailed filières', detail: err?.message });
  }
}
