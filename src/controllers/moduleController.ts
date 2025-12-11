import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// Create Module
export const createModule = async (req: Request, res: Response) => {
  try {
    const { nom, code, coefficient, filiere_id, enseignant_id } = req.body;

    if (!nom || !code || !coefficient || !filiere_id || !enseignant_id) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
        data: null,
      });
    }

    const module = await prisma.module.create({
      data: {
        nom,
        code,
        coefficient: parseFloat(coefficient),
        filiere_id: parseInt(filiere_id),
        enseignant_id: parseInt(enseignant_id),
      },
      include: {
        filiere: true,
        enseignant: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: module,
      message: "Module créé avec succès",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du module",
      data: null,
    });
  }
};

// Get All Modules
export const getAllModules = async (req: Request, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        filiere: true,
        enseignant: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: modules,
      message: "Modules récupérés avec succès",
    });
  } catch (error: any) {
    console.error("Error in getAllModules:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Erreur lors de la récupération des modules",
      data: null,
    });
  }
};

// Get Module By ID
export const getModuleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const module = await prisma.module.findUnique({
      where: { id: parseInt(id!) },
      include: {
        filiere: true,
        enseignant: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module récupéré avec succès",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du module",
      data: null,
    });
  }
};

// Update Module
export const updateModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, code, coefficient, filiere_id, enseignant_id } = req.body;

    const updateData: any = {};
    if (nom) updateData.nom = nom;
    if (code) updateData.code = code;
    if (coefficient) updateData.coefficient = parseFloat(coefficient);
    if (filiere_id) updateData.filiere_id = parseInt(filiere_id);
    if (enseignant_id) updateData.enseignant_id = parseInt(enseignant_id);

    const module = await prisma.module.update({
      where: { id: parseInt(id!) },
      data: updateData,
      include: {
        filiere: true,
        enseignant: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module mis à jour avec succès",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du module",
      data: null,
    });
  }
};

// Delete Module
export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.module.delete({
      where: { id: parseInt(id!) },
    });

    return res.status(200).json({
      success: true,
      data: null,
      message: "Module supprimé avec succès",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du module",
      data: null,
    });
  }
};



// Get Modules By Filiere
export const getModulesByFiliere = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const modules = await prisma.module.findMany({
      where: { filiere_id: parseInt(id!) },
      include: {
        filiere: true,
        enseignant: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
      orderBy: {
        nom: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: modules,
      message: `${modules.length} module(s) trouvé(s) pour cette filière`,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des modules",
      data: null,
    });
  }
};

// Get Modules By Teacher
export const getModulesByTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const modules = await prisma.module.findMany({
      where: { enseignant_id: parseInt(id!) },
      include: {
        filiere: true,
        enseignant: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
      orderBy: {
        nom: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: modules,
      message: `${modules.length} module(s) trouvé(s) pour cet enseignant`,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des modules",
      data: null,
    });
  }
};



// Get Module With Cours
export const getModuleWithCours = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const module = await prisma.module.findUnique({
      where: { id: parseInt(id!) },
      include: {
        filiere: true,
        enseignant: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
        cours: {
          include: {
            salle: true,
            groupe: true,
          },
          orderBy: {
            date_cours: "desc",
          },
        },
      },
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module avec cours récupéré avec succès",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du module",
      data: null,
    });
  }
};

// Get Module With Examens
export const getModuleWithExamens = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const module = await prisma.module.findUnique({
      where: { id: parseInt(id!) },
      include: {
        filiere: true,
        enseignant: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
        examens: {
          include: {
            salle: true,
            notes: true,
          },
          orderBy: {
            date_examen: "desc",
          },
        },
      },
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module avec examens récupéré avec succès",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du module",
      data: null,
    });
  }
};



// Search Modules
export const searchModules = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    if (!key || key.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Mot-clé de recherche requis",
        data: null,
      });
    }

    const modules = await prisma.module.findMany({
      where: {
        OR: [
          {
            nom: {
              contains: key,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: key,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        filiere: true,
        enseignant: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
      orderBy: {
        nom: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: modules,
      message: `${modules.length} module(s) trouvé(s)`,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche",
      data: null,
    });
  }
};



// Get Module Stats
export const getModuleStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if module exists
    const module = await prisma.module.findUnique({
      where: { id: parseInt(id!) },
      select: {
        id: true,
        nom: true,
        code: true,
      },
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
        data: null,
      });
    }

    // Count cours
    const totalCours = await prisma.cours.count({
      where: { module_id: parseInt(id!) },
    });

    // Count examens
    const totalExamens = await prisma.examen.count({
      where: { module_id: parseInt(id!) },
    });

    // Count total students in examens (unique students)
    const examensWithNotes = await prisma.examen.findMany({
      where: { module_id: parseInt(id!) },
      include: {
        notes: {
          select: {
            etudiant_id: true,
          },
        },
      },
    });

    const uniqueStudents = new Set();
    examensWithNotes.forEach((examen: any) => {
      examen.notes.forEach((note: any) => {
        uniqueStudents.add(note.etudiant_id);
      });
    });

    const totalEtudiants = uniqueStudents.size;

    // Calculate average note for the module
    const allNotes = await prisma.note.findMany({
      where: {
        examen: {
          module_id: parseInt(id!),
        },
      },
      select: {
        note: true,
      },
    });

    let averageNote = 0;
    if (allNotes.length > 0) {
      const sum = allNotes.reduce((acc: number, n: any) => acc + n.note, 0);
      averageNote = parseFloat((sum / allNotes.length).toFixed(2));
    }

    const stats = {
      module,
      totalCours,
      totalExamens,
      totalEtudiants,
      averageNote,
      totalNotes: allNotes.length,
    };

    return res.status(200).json({
      success: true,
      data: stats,
      message: "Statistiques du module récupérées avec succès",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      data: null,
    });
  }
};
