
import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

//GET all permissions
export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des permissions", error });
  }
};

//GET one permission by ID
export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permission = await prisma.permission.findUnique({
      where: { id: Number(id) },
    });
    if (!permission) {
      return res.status(404).json({ message: "Permission non trouvée" });
    }
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la permission", error });
  }
};

//POST create permission
export const createPermission = async (req: Request, res: Response) => {
  try {
    const { nom, code, description } = req.body;
    const existing = await prisma.permission.findFirst({ where: { code } });

    if (existing) {
      return res.status(400).json({ message: "Ce code de permission existe déjà." });
    }

    const permission = await prisma.permission.create({
      data: { nom, code, description },
    });
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la permission", error });
  }
};

//PUT update permission
export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, code, description } = req.body;

    const updated = await prisma.permission.update({
      where: { id: Number(id) },
      data: { nom, code, description },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la permission", error });
  }
};

//DELETE permission
export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.permission.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Permission supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la permission", error });
  }
};
