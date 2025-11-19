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
