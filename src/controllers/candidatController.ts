import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

// Create candidture
export const postCandidature = async (req: Request, res: Response) => {
  try {
    const { nom, prenom, email, telephone, adresse, date_naissance, filiere_id, niveau_etude,
            note_bac, note_diplome, type_diplome } = req.body;

    if (!nom || !prenom || !email || !filiere_id || !niveau_etude) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    if (niveau_etude === "BAC" && !note_bac) {
      return res.status(400).json({ message: "Note Bac obligatoire." });
    }

    if (niveau_etude !== "BAC" && !note_diplome) {
      return res.status(400).json({ message: "Note diplôme obligatoire." });
    }

    const candidat = await prisma.candidat.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        adresse,
        date_naissance: date_naissance ? new Date(date_naissance) : null,
        filiere_id,
        niveau_etude,
        note_bac,
        note_diplome,
        type_diplome
      }
    });

    res.status(201).json({
      message: "Candidature envoyée avec succès",
      candidat
    });

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// get liste des  candidatures
export const listCandidatures = async (req: Request, res: Response) => {
  try {
    const { statut } = req.query;

    const candidatures = await prisma.candidat.findMany({
      where: statut ? { statut: statut as any } : {},
      include: {
        filiere: true,
        user: true
      }
    });

    res.json(candidatures);

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// get candidature
export const getCandidature = async (req: Request, res: Response) => {
  try {
    const candidat = await prisma.candidat.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        filiere: true,
        user: true
      }
    });

    if (!candidat)
      return res.status(404).json({ message: "Candidature introuvable" });

    res.json(candidat);

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Validation d'une candidature
export const validerCandidature = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const candidat = await prisma.candidat.findUnique({ where: { id } });

    if (!candidat)
      return res.status(404).json({ message: "Candidat non trouvé." });

    const tempPass = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPass, 10);

    const role = await prisma.role.findFirst({
      where: { nom: "Étudiant" }
    });

    if (!role) {
      return res.status(500).json({ message: "Le rôle Étudiant n'existe pas." });
    }

    const user = await prisma.user.create({
      data: {
        nom: `${candidat.nom} ${candidat.prenom}`,
        email: candidat.email,
        mot_de_passe: hashed,
        role_id: role.id,
        is_active: true,
        is_verified: true
      }
    });

    await prisma.candidat.update({
      where: { id },
      data: {
        statut: "ACCEPTEE",
        user_id: user.id
      }
    });

    res.json({message: "Candidature acceptée", temp_password: tempPass, user });

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Refuser une candidature
export const refuserCandidature = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { commentaire_admin } = req.body;

    if (!commentaire_admin)
      return res.status(400).json({ message: "Commentaire obligatoire." });

    const candidat = await prisma.candidat.update({
      where: { id },
      data: {
        statut: "REFUSEE",
        commentaire_admin
      }
    });

    res.json({message: "Candidature refusée.",candidat});

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getCandidatureStatut = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email)
      return res.status(400).json({ message: "Email obligatoire." });

    const candidat = await prisma.candidat.findUnique({
      where: { email: email.toString() },
      select: {
        statut: true,
        commentaire_admin: true,
      }
    });

    if (!candidat)
      return res.status(404).json({ message: "Candidature introuvable." });

    if (candidat.statut !== "REFUSEE") {
      candidat.commentaire_admin = null;
    }
    res.json(candidat);

  } catch (err) {
    res.status(500).json({ error: err });
  }
};

