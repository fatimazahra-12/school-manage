import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const ModuleController = {
  // CREATE a new module
  async createModule(req: Request, res: Response) {
    try {
      const { nom, code, coefficient, filiere_id, enseignant_id } = req.body;
      if (!nom || !code || !coefficient || !filiere_id || !enseignant_id) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const module = await prisma.module.create({
        data: { nom, code, coefficient, filiere_id, enseignant_id },
      });
      res.status(201).json(module);
    } catch (error) {
      res.status(500).json({ error: "Failed to create module", details: error });
    }
  },

  // GET all modules
  async getModules(req: Request, res: Response) {
    try {
      const modules = await prisma.module.findMany({
        include: { enseignant: true, filiere: true, cours: true, examens: true },
      });
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch modules", details: error });
    }
  },

  // GET a module by ID
  async getModuleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const module = await prisma.module.findUnique({
        where: { id: Number(id) },
        include: { enseignant: true, filiere: true, cours: true, examens: true },
      });

      if (!module) return res.status(404).json({ error: "Module not found" });
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch module", details: error });
    }
  },

  // UPDATE a module
  async updateModule(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nom, code, coefficient, filiere_id, enseignant_id } = req.body;

      const updated = await prisma.module.update({
        where: { id: Number(id) },
        data: { nom, code, coefficient, filiere_id, enseignant_id },
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update module", details: error });
    }
  },

  // DELETE a module
  async deleteModule(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.module.delete({ where: { id: Number(id) } });
      res.json({ message: "Module deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete module", details: error });
    }
  },

  // GET modules by filiere
  async getModulesByFiliere(req: Request, res: Response) {
    try {
      const filiere_id = Number(req.params.filiere_id);
      if (isNaN(filiere_id)) {
        return res.status(400).json({ success: false, error: "ID filiere invalide" });
      }
      const modules = await prisma.module.findMany({
        where: { filiere_id },
        include: {
          enseignant: { select: { id: true, nom: true, email: true } },
          filiere: { select: { id: true, nom: true, code: true } },
        },
      });
      res.json({ success: true, count: modules.length, data: modules });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET modules by teacher
  async getModulesByTeacher(req: Request, res: Response) {
    try {
      const enseignant_id = Number(req.params.enseignant_id);
      if (isNaN(enseignant_id)) {
        return res.status(400).json({ success: false, error: "ID enseignant invalide" });
      }
      const modules = await prisma.module.findMany({
        where: { enseignant_id },
        include: {
          enseignant: { select: { id: true, nom: true, email: true } },
          filiere: { select: { id: true, nom: true, code: true } },
        },
      });
      res.json({ success: true, count: modules.length, data: modules });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET module with courses
  async getModuleWithCours(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: "ID module invalide" });
      }
      const module = await prisma.module.findUnique({
        where: { id },
        include: {
          cours: {
            include: {
              groupe: { select: { id: true, nom: true } },
              salle: { select: { id: true, nom: true } },
              enseignant: { select: { id: true, nom: true } },
            },
          },
          enseignant: { select: { id: true, nom: true, email: true } },
          filiere: { select: { id: true, nom: true, code: true } },
        },
      });
      if (!module) return res.status(404).json({ success: false, error: "Module non trouvé" });
      res.json({ success: true, data: module });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET module with exams
  async getModuleWithExamens(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: "ID module invalide" });
      }
      const module = await prisma.module.findUnique({
        where: { id },
        include: {
          examens: {
            include: {
              salle: { select: { id: true, nom: true } },
              notes: {
                select: {
                  id: true,
                  etudiant_id: true,
                  note: true,
                  remarque: true,
                },
              },
            },
          },
          enseignant: { select: { id: true, nom: true, email: true } },
          filiere: { select: { id: true, nom: true, code: true } },
        },
      });
      if (!module) return res.status(404).json({ success: false, error: "Module non trouvé" });
      res.json({ success: true, data: module });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // SEARCH modules by keyword
  async searchModules(req: Request, res: Response) {
    try {
      const keyword = req.params.keyword;
      if (!keyword || keyword.trim().length < 2) {
        return res.status(400).json({ success: false, error: "Keyword trop court (min 2 caracteres)" });
      }
      const modules = await prisma.module.findMany({
        where: {
          OR: [
            { nom: { contains: keyword, mode: "insensitive" } },
            { code: { contains: keyword, mode: "insensitive" } },
          ],
        },
        include: {
          enseignant: { select: { id: true, nom: true, email: true } },
          filiere: { select: { id: true, nom: true, code: true } },
        },
      });
      res.json({ success: true, count: modules.length, keyword, data: modules });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET module statistics
  async getModuleStats(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: "ID module invalide" });
      }
      const module = await prisma.module.findUnique({ where: { id } });
      if (!module) return res.status(404).json({ success: false, error: "Module non trouvé" });

      const [coursCount, examsCount, notesCount, averageNote] = await Promise.all([
        prisma.cours.count({ where: { module_id: id } }),
        prisma.examen.count({ where: { module_id: id } }),
        prisma.note.count({ where: { examen: { module_id: id } } }),
        prisma.note.aggregate({
          where: { examen: { module_id: id } },
          _avg: { note: true },
        }),
      ]);

      res.json({
        success: true,
        data: {
          module_id: id,
          nom: module.nom,
          code: module.code,
          coefficient: module.coefficient,
          coursCount,
          examsCount,
          notesCount,
          averageNote: averageNote._avg.note || 0,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
