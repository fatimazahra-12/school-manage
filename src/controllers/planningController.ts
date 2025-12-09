import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export async function listPlanning(_req: Request, res: Response) {
  try {
    const data = await prisma.planning.findMany({ orderBy: { id: 'asc' } });
    return res.json(data);
  } catch (err) {
    console.error('listPlanning error:', err);
    return res.status(500).json({ error: 'Failed to list planning' });
  }
}

export async function createPlanning(req: Request, res: Response) {
  try {
    const { cours_id, jour, heure_debut, heure_fin } = req.body as any;

    if (!Number.isInteger(Number(cours_id))) return res.status(400).json({ error: "Field 'cours_id' (int) required" });
    if (!jour) return res.status(400).json({ error: "Field 'jour' required" });

    const cours = await prisma.cours.findUnique({ where: { id: Number(cours_id) } });
    if (!cours) return res.status(404).json({ error: `Cours ${cours_id} not found` });

    const created = await prisma.planning.create({
      data: {
        cours_id: Number(cours_id),
        jour,
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
      },
    });

    return res.status(201).json(created);
  } catch (err: any) {
    console.error('createPlanning error:', err);
    return res.status(500).json({ error: 'Failed to create planning', detail: err?.message });
  }
}

export async function updatePlanning(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { cours_id, jour, heure_debut, heure_fin } = req.body as any;

    // Check if planning exists
    const existing = await prisma.planning.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: `Planning ${id} not found` });
    }

    // Validate cours_id if provided
    if (cours_id !== undefined) {
      if (!Number.isInteger(Number(cours_id))) {
        return res.status(400).json({ error: "Field 'cours_id' must be an integer" });
      }
      const cours = await prisma.cours.findUnique({ where: { id: Number(cours_id) } });
      if (!cours) {
        return res.status(404).json({ error: `Cours ${cours_id} not found` });
      }
    }

    // Build update data object with only provided fields
    const updateData: any = {};
    if (cours_id !== undefined) updateData.cours_id = Number(cours_id);
    if (jour !== undefined) updateData.jour = jour;
    if (heure_debut !== undefined) updateData.heure_debut = new Date(heure_debut);
    if (heure_fin !== undefined) updateData.heure_fin = new Date(heure_fin);

    const updated = await prisma.planning.update({
      where: { id },
      data: updateData,
    });

    return res.json(updated);
  } catch (err: any) {
    console.error('updatePlanning error:', err);
    return res.status(500).json({ error: 'Failed to update planning', detail: err?.message });
  }
}

export async function deletePlanning(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.planning.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    console.error('deletePlanning error:', err);
    return res.status(500).json({ error: 'Failed to delete planning' });
  }
}

// Get all planning entries for a specific cours
export async function getPlanningByCours(req: Request, res: Response) {
  try {
    const cours_id = Number(req.params.cours_id);
    const data = await prisma.planning.findMany({
      where: { cours_id },
      include: {
        cours: {
          include: {
            module: true,
            enseignant: { select: { id: true, nom: true, email: true } },
            salle: true,
            groupe: true,
          },
        },
      },
      orderBy: { jour: 'asc' },
    });
    return res.json(data);
  } catch (err: any) {
    console.error('getPlanningByCours error:', err);
    return res.status(500).json({ error: 'Failed to fetch planning by cours', detail: err?.message });
  }
}

// Get all planning for a specific day
export async function getPlanningByDay(req: Request, res: Response) {
  try {
    const jour = req.params.jour;
    if (!jour) {
      return res.status(400).json({ error: 'jour parameter is required' });
    }

    const data = await prisma.planning.findMany({
      where: { jour },
      include: {
        cours: {
          include: {
            module: true,
            enseignant: { select: { id: true, nom: true, email: true } },
            salle: true,
            groupe: true,
          },
        },
      },
      orderBy: { heure_debut: 'asc' },
    });
    return res.json(data);
  } catch (err: any) {
    console.error('getPlanningByDay error:', err);
    return res.status(500).json({ error: 'Failed to fetch planning by day', detail: err?.message });
  }
}

// Get planning for a specific groupe (via cours)
export async function getPlanningForGroupe(req: Request, res: Response) {
  try {
    const groupe_id = Number(req.params.groupe_id);

    // Get all cours for this groupe
    const cours = await prisma.cours.findMany({
      where: { groupe_id },
      select: { id: true },
    });

    const coursIds = cours.map(c => c.id);

    const data = await prisma.planning.findMany({
      where: {
        cours_id: { in: coursIds },
      },
      include: {
        cours: {
          include: {
            module: true,
            enseignant: { select: { id: true, nom: true, email: true } },
            salle: true,
            groupe: true,
          },
        },
      },
      orderBy: [{ jour: 'asc' }, { heure_debut: 'asc' }],
    });

    return res.json(data);
  } catch (err: any) {
    console.error('getPlanningForGroupe error:', err);
    return res.status(500).json({ error: 'Failed to fetch planning for groupe', detail: err?.message });
  }
}

// Get planning for a specific enseignant (via cours)
export async function getPlanningForEnseignant(req: Request, res: Response) {
  try {
    const enseignant_id = Number(req.params.enseignant_id);

    // Get all cours for this enseignant
    const cours = await prisma.cours.findMany({
      where: { enseignant_id },
      select: { id: true },
    });

    const coursIds = cours.map(c => c.id);

    const data = await prisma.planning.findMany({
      where: {
        cours_id: { in: coursIds },
      },
      include: {
        cours: {
          include: {
            module: true,
            enseignant: { select: { id: true, nom: true, email: true } },
            salle: true,
            groupe: true,
          },
        },
      },
      orderBy: [{ jour: 'asc' }, { heure_debut: 'asc' }],
    });

    return res.json(data);
  } catch (err: any) {
    console.error('getPlanningForEnseignant error:', err);
    return res.status(500).json({ error: 'Failed to fetch planning for enseignant', detail: err?.message });
  }
}

// Detect planning conflicts for a groupe
export async function detectPlanningConflict(req: Request, res: Response) {
  try {
    const { groupe_id, jour, heure_debut, heure_fin } = req.body;

    if (!groupe_id || !jour || !heure_debut || !heure_fin) {
      return res.status(400).json({
        error: 'groupe_id, jour, heure_debut, and heure_fin are required'
      });
    }

    const debutObj = new Date(heure_debut);
    const finObj = new Date(heure_fin);

    if (isNaN(debutObj.getTime()) || isNaN(finObj.getTime())) {
      return res.status(400).json({ error: 'Invalid time format' });
    }

    // Get all cours for this groupe
    const cours = await prisma.cours.findMany({
      where: { groupe_id: Number(groupe_id) },
      select: { id: true },
    });

    const coursIds = cours.map(c => c.id);

    // Find overlapping planning entries
    const conflicts = await prisma.planning.findMany({
      where: {
        cours_id: { in: coursIds },
        jour: jour,
        AND: [
          { heure_debut: { lt: finObj } },
          { heure_fin: { gt: debutObj } },
        ],
      },
      include: {
        cours: {
          include: {
            module: true,
            salle: true,
            groupe: true,
          },
        },
      },
    });

    return res.json({
      has_conflict: conflicts.length > 0,
      conflict_count: conflicts.length,
      conflicts: conflicts,
    });
  } catch (err: any) {
    console.error('detectPlanningConflict error:', err);
    return res.status(500).json({ error: 'Failed to detect planning conflicts', detail: err?.message });
  }
}
