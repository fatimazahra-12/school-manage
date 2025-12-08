import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { Permission, RolePermission } from "../generated/prisma/client.js";

// Vérifie si l'utilisateur connecté a la permission demandée
export const checkPermission = (permissionCode: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non authentifié." });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      });
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }

      const hasPermission = user.role.rolePermissions.some(
        (rp: RolePermission & { permission: Permission }) => rp.permission.code === permissionCode
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: `Accès refusé : permission "${permissionCode}" requise.`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la vérification des permissions.",
        error,
      });
    }
  };
};
