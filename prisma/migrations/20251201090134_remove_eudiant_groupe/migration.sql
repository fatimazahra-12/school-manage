/*
  Warnings:

  - You are about to drop the `EtudiantGroupe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EtudiantGroupe" DROP CONSTRAINT "EtudiantGroupe_etudiant_id_fkey";

-- DropForeignKey
ALTER TABLE "EtudiantGroupe" DROP CONSTRAINT "EtudiantGroupe_groupe_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "EtudiantGroupe";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupeId_fkey" FOREIGN KEY ("groupeId") REFERENCES "Groupe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
