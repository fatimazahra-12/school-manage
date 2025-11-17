import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

// Créer un utilisateur
export const createUser = async (req: Request, res: Response) => {
  try {
    const { nom, email, mot_de_passe, role_id } = req.body;

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const user = await prisma.user.create({
      data: {
        nom,
        email,
        mot_de_passe: hashedPassword,
        role_id,
        is_active: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};


// Récupérer un utilisateur par ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { role: true },
    });

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, email, role_id, is_active } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { nom, email, role_id, is_active },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id: Number(id) } });

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
  }
};

// Activer / désactiver un utilisateur
export const toggleUserActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { is_active: !user.is_active },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du changement d'état de l'utilisateur" });
  }
};

// Récupérer uniquement les étudiants d’un groupe spécifique
export const getUsersEtudiantsByGroupe = async (req: Request, res: Response) => {
  try {
    const { groupeId } = req.params;

    const etudiants = await prisma.etudiantGroupe.findMany({
      where: { groupe_id: Number(groupeId) },
      include: {
        etudiant: {
          include: { role: true },
        },
      },
    });

    // On garde uniquement les utilisateurs ayant le rôle "etudiant"
    const result = etudiants
      .filter((e) => e.etudiant.role.nom.toLowerCase() === "etudiant")
      .map((e) => e.etudiant);

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des étudiants du groupe" });
  }
};

export const listUsersByRole = async (req: Request, res: Response)=> {
  try {
    const { roleName } = req.params;

    if (!roleName) return res.status(400).json({ message: "roleName parameter is required" });

    const role = await prisma.role.findFirst({
      where: {
        nom: {
          equals: roleName,
          mode: "insensitive",
        },
      },
    });

    if (!role) return res.status(404).json({ message: "Rôle introuvable" });

    const users = await prisma.user.findMany({
      where: { role_id: role.id },
      include: { role: true },
    });

    res.json(users);
  } catch (error) {
    console.error("Erreur listUsersByRole:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs par rôle" });
  }
};
