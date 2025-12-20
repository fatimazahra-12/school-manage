import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const NoteController = {
  // CREATE
  async create(req: Request, res: Response) {
    try {
      const { examen_id, etudiant_id, note, remarque } = req.body;

      if (!examen_id || !etudiant_id || note === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newNote = await prisma.note.create({
        data: {
          examen_id: Number(examen_id),
          etudiant_id: Number(etudiant_id),
          note: parseFloat(note),
          remarque: remarque || null,
        },
      });

      res.status(201).json(newNote);
    } catch (error: any) {
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "Invalid examen_id or etudiant_id (foreign key)" });
      }
      console.error("Error creating note:", error);
      res.status(500).json({ error: "Failed to create note", details: error });
    }
  },

  //  GET ALL
  async getAll(req: Request, res: Response) {
    try {
      const notes = await prisma.note.findMany({
        include: {
          examen: true,
          etudiant: true,
        },
      });
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  },

  //  GET BY ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const note = await prisma.note.findUnique({
        where: { id: Number(id) },
        include: {
          examen: true,
          etudiant: true,
        },
      });

      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      res.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ error: "Failed to fetch note" });
    }
  },

  //  UPDATE
async update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { examen_id, etudiant_id, note, remarque } = req.body;

    // on construit l'objet data dynamiquement sans undefined
    const data: any = {};

    if (examen_id) data.examen_id = Number(examen_id);
    if (etudiant_id) data.etudiant_id = Number(etudiant_id);
    if (note !== undefined) data.note = parseFloat(note);
    if (remarque !== undefined) data.remarque = remarque;

    const updatedNote = await prisma.note.update({
      where: { id: Number(id) },
      data,
    });

    res.json(updatedNote);
  } catch (error: any) {
    if (error.code === "P2003") {
      return res.status(400).json({
        error: "Invalid examen_id or etudiant_id (foreign key)",
      });
    }

    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note", details: error });
  }
},


  // DELETE
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.note.delete({
        where: { id: Number(id) },
      });

      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  },

  // GET notes by etudiant
  async getNotesByEtudiant(req: Request, res: Response) {
    try {
      const etudiant_id = Number(req.params.etudiant_id);
      if (isNaN(etudiant_id)) {
        return res.status(400).json({ success: false, error: "ID etudiant invalide" });
      }

      const notes = await prisma.note.findMany({
        where: { etudiant_id },
        include: {
          examen: {
            include: {
              module: { select: { id: true, nom: true, code: true } },
              salle: { select: { id: true, nom: true } },
            },
          },
          etudiant: { select: { id: true, nom: true, email: true } },
        },
        orderBy: { examen: { date_examen: "desc" } },
      });

      res.json({ success: true, count: notes.length, data: notes });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET notes by examen
  async getNotesByExamen(req: Request, res: Response) {
    try {
      const examen_id = Number(req.params.examen_id);
      if (isNaN(examen_id)) {
        return res.status(400).json({ success: false, error: "ID examen invalide" });
      }

      const examen = await prisma.examen.findUnique({
        where: { id: examen_id },
        include: { module: { select: { id: true, nom: true, code: true } } },
      });

      if (!examen) {
        return res.status(404).json({ success: false, error: "Examen non trouvé" });
      }

      const notes = await prisma.note.findMany({
        where: { examen_id },
        include: {
          etudiant: { select: { id: true, nom: true, email: true } },
        },
        orderBy: { note: "desc" },
      });

      res.json({ success: true, examen, count: notes.length, data: notes });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET moyenne d'un etudiant dans un module
  async getMoyenneModule(req: Request, res: Response) {
    try {
      const etudiant_id = Number(req.params.etudiant_id);
      const module_id = Number(req.params.module_id);

      if (isNaN(etudiant_id) || isNaN(module_id)) {
        return res.status(400).json({ success: false, error: "IDs invalides" });
      }

      const notes = await prisma.note.findMany({
        where: {
          etudiant_id,
          examen: { module_id },
        },
        include: {
          examen: { include: { module: true } },
        },
      });

      if (notes.length === 0) {
        return res.json({ success: true, data: { etudiant_id, module_id, moyenne: 0, count: 0 } });
      }

      const moyenne = notes.reduce((sum: number, n: any) => sum + n.note, 0) / notes.length;

      res.json({
        success: true,
        data: {
          etudiant_id,
          module_id,
          module_nom: notes[0]?.examen?.module?.nom || "Module inconnu",
          moyenne: Math.round(moyenne * 100) / 100,
          count: notes.length,
          notes: notes.map((n: any) => n.note),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET resultats by module (moyenne de tous les etudiants)
  async getResultatsByModule(req: Request, res: Response) {
    try {
      const module_id = Number(req.params.module_id);
      if (isNaN(module_id)) {
        return res.status(400).json({ success: false, error: "ID module invalide" });
      }

      const module = await prisma.module.findUnique({
        where: { id: module_id },
      });

      if (!module) {
        return res.status(404).json({ success: false, error: "Module non trouvé" });
      }

      const notes = await prisma.note.findMany({
        where: { examen: { module_id } },
        include: {
          etudiant: { select: { id: true, nom: true } },
          examen: { select: { id: true, date_examen: true } },
        },
      });

      const groupedByEtudiant: Record<number, any> = {};
      notes.forEach((note: any) => {
        if (!groupedByEtudiant[note.etudiant_id]) {
          groupedByEtudiant[note.etudiant_id] = {
            etudiant_id: note.etudiant_id,
            etudiant_nom: note.etudiant.nom,
            notes: [],
          };
        }
        groupedByEtudiant[note.etudiant_id].notes.push(note.note);
      });

      const resultats = Object.values(groupedByEtudiant).map((item: any) => ({
        ...item,
        moyenne: Math.round((item.notes.reduce((a: number, b: number) => a + b, 0) / item.notes.length) * 100) / 100,
      }));

      const moduleMoyenne = resultats.reduce((sum: number, r: any) => sum + r.moyenne, 0) / resultats.length || 0;

      res.json({
        success: true,
        data: {
          module_id,
          module_nom: module.nom,
          etudiantsCount: resultats.length,
          moduleMoyenne: Math.round(moduleMoyenne * 100) / 100,
          resultats,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET bulletin (toutes les notes d'un etudiant)
  async getBulletin(req: Request, res: Response) {
    try {
      const etudiant_id = Number(req.params.etudiant_id);
      if (isNaN(etudiant_id)) {
        return res.status(400).json({ success: false, error: "ID etudiant invalide" });
      }

      const etudiant = await prisma.user.findUnique({
        where: { id: etudiant_id },
        select: { id: true, nom: true, email: true },
      });

      if (!etudiant) {
        return res.status(404).json({ success: false, error: "Etudiant non trouvé" });
      }

      const notes = await prisma.note.findMany({
        where: { etudiant_id },
        include: {
          examen: {
            include: {
              module: { select: { id: true, nom: true, code: true, coefficient: true } },
            },
          },
        },
        orderBy: { examen: { module_id: "asc" } },
      });

      const moduleMap: Record<number, any> = {};
      notes.forEach((note: any) => {
        const mod = note.examen.module;
        if (!moduleMap[mod.id]) {
          moduleMap[mod.id] = {
            module_id: mod.id,
            module_nom: mod.nom,
            module_code: mod.code,
            coefficient: mod.coefficient,
            notes: [],
          };
        }
        moduleMap[mod.id].notes.push(note.note);
      });

      const modules = Object.values(moduleMap).map((mod: any) => ({
        ...mod,
        moyenne: Math.round((mod.notes.reduce((a: number, b: number) => a + b, 0) / mod.notes.length) * 100) / 100,
      }));

      const moyenneGenerale = modules.reduce((sum: number, m: any) => sum + m.moyenne * m.coefficient, 0) / modules.reduce((sum: number, m: any) => sum + m.coefficient, 0) || 0;

      res.json({
        success: true,
        data: {
          etudiant,
          modulesCount: modules.length,
          moyenneGenerale: Math.round(moyenneGenerale * 100) / 100,
          modules,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
