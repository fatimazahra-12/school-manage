
import { Request, Response, NextFunction } from "express";

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user)
    return res.status(401).json({ message: "Utilisateur non authentifié." }); 
  
    if (req.user.role.nom !== "Administrateur Système") {
      return res.status(403).json({ message: "Accès réservé à l'administrateur système." });
    }
  
    next();
};
  