import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

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
};
