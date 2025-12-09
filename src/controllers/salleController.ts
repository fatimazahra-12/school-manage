import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export async function listSalles(_req: Request, res: Response) {
  try {
    const data = await prisma.salle.findMany({ orderBy: { id: 'asc' } });
    return res.json(data);
  } catch (err) {
    console.error('listSalles error:', err);
    return res.status(500).json({ error: 'Failed to list salles' });
  }
}

export async function getSalleById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.salle.findUnique({ where: { id } });
    if (!data) return res.status(404).json({ error: 'Salle not found' });
    return res.json(data);
  } catch (err) {
    console.error('getSalleById error:', err);
    return res.status(500).json({ error: 'Failed to fetch salle' });
  }
}

export async function createSalle(req: Request, res: Response) {
  try {
    // expects: nom, capacite, type, disponible?
    const { nom, capacite, type, disponible } = req.body as {
      nom?: string; capacite?: number; type?: string; disponible?: boolean;
    };
    if (!nom || typeof nom !== 'string') return res.status(400).json({ error: "Field 'nom' required" });
    if (capacite === undefined || capacite === null || Number.isNaN(Number(capacite)))
      return res.status(400).json({ error: "Field 'capacite' (number) required" });
    if (!type || typeof type !== 'string') return res.status(400).json({ error: "Field 'type' required" });

    const created = await prisma.salle.create({
      data: { nom, capacite: Number(capacite), type, disponible: disponible ?? true },
    });
    return res.status(201).json(created);
  } catch (err: any) {
    console.error('createSalle error:', err);
    return res.status(500).json({ error: 'Failed to create salle', detail: err?.message });
  }
}

export async function updateSalle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.salle.update({ where: { id }, data: req.body });
    return res.json(updated);
  } catch (err) {
    console.error('updateSalle error:', err);
    return res.status(500).json({ error: 'Failed to update salle' });
  }
}

export async function deleteSalle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.salle.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    console.error('deleteSalle error:', err);
    return res.status(500).json({ error: 'Failed to delete salle' });
  }
}

// Get available salles for a specific time slot
export async function getSalleDispo(req: Request, res: Response) {
  try {
    const { date, heure_debut, heure_fin } = req.query;

    if (!date || !heure_debut || !heure_fin) {
      return res.status(400).json({
        error: 'date, heure_debut, and heure_fin query parameters are required'
      });
    }

    // Parse the date and times
    const dateObj = new Date(date as string);
    const debutObj = new Date(heure_debut as string);
    const finObj = new Date(heure_fin as string);

    if (isNaN(dateObj.getTime()) || isNaN(debutObj.getTime()) || isNaN(finObj.getTime())) {
      return res.status(400).json({ error: 'Invalid date or time format' });
    }

    // Find all cours that overlap with the requested time slot on the given date
    const occupiedCours = await prisma.cours.findMany({
      where: {
        date_cours: {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lt: new Date(dateObj.setHours(23, 59, 59, 999)),
        },
        AND: [
          { heure_debut: { lt: finObj } },
          { heure_fin: { gt: debutObj } },
        ],
      },
      select: { salle_id: true },
    });

    const occupiedSalleIds = occupiedCours.map(c => c.salle_id);

    // Get all salles that are NOT in the occupied list
    const availableSalles = await prisma.salle.findMany({
      where: {
        id: { notIn: occupiedSalleIds },
        disponible: true,
      },
      orderBy: { id: 'asc' },
    });

    return res.json(availableSalles);
  } catch (err) {
    console.error('getSalleDispo error:', err);
    return res.status(500).json({ error: 'Failed to fetch available salles' });
  }
}

// Search salles by keyword (nom)
export async function searchSalles(req: Request, res: Response) {
  try {
    const { keyword } = req.query;
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ error: 'Keyword query parameter is required' });
    }

    const data = await prisma.salle.findMany({
      where: {
        nom: { contains: keyword, mode: 'insensitive' },
      },
      orderBy: { id: 'asc' },
    });
    return res.json(data);
  } catch (err) {
    console.error('searchSalles error:', err);
    return res.status(500).json({ error: 'Failed to search salles' });
  }
}

// Get all salles of a specific type
export async function getSallesByType(req: Request, res: Response) {
  try {
    const type = req.params.type;
    if (!type) {
      return res.status(400).json({ error: 'type parameter is required' });
    }

    const data = await prisma.salle.findMany({
      where: { type },
      orderBy: { id: 'asc' },
    });
    return res.json(data);
  } catch (err) {
    console.error('getSallesByType error:', err);
    return res.status(500).json({ error: 'Failed to fetch salles by type' });
  }
}
