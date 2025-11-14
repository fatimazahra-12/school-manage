import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export async function listGroupes(_req: Request, res: Response) {
  try {
    const data = await prisma.groupe.findMany({ orderBy: { id: 'asc' } });
    return res.json(data);
  } catch (err) {
    console.error('listGroupes error:', err);
    return res.status(500).json({ error: 'Failed to list groupes' });
  }
}

export async function getGroupeById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.groupe.findUnique({ where: { id } });
    if (!data) return res.status(404).json({ error: 'Groupe not found' });
    return res.json(data);
  } catch (err) {
    console.error('getGroupeById error:', err);
    return res.status(500).json({ error: 'Failed to fetch groupe' });
  }
}

export async function createGroupe(req: Request, res: Response) {
  try {
    let { nom, niveau, annee, filiere_id } = req.body as {
      nom?: string; niveau?: string; annee?: string | number; filiere_id?: number | string;
    };

    if (!nom || typeof nom !== 'string') return res.status(400).json({ error: "Field 'nom' (string) is required" });
    if (!niveau || typeof niveau !== 'string')
      return res.status(400).json({ error: "Field 'niveau' (string) is required" });

    if (annee === undefined || annee === null)
      return res.status(400).json({ error: "Field 'annee' (string) is required" });
    const anneeStr = String(annee);

    const filiereIdNum = Number(filiere_id);
    if (!Number.isInteger(filiereIdNum))
      return res.status(400).json({ error: "Field 'filiere_id' (integer) is required" });

    const filiere = await prisma.filiere.findUnique({ where: { id: filiereIdNum } });
    if (!filiere) return res.status(404).json({ error: `Filiere ${filiereIdNum} not found` });

    const created = await prisma.groupe.create({
      data: { nom, niveau, annee: anneeStr, filiere_id: filiereIdNum },
    });

    return res.status(201).json(created);
  } catch (err: any) {
    console.error('createGroupe error:', err);
    return res.status(500).json({ error: 'Failed to create groupe', detail: err?.message });
  }
}

export async function updateGroupe(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.groupe.update({ where: { id }, data: req.body });
    return res.json(updated);
  } catch (err) {
    console.error('updateGroupe error:', err);
    return res.status(500).json({ error: 'Failed to update groupe' });
  }
}

export async function deleteGroupe(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await prisma.groupe.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    console.error('deleteGroupe error:', err);
    return res.status(500).json({ error: 'Failed to delete groupe' });
  }
}
