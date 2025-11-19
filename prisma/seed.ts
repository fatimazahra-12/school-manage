/*
  Script d’initialisation de la base de données :
   - Rôles
   - Permissions
   - Associations rôle-permission
   - Super Administrateur par défaut
 */

   import prisma from "../src/config/prisma.ts";
   import bcrypt from "bcrypt";
   
   
   async function main() {
     console.log("Initialisation du seed Prisma");
   
     //RÔLES DE BASE
     const rolesData = [
       { nom: "Super Administrateur", description: "Accès complet à toutes les fonctionnalités" },
       { nom: "Administrateur Système", description: "Gère les utilisateurs, rôles, permissions et sécurité" },
       { nom: "Administrateur Pédagogique", description: "Gère les cours, enseignants, plannings, filières, groupes, salles" },
       { nom: "Administrateur Financier", description: "Gère les paiements et inscriptions" },
       { nom: "Administarteur Contenue", description: "Gère les actualités et événements" },
       { nom: "Enseignant", description: "Gère ses cours, absences, notes, examens et ressources" },
       { nom: "Étudiant", description: "Consulte ses cours, notes, ressources et absences" },
       { nom: "Parent", description: "Consulte les notes, absences et planning de ses enfants" },
     ];
   
     await prisma.role.createMany({ data: rolesData, skipDuplicates: true });
     console.log("Rôles insérés.");
   
     //PERMISSIONS PRINCIPALES
     const permissionsData = [
       // Auth & Système 
       { nom: "Gérer les utilisateurs", code: "USER_MANAGE", description: "Créer, modifier, supprimer des utilisateurs" },
       { nom: "Gérer les rôles et permissions", code: "ROLE_MANAGE", description: "Administrer les rôles et accès" },
       { nom: "Gérer les permissions", code: "PERMISSION_MANAGE", description: "Créer, modifier, supprimer des permissions" },
       { nom: "Voir les utilisateurs", code: "USER_VIEW", description: "Lister et consulter les utilisateurs" },
       { nom: "Modifier son profil", code: "AUTH_PROFILE", description: "Modifier son propre profil" },
       { nom: "Changer son mot de passe", code: "AUTH_PASSWORD_CHANGE", description: "Changer son mot de passe" },
   
       // Structure académique 
       { nom: "Gérer les filières", code: "FILIERE_MANAGE", description: "Créer ou modifier les filières" },
       { nom: "Voir les filières", code: "FILIERE_VIEW", description: "Consulter la liste des filières" },
       { nom: "Gérer les groupes", code: "GROUPE_MANAGE", description: "Créer ou modifier les groupes d'étudiants" },
       { nom: "Voir les groupes", code: "GROUPE_VIEW", description: "Consulter la liste des groupes" },
       { nom: "Gérer les classes", code: "CLASSE_MANAGE", description: "Créer ou modifier les classes/cours" },
       { nom: "Voir les classes", code: "CLASSE_VIEW", description: "Consulter les classes/cours" },
       { nom: "Gérer les salles", code: "SALLE_MANAGE", description: "Créer, modifier ou supprimer les salles" },
       { nom: "Voir les salles", code: "SALLE_VIEW", description: "Consulter les salles" },
   
       // Modules & ressources 
       { nom: "Gérer les modules", code: "MODULE_MANAGE", description: "Créer, modifier, supprimer les modules" },
       { nom: "Voir les modules", code: "MODULE_VIEW", description: "Consulter la liste des modules" },
       { nom: "Gérer les ressources", code: "RESSOURCE_MANAGE", description: "Publier ou modifier les ressources" },
       { nom: "Voir les ressources", code: "RESSOURCE_VIEW", description: "Consulter les ressources pédagogiques" },
   
       // Examens & notes 
       { nom: "Gérer les examens", code: "EXAM_MANAGE", description: "Créer et planifier les examens" },
       { nom: "Voir les examens", code: "EXAM_VIEW", description: "Consulter la liste des examens" },
       { nom: "Gérer les notes", code: "NOTE_MANAGE", description: "Saisir et modifier les notes" },
       { nom: "Voir les notes", code: "NOTE_VIEW", description: "Consulter ses notes" },
   
       // Absences & planning 
       { nom: "Gérer les absences", code: "ABSENCE_MANAGE", description: "Enregistrer et justifier les absences" },
       { nom: "Voir les absences", code: "ABSENCE_VIEW", description: "Consulter ses absences" },
       { nom: "Gérer le planning", code: "PLANNING_MANAGE", description: "Créer ou modifier les emplois du temps" },
       { nom: "Voir le planning", code: "PLANNING_VIEW", description: "Consulter son emploi du temps" },
   
       // Notifications & paramètres 
       { nom: "Gérer les notifications", code: "NOTIF_MANAGE", description: "Envoyer ou supprimer des notifications" },
       { nom: "Voir les notifications", code: "NOTIF_VIEW", description: "Consulter ses notifications" },
       { nom: "Gérer les paramètres système", code: "SETTINGS_MANAGE", description: "Modifier les paramètres globaux" },
       { nom: "Modifier ses préférences", code: "SETTINGS_VIEW", description: "Changer ses paramètres personnels" },

       // Actualités & événements
       { nom: "Gérer les actualités", code: "ACTUALITE_MANAGE", description: "Créer, modifier, supprimer des actualités" },
       { nom: "Voir les actualités", code: "ACTUALITE_VIEW", description: "Consulter les actualités" },
     ];
   
     await prisma.permission.createMany({ data: permissionsData, skipDuplicates: true });
     console.log("Permissions insérées.");
   
     //ASSOCIATION RÔLES ↔ PERMISSIONS
     const roles = await prisma.role.findMany();
     const allPermissions = await prisma.permission.findMany();
   
     const getRoleId = (nom: string) => roles.find((r: any) => r.nom === nom)?.id ?? null;
   
     async function assignPermissions(roleName: string, permissionCodes: string[]) {
       const roleId = getRoleId(roleName);
       if (!roleId) return;
   
       const toAssign = allPermissions
         .filter((p: any) => permissionCodes.includes(p.code))
         .map((p: any) => ({
           role_id: roleId,
           permission_id: p.id,
         }));
   
       await prisma.rolePermission.createMany({
         data: toAssign,
         skipDuplicates: true,
       });
     }
   
     // Super Admin 
     await assignPermissions("Super Administrateur", allPermissions.map((p: any) => p.code));
   
     // Administrateur Système 
     await assignPermissions("Administrateur Système", [
       "USER_MANAGE",
       "ROLE_MANAGE",
       "USER_VIEW",
       "SETTINGS_MANAGE",
       "NOTIF_MANAGE",
       "ACTUALITE_VIEW",
       "PERMISSION_MANAGE",
     ]);
   
     // Administrateur Pédagogique 
     await assignPermissions("Administrateur Pédagogique", [
       "FILIERE_MANAGE",
       "GROUPE_MANAGE",
       "CLASSE_MANAGE",
       "SALLE_MANAGE",
       "MODULE_MANAGE",
       "EXAM_MANAGE",
       "NOTE_MANAGE",
       "ABSENCE_MANAGE",
       "PLANNING_MANAGE",
       "NOTIF_MANAGE",
       "ACTUALITE_VIEW",
     ]);
   
     // Administrateur Financier
     await assignPermissions("Administrateur Financier", [
       "USER_VIEW",
       "SETTINGS_VIEW",
       "ACTUALITE_VIEW",
     ]);

     // Administrateur Contenue
     await assignPermissions("Administrateur Contenue", [
         "ACTUALITE_MANAGE",
         "NOTIF_MANAGE",
         "NOTIF_VIEW",
     ]);
   
     // Enseignant
     await assignPermissions("Enseignant", [
       "MODULE_MANAGE",
       "EXAM_MANAGE",
       "NOTE_MANAGE",
       "ABSENCE_MANAGE",
       "RESSOURCE_MANAGE",
       "CLASSE_MANAGE",
       "PLANNING_VIEW",
       "NOTE_VIEW",
       "NOTIF_VIEW",
       "GROUPE_VIEW",
       "FILIERE_VIEW",
       "SALLE_VIEW",
       "ACTUALITE_VIEW",
     ]);
   
     // Étudiant
     await assignPermissions("Étudiant", [
       "MODULE_VIEW",
       "RESSOURCE_VIEW",
       "NOTE_VIEW",
       "ABSENCE_VIEW",
       "PLANNING_VIEW",
       "NOTIF_VIEW",
       "GROUPE_VIEW",
       "FILIERE_VIEW",
       "EXAM_VIEW",
       "CLASSE_VIEW",
       "SALLE_VIEW",
       "ACTUALITE_VIEW",
     ]);
   
     // Parent
     await assignPermissions("Parent", [
       "NOTE_VIEW",
       "ABSENCE_VIEW",
       "PLANNING_VIEW",
       "NOTIF_VIEW",
       "FILIERE_VIEW",
       "GROUPE_VIEW",
     ]);
   
     console.log("Permissions assignées aux rôles.");
   
     // SUPER ADMIN PAR DÉFAUT
     const superAdminRole = roles.find((r: any) => r.nom === "Super Administrateur");
     if (superAdminRole) {
       const email = "superadmin@school.com";
       const existing = await prisma.user.findUnique({ where: { email } });
   
       if (!existing) {
         const hashedPassword = await bcrypt.hash("SuperAdmin@2025#", 20);
   
         await prisma.user.create({
           data: {
             nom: "Super Admin",
             email,
             mot_de_passe: hashedPassword,
             is_verified: true,
             is_active: true,
             role_id: superAdminRole.id,
           },
         });
   
         console.log("Super Administrateur créé avec succès");
         console.log("Email : superadmin@school.com");
       } else {
         console.log("Le Super Admin existe déjà, aucune création nécessaire.");
       }
     }
   
     console.log("Seed terminé avec succès !");
   }
   
   main()
     .then(async () => {
       await prisma.$disconnect();
     })
     .catch(async (e: Error) => {
       console.error("Erreur lors du seed :", e);
       await prisma.$disconnect();
       process.exit(1);
     });
   
