import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// Create examen
export const createExamen = async (req: Request, res: Response) => {
  try {
    const examen = await prisma.examen.create({
      data: req.body,
      include: {
        module: true,
        salle: true,
      },
    });
    res.status(201).json({ success: true, data: examen });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all examens
export const getAllExamens = async (req: Request, res: Response) => {
  try {
    const examens = await prisma.examen.findMany({
      include: {
        module: true,
        salle: true,
        notes: true,
      },
      orderBy: { date_examen: "desc" },
    });
    res.json({ success: true, data: examens });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get examen by id
export const getExamenById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    const examen = await prisma.examen.findUnique({
      where: { id },
      include: {
        module: true,
        salle: true,
        notes: { include: { etudiant: true } },
      },
    });

    if (!examen) {
      return res.status(404).json({ success: false, error: "Examen non trouvé" });
    }

    res.json({ success: true, data: examen });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update examen
export const updateExamen = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    const examen = await prisma.examen.update({
      where: { id },
      data: req.body,
      include: {
        module: true,
        salle: true,
      },
    });

    res.json({ success: true, data: examen });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete examen
export const deleteExamen = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }

    await prisma.examen.delete({ where: { id } });
    res.json({ success: true, data: { message: "Examen supprimé" } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get examens by module
export const getExamensByModule = async (req: Request, res: Response) => {
  try {
    const module_id = Number(req.params.module_id);
    if (isNaN(module_id)) {
      return res.status(400).json({ success: false, error: "ID module invalide" });
    }

    const examens = await prisma.examen.findMany({
      where: { module_id },
      include: {
        module: true,
        salle: true,
        notes: true,
      },
      orderBy: { date_examen: "asc" },
    });

    res.json({ success: true, data: examens });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get examens by salle
export const getExamensBySalle = async (req: Request, res: Response) => {
  try {
    const salle_id = Number(req.params.salle_id);
    if (isNaN(salle_id)) {
      return res.status(400).json({ success: false, error: "ID salle invalide" });
    }

    const examens = await prisma.examen.findMany({
      where: { salle_id },
      include: {
        module: true,
        salle: true,
        notes: true,
      },
      orderBy: { date_examen: "asc" },
    });

    res.json({ success: true, data: examens });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get examens of a specific day
export const getExamensOfDay = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    if (!date) {
      return res.status(400).json({ success: false, error: "Date requise" });
    }
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, error: "Date invalide" });
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const examens = await prisma.examen.findMany({
      where: {
        date_examen: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        module: true,
        salle: true,
        notes: true,
      },
      orderBy: { date_examen: "asc" },
    });

    res.json({ success: true, data: examens });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get examens for groupe via module -> cours
export const getExamensForGroupe = async (req: Request, res: Response) => {
  try {
    const groupe_id = Number(req.params.groupe_id);
    if (isNaN(groupe_id)) {
      return res.status(400).json({ success: false, error: "ID groupe invalide" });
    }

    const groupe = await prisma.groupe.findUnique({
      where: { id: groupe_id },
      include: { filiere: true },
    });

    if (!groupe) {
      return res.status(404).json({ success: false, error: "Groupe non trouvé" });
    }

    const modules = await prisma.module.findMany({
      where: { filiere_id: groupe.filiere_id },
      select: { id: true },
    });

    const moduleIds = modules.map((m) => m.id);

    const examens = await prisma.examen.findMany({
      where: { module_id: { in: moduleIds } },
      include: {
        module: true,
        salle: true,
        notes: true,
      },
      orderBy: { date_examen: "asc" },
    });

    res.json({ success: true, data: examens });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Detect exam conflicts in same salle and time
export const detectExamConflict = async (req: Request, res: Response) => {
  try {
    const salle_id = Number(req.params.salle_id);
    const { date } = req.params;
    if (!date) {
      return res.status(400).json({ success: false, error: "Date requise" });
    }
    const parsedDate = new Date(date);

    if (isNaN(salle_id)) {
      return res.status(400).json({ success: false, error: "ID salle invalide" });
    }

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, error: "Date invalide" });
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const examens = await prisma.examen.findMany({
      where: {
        salle_id,
        date_examen: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        module: true,
        salle: true,
      },
      orderBy: { date_examen: "asc" },
    });

    const conflicts: any[] = [];
    for (let i = 0; i < examens.length; i++) {
      for (let j = i + 1; j < examens.length; j++) {
        const exam1 = examens[i];
        const exam2 = examens[j];
        if (!exam1 || !exam2) continue;

        const exam1End = new Date(exam1.date_examen.getTime() + 3 * 60 * 60 * 1000);
        const exam2End = new Date(exam2.date_examen.getTime() + 3 * 60 * 60 * 1000);

        if (exam1.date_examen < exam2End && exam2.date_examen < exam1End) {
          conflicts.push({
            exam1: { id: exam1.id, module: exam1.module.nom, date: exam1.date_examen },
            exam2: { id: exam2.id, module: exam2.module.nom, date: exam2.date_examen },
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        salle_id,
        date,
        total_examens: examens.length,
        has_conflicts: conflicts.length > 0,
        conflicts,
        examens,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
