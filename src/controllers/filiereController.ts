import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export async function listFilieres(_req: Request, res: Response) {
  try {
    const data = await prisma.filiere.findMany();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list filieres' });
  }
}

export async function getFiliereById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.filiere.findUnique({ where: { id } });
    if (!data) return res.status(404).json({ error: 'Filiere not found' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get filiere' });
  }
}

export async function createFiliere(req: Request, res: Response) {
  try {
    const { nom, code, description } = req.body;
    const created = await prisma.filiere.create({ data: { nom, code, description } });
    return res.status(201).json(created);
  } catch (err) {
    console.error('createFiliere error:', err);
    return res.status(500).json({ error: 'Failed to create filiere' });
  }
}

export async function updateFiliere(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nom, code, description } = req.body;
    const updated = await prisma.filiere.update({ where: { id }, data: { nom, code, description } });
    return res.json(updated);
  } catch (err) {
    console.error('updateFiliere error:', err);
    return res.status(500).json({ error: 'Failed to update filiere' });
  }
}

export async function deleteFiliere(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.filiere.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete filiere' });
  }
}
