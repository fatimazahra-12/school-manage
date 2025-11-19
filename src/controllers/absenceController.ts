import { Request, Response } from "express";
import prisma from "../config/prisma.js";

//  Obtenir toutes les absences
export const getAllAbsences = async (req: Request, res: Response) => {
  try {
    const absences = await prisma.absence.findMany({
      include: { etudiant: true, cours: true },
    });
    res.json(absences);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des absences" });
  }
};

// 🔵 Obtenir une seule absence
export const getAbsenceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const absence = await prisma.absence.findUnique({
      where: { id: Number(id) },
      include: { etudiant: true, cours: true },
    });
    if (!absence) return res.status(404).json({ error: "Absence non trouvée" });
    res.json(absence);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'absence" });
  }
};

//  Créer une absence
export const createAbsence = async (req: Request, res: Response) => {
  try {
    const { cours_id, etudiant_id, date, motif, justifiee } = req.body;
    const absence = await prisma.absence.create({
      data: {
        cours_id,
        etudiant_id,
        date: new Date(date),
        motif,
        justifiee: justifiee ?? false,
      },
    });
    res.status(201).json(absence);
  } catch (error) {
    res.status(500).json({ error: "Erreur DE création de l'absence" });
  }
};

//  Mettre à jour une absence
export const updateAbsence = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { motif, justifiee } = req.body;
    const absence = await prisma.absence.update({
      where: { id: Number(id) },
      data: { motif, justifiee },
    });
    res.json(absence);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'absence" });
  }
};

//  Supprimer une absence
export const deleteAbsence = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.absence.delete({ where: { id: Number(id) } });
    res.json({ message: "Absence supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'absence" });
  }
};
