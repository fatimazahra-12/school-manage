import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

//  Créer un planning
export const createPlanning = async (req: Request, res: Response) => {
  try {
    const { cours_id, jour, heure_debut, heure_fin } = req.body;

    // Vérifier si le cours existe
    const cours = await prisma.cours.findUnique({
      where: { id: cours_id },
      include: { salle: true, enseignant: true },
    });

    if (!cours) {
      return res.status(404).json({ error: "Cours introuvable" });
    }

    // Vérifier si la salle est libre pendant le créneau
    const salleOccupee = await prisma.planning.findFirst({
      where: {
        cours: { salle_id: cours.salle_id },
        jour,
        OR: [
          { heure_debut: { lt: new Date(heure_fin) }, heure_fin: { gt: new Date(heure_debut) } },
        ],
      },
    });

    if (salleOccupee) {
      return res.status(400).json({ error: "Salle déjà occupée pendant ce créneau." });
    }

    // Vérifier si l’enseignant est libre pendant le créneau
    const enseignantOccupe = await prisma.planning.findFirst({
      where: {
        cours: { enseignant_id: cours.enseignant_id },
        jour,
        OR: [
          { heure_debut: { lt: new Date(heure_fin) }, heure_fin: { gt: new Date(heure_debut) } },
        ],
      },
    });

    if (enseignantOccupe) {
      return res.status(400).json({ error: "Enseignant déjà occupé pendant ce créneau." });
    }

    // Créer le planning
    const planning = await prisma.planning.create({
      data: {
        cours_id,
        jour,
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
      },
      include: { cours: true },
    });

    res.status(201).json(planning);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création du planning" });
  }
};

//  Obtenir tous les plannings
export const getAllPlannings = async (req: Request, res: Response) => {
  try {
    const plannings = await prisma.planning.findMany({
      include: {
        cours: {
          include: {
            module: true,
            salle: true,
            enseignant: true,
            groupe: true,
          },
        },
      },
      orderBy: { jour: "asc" },
    });

    res.json(plannings);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des plannings" });
  }
};

//  Obtenir un planning par ID
export const getPlanningById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const planning = await prisma.planning.findUnique({
      where: { id: Number(id) },
      include: {
        cours: {
          include: { module: true, salle: true, enseignant: true, groupe: true },
        },
      },
    });

    if (!planning) {
      return res.status(404).json({ error: "Planning introuvable" });
    }

    res.json(planning);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du planning" });
  }
};

//  Mettre à jour un planning
export const updatePlanning = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cours_id, jour, heure_debut, heure_fin } = req.body;

    const updated = await prisma.planning.update({
      where: { id: Number(id) },
      data: {
        cours_id,
        jour,
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
      },
      include: { cours: true },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du planning" });
  }
};

//  Supprimer un planning
export const deletePlanning = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.planning.delete({ where: { id: Number(id) } });

    res.json({ message: "Planning supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du planning" });
  }
};

//  Génération automatique du planning hebdomadaire
export const generateWeeklyPlanning = async (req: Request, res: Response) => {
  try {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    const horaires = [
      { debut: "08:00", fin: "10:00" },
      { debut: "10:15", fin: "12:15" },
      { debut: "14:00", fin: "16:00" },
      { debut: "16:15", fin: "18:15" },
    ];

    const coursList = await prisma.cours.findMany();

    const plannings: any[] = [];

    let indexJour = 0;
    let indexHoraire = 0;

    for (const cours of coursList) {
      const jour = jours[indexJour]!;
      const { debut, fin } = horaires[indexHoraire]!;

      const planning = await prisma.planning.create({
        data: {
          cours_id: cours.id,
          jour,
          heure_debut: new Date(`2025-01-01T${debut}:00`),
          heure_fin: new Date(`2025-01-01T${fin}:00`),
        },
      });

      plannings.push(planning);

      // Rotation
      indexHoraire++;
      if (indexHoraire >= horaires.length) {
        indexHoraire = 0;
        indexJour = (indexJour + 1) % jours.length;
      }
    }

    res.json({
      message: "Planning hebdomadaire généré automatiquement ✅",
      plannings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la génération du planning" });
  }
};
