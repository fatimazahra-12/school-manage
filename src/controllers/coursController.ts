import { Request, Response } from "express";
import { prisma } from "../prismaClient";

export async function listCours(_req: Request, res: Response) {
  try {
    const data = await prisma.cours.findMany({ orderBy: { id: "asc" } });
    return res.json(data);
  } catch (e) {
    console.error("listCours:", e);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getCoursById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid 'id'" });
    }

    const data = await prisma.cours.findUnique({ where: { id } });
    if (!data) return res.status(404).json({ error: "Cours not found" });

    return res.json(data);
  } catch (e) {
    console.error("getCoursById:", e);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function createCours(req: Request, res: Response) {
  try {
    const {
      module_id,
      enseignant_id,
      salle_id,
      groupe_id,
      titre,
      date_cours,
      heure_debut,
      heure_fin,
    } = req.body ?? {};

    if (!titre || typeof titre !== "string") {
      return res.status(400).json({ error: "Field 'titre' is required" });
    }

    const moduleId = Number(module_id);
    const enseignantId = Number(enseignant_id);
    const salleId = Number(salle_id);
    const groupeId = Number(groupe_id);
    if (
      !Number.isInteger(moduleId) ||
      !Number.isInteger(enseignantId) ||
      !Number.isInteger(salleId) ||
      !Number.isInteger(groupeId)
    ) {
      return res.status(400).json({ error: "IDs must be integers" });
    }

    const dc = new Date(date_cours);
    const hd = new Date(heure_debut);
    const hf = new Date(heure_fin);
    if ([dc, hd, hf].some((d) => isNaN(d.getTime()))) {
      return res.status(400).json({ error: "Invalid dates provided" });
    }

    const [module, enseignant, salle, groupe] = await Promise.all([
      prisma.module.findUnique({ where: { id: moduleId } }),
      prisma.user.findUnique({ where: { id: enseignantId } }),
      prisma.salle.findUnique({ where: { id: salleId } }),
      prisma.groupe.findUnique({ where: { id: groupeId } }),
    ]);
    if (!module) return res.status(404).json({ error: `module ${moduleId} not found` });
    if (!enseignant) return res.status(404).json({ error: `user ${enseignantId} not found` });
    if (!salle) return res.status(404).json({ error: `salle ${salleId} not found` });
    if (!groupe) return res.status(404).json({ error: `groupe ${groupeId} not found` });

    const created = await prisma.cours.create({
      data: {
        module_id: moduleId,
        enseignant_id: enseignantId,
        salle_id: salleId,
        groupe_id: groupeId,
        titre,
        date_cours: dc,
        heure_debut: hd,
        heure_fin: hf,
      },
    });

    return res.status(201).json(created);
  } catch (e: any) {
    console.error("createCours:", e);
    return res.status(500).json({ error: "Failed to create cours" });
  }
}

export async function updateCours(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid 'id'" });
    }

    const exists = await prisma.cours.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: "Cours not found" });

    const data: any = {};

    if (req.body.titre !== undefined) {
      if (typeof req.body.titre !== "string" || !req.body.titre.trim()) {
        return res.status(400).json({ error: "Invalid 'titre'" });
      }
      data.titre = req.body.titre;
    }

    if (req.body.module_id !== undefined) {
      const v = Number(req.body.module_id);
      if (!Number.isInteger(v)) return res.status(400).json({ error: "module_id must be int" });
      const ok = await prisma.module.findUnique({ where: { id: v } });
      if (!ok) return res.status(404).json({ error: `module ${v} not found` });
      data.module_id = v;
    }

    if (req.body.enseignant_id !== undefined) {
      const v = Number(req.body.enseignant_id);
      if (!Number.isInteger(v)) return res.status(400).json({ error: "enseignant_id must be int" });
      const ok = await prisma.user.findUnique({ where: { id: v } });
      if (!ok) return res.status(404).json({ error: `user ${v} not found` });
      data.enseignant_id = v;
    }

    if (req.body.salle_id !== undefined) {
      const v = Number(req.body.salle_id);
      if (!Number.isInteger(v)) return res.status(400).json({ error: "salle_id must be int" });
      const ok = await prisma.salle.findUnique({ where: { id: v } });
      if (!ok) return res.status(404).json({ error: `salle ${v} not found` });
      data.salle_id = v;
    }

    if (req.body.groupe_id !== undefined) {
      const v = Number(req.body.groupe_id);
      if (!Number.isInteger(v)) return res.status(400).json({ error: "groupe_id must be int" });
      const ok = await prisma.groupe.findUnique({ where: { id: v } });
      if (!ok) return res.status(404).json({ error: `groupe ${v} not found` });
      data.groupe_id = v;
    }

    if (req.body.date_cours !== undefined) {
      const d = new Date(req.body.date_cours);
      if (isNaN(d.getTime())) return res.status(400).json({ error: "Invalid date_cours" });
      data.date_cours = d;
    }

    if (req.body.heure_debut !== undefined) {
      const d = new Date(req.body.heure_debut);
      if (isNaN(d.getTime())) return res.status(400).json({ error: "Invalid heure_debut" });
      data.heure_debut = d;
    }

    if (req.body.heure_fin !== undefined) {
      const d = new Date(req.body.heure_fin);
      if (isNaN(d.getTime())) return res.status(400).json({ error: "Invalid heure_fin" });
      data.heure_fin = d;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const updated = await prisma.cours.update({ where: { id }, data });
    return res.json(updated);
  } catch (e) {
    console.error("updateCours:", e);
    return res.status(500).json({ error: "Failed to update cours" });
  }
}

export async function deleteCours(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid 'id'" });
    }

    const exists = await prisma.cours.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: "Cours not found" });

    await prisma.cours.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    console.error("deleteCours:", e);
    return res.status(500).json({ error: "Failed to delete cours" });
  }
}
