import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

// List all groupes

export async function listGroupes(_req: Request, res: Response) {
  try {
    const data = await prisma.groupe.findMany({
      include: { filiere: true, niveau: true },
      orderBy: { id: 'asc' },
    });
    return res.json(data);
  } catch (err) {
    console.error('listGroupes error:', err);
    return res.status(500).json({ error: 'Failed to list groupes' });
  }
}

// Get one groupe by ID

export async function getGroupeById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.groupe.findUnique({
      where: { id },
      include: { filiere: true, niveau: true },
    });
    if (!data) return res.status(404).json({ error: 'Groupe not found' });
    return res.json(data);
  } catch (err) {
    console.error('getGroupeById error:', err);
    return res.status(500).json({ error: 'Failed to fetch groupe' });
  }
}

// Create a new groupe

export async function createGroupe(req: Request, res: Response) {
  try {
    let { nom, annee, filiere_id, niveauId } = req.body as {
      nom?: string;
      annee?: string | number;
      filiere_id?: number | string;
      niveauId?: number | string;
    };

    // Validation
    if (!nom || typeof nom !== 'string')
      return res.status(400).json({ error: "Field 'nom' (string) is required" });

    if (annee === undefined || annee === null)
      return res.status(400).json({ error: "Field 'annee' (string) is required" });
    const anneeStr = String(annee);

    const filiereIdNum = Number(filiere_id);
    if (!Number.isInteger(filiereIdNum))
      return res.status(400).json({ error: "Field 'filiere_id' (integer) is required" });

    // Optional niveau
    const niveauIdNum = niveauId ? Number(niveauId) : null;
    if (niveauId !== undefined && isNaN(Number(niveauId)))
      return res.status(400).json({ error: "Field 'niveauId' must be an integer" });

    // Check related entities
    const filiere = await prisma.filiere.findUnique({ where: { id: filiereIdNum } });
    if (!filiere) return res.status(404).json({ error: `Filiere ${filiereIdNum} not found` });

    if (niveauIdNum) {
      const niveau = await prisma.niveau.findUnique({ where: { id: niveauIdNum } });
      if (!niveau) return res.status(404).json({ error: `Niveau ${niveauIdNum} not found` });
    }

    // Create groupe
    const created = await prisma.groupe.create({
      data: {
        nom,
        annee: anneeStr,
        filiere_id: filiereIdNum,
        niveauId: niveauIdNum,
      },
      include: { filiere: true, niveau: true },
    });

    return res.status(201).json(created);
  } catch (err: any) {
    console.error('createGroupe error:', err);
    return res.status(500).json({ error: 'Failed to create groupe', detail: err?.message });
  }
}

// Update groupe

export async function updateGroupe(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nom, annee, filiere_id, niveauId } = req.body;

    const dataToUpdate: Partial<{
      nom: string;
      annee: string;
      filiere_id: number;
      niveauId: number | null;
    }> = {};

    if (nom !== undefined) dataToUpdate.nom = nom;
    if (annee !== undefined) dataToUpdate.annee = String(annee);
    if (filiere_id !== undefined) dataToUpdate.filiere_id = Number(filiere_id);
    if (niveauId !== undefined) dataToUpdate.niveauId = niveauId ? Number(niveauId) : null;

    const updated = await prisma.groupe.update({
      where: { id },
      data: dataToUpdate,
      include: { filiere: true, niveau: true },
    });

    return res.json(updated);
  } catch (err) {
    console.error('updateGroupe error:', err);
    return res.status(500).json({ error: 'Failed to update groupe' });
  }
}

// Delete groupe

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

// Get all groupes for a specific filiere
export async function getGroupesByFiliere(req: Request, res: Response) {
  try {
    const filiere_id = Number(req.params.filiere_id);
    const data = await prisma.groupe.findMany({
      where: { filiere_id },
      include: { filiere: true, niveau: true },
      orderBy: { id: 'asc' },
    });
    return res.json(data);
  } catch (err) {
    console.error('getGroupesByFiliere error:', err);
    return res.status(500).json({ error: 'Failed to fetch groupes by filiere' });
  }
}

// Get all groupes for a specific niveau
export async function getGroupesByNiveau(req: Request, res: Response) {
  try {
    const niveau_id = Number(req.params.niveau_id);
    const data = await prisma.groupe.findMany({
      where: { niveauId: niveau_id },
      include: { filiere: true, niveau: true },
      orderBy: { id: 'asc' },
    });
    return res.json(data);
  } catch (err) {
    console.error('getGroupesByNiveau error:', err);
    return res.status(500).json({ error: 'Failed to fetch groupes by niveau' });
  }
}

// Get groupe with all students (etudiants)
export async function getGroupeWithEtudiants(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.groupe.findUnique({
      where: { id },
      include: {
        filiere: true,
        niveau: true,
        etudiants: {
          select: {
            id: true,
            nom: true,
            email: true,
            is_active: true,
            role: true,
          },
        },
      },
    });
    if (!data) return res.status(404).json({ error: 'Groupe not found' });
    return res.json(data);
  } catch (err) {
    console.error('getGroupeWithEtudiants error:', err);
    return res.status(500).json({ error: 'Failed to fetch groupe with etudiants' });
  }
}

// Get groupe with all cours
export async function getGroupeWithCours(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.groupe.findUnique({
      where: { id },
      include: {
        filiere: true,
        niveau: true,
        cours: {
          include: {
            module: true,
            enseignant: {
              select: { id: true, nom: true, email: true },
            },
            salle: true,
          },
          orderBy: { date_cours: 'desc' },
        },
      },
    });
    if (!data) return res.status(404).json({ error: 'Groupe not found' });
    return res.json(data);
  } catch (err) {
    console.error('getGroupeWithCours error:', err);
    return res.status(500).json({ error: 'Failed to fetch groupe with cours' });
  }
}

// Search groupes by keyword (nom or annee)
export async function searchGroupes(req: Request, res: Response) {
  try {
    const { keyword } = req.query;
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ error: 'Keyword query parameter is required' });
    }

    const data = await prisma.groupe.findMany({
      where: {
        OR: [
          { nom: { contains: keyword, mode: 'insensitive' } },
          { annee: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      include: { filiere: true, niveau: true },
      orderBy: { id: 'asc' },
    });
    return res.json(data);
  } catch (err) {
    console.error('searchGroupes error:', err);
    return res.status(500).json({ error: 'Failed to search groupes' });
  }
}

// Count students in a groupe
export async function countEtudiantsInGroupe(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    // First check if groupe exists
    const groupe = await prisma.groupe.findUnique({ where: { id } });
    if (!groupe) return res.status(404).json({ error: 'Groupe not found' });

    const count = await prisma.user.count({
      where: { groupeId: id },
    });

    return res.json({ groupe_id: id, etudiant_count: count });
  } catch (err) {
    console.error('countEtudiantsInGroupe error:', err);
    return res.status(500).json({ error: 'Failed to count etudiants' });
  }
}

// Get groupe statistics
export async function getGroupeStats(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    // Check if groupe exists
    const groupe = await prisma.groupe.findUnique({
      where: { id },
      include: { filiere: true, niveau: true },
    });
    if (!groupe) return res.status(404).json({ error: 'Groupe not found' });

    // Count students
    const etudiantCount = await prisma.user.count({
      where: { groupeId: id },
    });

    // Count cours
    const coursCount = await prisma.cours.count({
      where: { groupe_id: id },
    });

    // Get upcoming cours count
    const upcomingCoursCount = await prisma.cours.count({
      where: {
        groupe_id: id,
        date_cours: { gte: new Date() },
      },
    });

    return res.json({
      groupe: {
        id: groupe.id,
        nom: groupe.nom,
        annee: groupe.annee,
        filiere: groupe.filiere,
        niveau: groupe.niveau,
      },
      statistics: {
        total_etudiants: etudiantCount,
        total_cours: coursCount,
        upcoming_cours: upcomingCoursCount,
      },
    });
  } catch (err) {
    console.error('getGroupeStats error:', err);
    return res.status(500).json({ error: 'Failed to fetch groupe stats' });
  }
}
