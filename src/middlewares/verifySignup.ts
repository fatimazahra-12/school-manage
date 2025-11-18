import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";

// Check if username or email already exists
export const checkDuplicateUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nom, email } = req.body;

    if (nom) {
      const userByName = await prisma.user.findFirst({ where: { nom: nom } });
      if (userByName) {
        return res.status(400).json({ message: "Failed! Name is already in use!" });
      }
    }

    if (email) {
      const userByEmail = await prisma.user.findUnique({ where: { email } });
      if (userByEmail) {
        return res.status(400).json({ message: "Failed! Email is already in use!" });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Check if the role exists
export const checkRoleExisted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleName = req.body.role || "user";
    const role = await prisma.role.findFirst({ where: { nom: roleName } });

    if (!role) {
      return res.status(400).json({ message: `Failed! Role ${roleName} does not exist!` });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
