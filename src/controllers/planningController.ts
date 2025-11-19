import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

// list all plannings
export async function listPlanning(_req: Request, res: Response) {
  try {
    const data = await prisma.planning.findMany({ orderBy: { id: 'asc' } });
    return res.json(data);
  } catch (err) {
    console.error('listPlanning error:', err);
    return res.status(500).json({ error: 'Failed to list planning' });
  }
}

// get one planning by id
export async function getPlanning(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid 'id' parameter" });
    }

    const planning = await prisma.planning.findUnique({ where: { id } });

    if (!planning) {
      return res.status(404).json({ error: `Planning ${id} not found` });
    }

    return res.json(planning);
  } catch (err) {
    console.error('getPlanning error:', err);
    return res.status(500).json({ error: 'Failed to get planning' });
  }
}

// create new planning
export async function createPlanning(req: Request, res: Response) {
  try {
    const { cours_id, jour, heure_debut, heure_fin } = req.body as any;

    if (!Number.isInteger(Number(cours_id))) {
      return res.status(400).json({ error: "Field 'cours_id' (int) required" });
    }
    if (!jour) {
      return res.status(400).json({ error: "Field 'jour' required" });
    }

    const cours = await prisma.cours.findUnique({
      where: { id: Number(cours_id) },
    });
    if (!cours) {
      return res.status(404).json({ error: `Cours ${cours_id} not found` });
    }

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
    return res
      .status(500)
      .json({ error: 'Failed to create planning', detail: err?.message });
  }
}

// update existing planning
export async function updatePlanning(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid 'id' parameter" });
    }

    const existing = await prisma.planning.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: `Planning ${id} not found` });
    }

    const { cours_id, jour, heure_debut, heure_fin } = req.body as any;

    if (!Number.isInteger(Number(cours_id))) {
      return res.status(400).json({ error: "Field 'cours_id' (int) required" });
    }
    if (!jour) {
      return res.status(400).json({ error: "Field 'jour' required" });
    }

    const cours = await prisma.cours.findUnique({
      where: { id: Number(cours_id) },
    });
    if (!cours) {
      return res.status(404).json({ error: `Cours ${cours_id} not found` });
    }

    const updated = await prisma.planning.update({
      where: { id },
      data: {
        cours_id: Number(cours_id),
        jour,
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
      },
    });

    return res.json(updated);
  } catch (err: any) {
    console.error('updatePlanning error:', err);
    return res
      .status(500)
      .json({ error: 'Failed to update planning', detail: err?.message });
  }
}

// delete planning
export async function deletePlanning(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid 'id' parameter" });
    }

    const existing = await prisma.planning.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: `Planning ${id} not found` });
    }

    await prisma.planning.delete({ where: { id } });
    return res.status(204).send();
  } catch (err: any) {
    console.error('deletePlanning error:', err);
    return res
      .status(500)
      .json({ error: 'Failed to delete planning', detail: err?.message });
  }
}
