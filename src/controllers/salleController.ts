import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

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
