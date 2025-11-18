/*
  Warnings:

  - Added the required column `filiere_id` to the `Ressource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ressource" ADD COLUMN     "filiere_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Ressource" ADD CONSTRAINT "Ressource_filiere_id_fkey" FOREIGN KEY ("filiere_id") REFERENCES "Filiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
