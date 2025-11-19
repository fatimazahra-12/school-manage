-- DropForeignKey
ALTER TABLE "Absence" DROP CONSTRAINT "Absence_cours_id_fkey";

-- DropForeignKey
ALTER TABLE "Cours" DROP CONSTRAINT "Cours_groupe_id_fkey";

-- DropForeignKey
ALTER TABLE "Cours" DROP CONSTRAINT "Cours_module_id_fkey";

-- DropForeignKey
ALTER TABLE "Cours" DROP CONSTRAINT "Cours_salle_id_fkey";

-- DropForeignKey
ALTER TABLE "EtudiantGroupe" DROP CONSTRAINT "EtudiantGroupe_groupe_id_fkey";

-- DropForeignKey
ALTER TABLE "Examen" DROP CONSTRAINT "Examen_module_id_fkey";

-- DropForeignKey
ALTER TABLE "Examen" DROP CONSTRAINT "Examen_salle_id_fkey";

-- DropForeignKey
ALTER TABLE "Groupe" DROP CONSTRAINT "Groupe_filiere_id_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_filiere_id_fkey";

-- DropForeignKey
ALTER TABLE "Niveau" DROP CONSTRAINT "Niveau_filiereId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_examen_id_fkey";

-- DropForeignKey
ALTER TABLE "Planning" DROP CONSTRAINT "Planning_cours_id_fkey";

-- AddForeignKey
ALTER TABLE "Niveau" ADD CONSTRAINT "Niveau_filiereId_fkey" FOREIGN KEY ("filiereId") REFERENCES "Filiere"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groupe" ADD CONSTRAINT "Groupe_filiere_id_fkey" FOREIGN KEY ("filiere_id") REFERENCES "Filiere"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtudiantGroupe" ADD CONSTRAINT "EtudiantGroupe_groupe_id_fkey" FOREIGN KEY ("groupe_id") REFERENCES "Groupe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_filiere_id_fkey" FOREIGN KEY ("filiere_id") REFERENCES "Filiere"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_salle_id_fkey" FOREIGN KEY ("salle_id") REFERENCES "Salle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_groupe_id_fkey" FOREIGN KEY ("groupe_id") REFERENCES "Groupe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examen" ADD CONSTRAINT "Examen_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examen" ADD CONSTRAINT "Examen_salle_id_fkey" FOREIGN KEY ("salle_id") REFERENCES "Salle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_examen_id_fkey" FOREIGN KEY ("examen_id") REFERENCES "Examen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "Cours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "Cours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
