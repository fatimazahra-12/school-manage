/* import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma/client';
const prisma = new PrismaClient();

export const attachPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const u = (req as any).user as { id: number; roleNom?: string; role?: string; permissions?: string[] };

    // accept either key, but prefer roleNom
    const roleNom = u?.roleNom ?? u?.role;
    if (!roleNom) return res.status(403).json({ error: 'No role provided' });

    const role = await prisma.role.findFirst({
      where: { nom: roleNom },
      include: { rolePermissions: { include: { permission: true } } },
    });
    if (!role) return res.status(403).json({ error: `Role '${roleNom}' not found` });

    (req as any).user.permissions = role.rolePermissions.map(rp => rp.permission.code);
    next();
  } catch (e) {
    console.error('attachPermissions error:', e);
    res.status(500).json({ error: 'Failed to load permissions' });
  }
};
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const attachPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Read mode at call time, so .env is already loaded in index.ts
    const mode = (process.env.AUTH_MODE || 'db').toLowerCase();

    // BYPASS mode for local testing: grant full access
    if (mode === 'off') {
      (req as any).user = { ...(req as any).user, permissions: ['*'] };
      return next();
    }

    // DB mode: load permissions from Role -> RolePermission -> Permission
    const u = (req as any).user as { roleNom?: string; role?: string; permissions?: string[] };
    const roleNom = u?.roleNom ?? u?.role;
    if (!roleNom) return res.status(403).json({ error: 'No role provided' });

    const role = await prisma.role.findFirst({
      where: { nom: roleNom },
      include: { rolePermissions: { include: { permission: true } } },
    });
    if (!role) return res.status(403).json({ error: `Role '${roleNom}' not found` });

    (req as any).user.permissions = role.rolePermissions.map(rp => rp.permission.code);
    return next();
  } catch (e) {
    console.error('attachPermissions error:', e);
    return res.status(500).json({ error: 'Failed to load permissions' });
  }
};
