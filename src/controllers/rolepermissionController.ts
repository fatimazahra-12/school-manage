
import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

//GET all role-permissions
export const getAllRolePermissions = async (req: Request, res: Response) => {
  try {
    const result = await prisma.rolePermission.findMany({
      include: { role: true, permission: true },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des associations rôle-permission", error });
  }
};

//POST create association
export const createRolePermission = async (req: Request, res: Response) => {
  try {
    const { role_id, permission_id } = req.body;

    const existing = await prisma.rolePermission.findFirst({
      where: { role_id, permission_id },
    });
    if (existing) {
      return res.status(400).json({ message: "Cette association existe déjà." });
    }

    const newLink = await prisma.rolePermission.create({
      data: { role_id, permission_id },
    });
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du lien rôle-permission", error });
  }
};

//DELETE association
export const deleteRolePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.rolePermission.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Lien rôle-permission supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du lien", error });
  }
};
