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
};
