import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ExamenController = {
  // CREATE
  async create(req: Request, res: Response) {
    try {
      const { module_id, salle_id, date_examen, type, coefficient } = req.body;

      if (!module_id || !salle_id || !date_examen || !type || !coefficient) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const parsedDate = new Date(date_examen);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      const examen = await prisma.examen.create({
        data: {
          module_id: Number(module_id),
          salle_id: Number(salle_id),
          date_examen: parsedDate,
          type,
          coefficient: parseFloat(coefficient),
        },
      });

      res.status(201).json(examen);
    } catch (error: any) {
      if (error.code === "P2003") {
        return res.status(400).json({ error: "Invalid module_id or salle_id (foreign key)" });
      }
      console.error("Error creating examen:", error);
      res.status(500).json({ error: "Failed to create examen", details: error.message });
    }
  },

  // GET ALL
  async getAll(req: Request, res: Response) {
    try {
      const examens = await prisma.examen.findMany({
        include: {
          module: true,
          salle: true,
        },
      });
      res.json(examens);
    } catch (error) {
      console.error("Error fetching examens:", error);
      res.status(500).json({ error: "Failed to fetch examens" });
    }
  },

  // GET BY ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const examen = await prisma.examen.findUnique({
        where: { id: Number(id) },
        include: {
          module: true,
          salle: true,
        },
      });

      if (!examen) {
        return res.status(404).json({ error: "Examen not found" });
      }

      res.json(examen);
    } catch (error) {
      console.error("Error fetching examen:", error);
      res.status(500).json({ error: "Failed to fetch examen" });
    }
  },

  // UPDATE
async update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { module_id, salle_id, date_examen, type, coefficient } = req.body;

    // Build data object dynamically (only include defined fields)
    const data: any = {};

    if (module_id !== undefined) data.module_id = Number(module_id);
    if (salle_id !== undefined) data.salle_id = Number(salle_id);
    if (date_examen !== undefined) data.date_examen = new Date(date_examen);
    if (type !== undefined) data.type = type;
    if (coefficient !== undefined) data.coefficient = parseFloat(coefficient);

    const updatedExamen = await prisma.examen.update({
      where: { id: Number(id) },
      data,
    });

    res.json(updatedExamen);
  } catch (error) {
    console.error("Error updating examen:", error);
    res.status(500).json({ error: "Failed to update examen" });
  }
},

  // DELETE
  
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.examen.delete({
        where: { id: Number(id) },
      });

      res.json({ message: "Examen deleted successfully" });
    } catch (error) {
      console.error("Error deleting examen:", error);
      res.status(500).json({ error: "Failed to delete examen" });
    }
  },
};
