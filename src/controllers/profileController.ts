import { Request, Response } from "express";
import prisma from "../config/prisma.js";

// GET /api/profiles/me  (profil de l'utilisateur connecté)
export async function getMyProfile(req: Request, res: Response) {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const profile = await prisma.profile.findUnique({
      where: { user_id: Number(authUser.id) },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            email: true,
            role_id: true,
            is_active: true,
            is_verified: true,
          },
        },
      },
    });

    return res.json(profile);
  } catch (err) {
    console.error("getMyProfile error:", err);
    return res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
}

// PUT /api/profiles/me  (mettre à jour / créer le profil de l'utilisateur connecté)
export async function updateMyProfile(req: Request, res: Response) {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const {
      telephone,
      adresse,
      ville,
      pays,
      avatar_url,
      date_naissance,
      bio,
      fonction,
    } = req.body;

    const data: any = {
      telephone,
      adresse,
      ville,
      pays,
      avatar_url,
      bio,
      fonction,
    };

    if (date_naissance) {
      data.date_naissance = new Date(date_naissance);
    }

    const profile = await prisma.profile.upsert({
      where: { user_id: Number(authUser.id) },
      update: data,
      create: {
        user_id: Number(authUser.id),
        ...data,
      },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            email: true,
            role_id: true,
            is_active: true,
            is_verified: true,
          },
        },
      },
    });

    return res.json(profile);
  } catch (err: any) {
    console.error("updateMyProfile error:", err);
    return res.status(500).json({ error: "Erreur lors de la mise à jour du profil", detail: err?.message });
  }
}

// GET /api/profiles  (liste de tous les profils)
export async function listProfiles(_req: Request, res: Response) {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            email: true,
            role_id: true,
            is_active: true,
            is_verified: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });
    return res.json(profiles);
  } catch (err) {
    console.error("listProfiles error:", err);
    return res.status(500).json({ error: "Erreur lors de la récupération des profils" });
  }
}

// GET /api/profiles/:userId  (profil par user_id)
export async function getProfileByUserId(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);

    const profile = await prisma.profile.findUnique({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            email: true,
            role_id: true,
            is_active: true,
            is_verified: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }

    return res.json(profile);
  } catch (err) {
    console.error("getProfileByUserId error:", err);
    return res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
}

// POST /api/profiles/:userId  (créer un profil pour un utilisateur)
export async function createProfileByUserId(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);
    const {
      telephone,
      adresse,
      ville,
      pays,
      avatar_url,
      date_naissance,
      bio,
      fonction,
    } = req.body;

    const data: any = {
      user_id: userId,
      telephone,
      adresse,
      ville,
      pays,
      avatar_url,
      bio,
      fonction,
    };

    if (date_naissance) {
      data.date_naissance = new Date(date_naissance);
    }

    const profile = await prisma.profile.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            email: true,
            role_id: true,
            is_active: true,
            is_verified: true,
          },
        },
      },
    });

    return res.status(201).json(profile);
  } catch (err: any) {
    console.error("createProfileByUserId error:", err);
    return res.status(500).json({ error: "Erreur lors de la création du profil", detail: err?.message });
  }
}

// PUT /api/profiles/:userId  (mettre à jour ou créer un profil)
export async function updateProfileByUserId(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);
    const {
      telephone,
      adresse,
      ville,
      pays,
      avatar_url,
      date_naissance,
      bio,
      fonction,
    } = req.body;

    const data: any = {
      telephone,
      adresse,
      ville,
      pays,
      avatar_url,
      bio,
      fonction,
    };

    if (date_naissance) {
      data.date_naissance = new Date(date_naissance);
    }

    const profile = await prisma.profile.upsert({
      where: { user_id: userId },
      update: data,
      create: {
        user_id: userId,
        ...data,
      },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            email: true,
            role_id: true,
            is_active: true,
            is_verified: true,
          },
        },
      },
    });

    return res.json(profile);
  } catch (err: any) {
    console.error("updateProfileByUserId error:", err);
    return res.status(500).json({ error: "Erreur lors de la mise à jour du profil", detail: err?.message });
  }
}

// DELETE /api/profiles/:userId  (supprimer le profil d'un utilisateur)
export async function deleteProfileByUserId(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);

    await prisma.profile.delete({
      where: { user_id: userId },
    });

    return res.status(204).send();
  } catch (err: any) {
    console.error("deleteProfileByUserId error:", err);
    return res.status(500).json({ error: "Erreur lors de la suppression du profil", detail: err?.message });
  }
}
