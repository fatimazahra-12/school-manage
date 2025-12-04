import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

//GET all roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      include: { rolePermissions: { include: { permission: true } } },
    });
    res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Erreur lors de la récupération des rôles", error });
  }
};

//GET one role by ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { id: Number(id) },
      include: { rolePermissions: { include: { permission: true } } },
    });
    if (!role) return res.status(404).json({ message: "Rôle non trouvé" });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du rôle", error });
  }
};

// Create role
export const createRole = async (req: Request, res: Response) => {
  try {
    const { nom, description } = req.body;
    const existing = await prisma.role.findFirst({ where: { nom: nom } });
    if (existing) return res.status(400).json({ message: "Ce rôle existe déjà" });

    const newRole = await prisma.role.create({
      data: { nom, description },
    });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du rôle", error });
  }
};

// Update role
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;

    const updatedRole = await prisma.role.update({
      where: { id: Number(id) },
      data: { nom, description },
    });
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du rôle", error });
  }
};

// DELETE role
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Supprimer les associations avant le rôle
    await prisma.rolePermission.deleteMany({ where: { role_id: Number(id) } });

    await prisma.role.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Rôle supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du rôle", error });
  }
};
