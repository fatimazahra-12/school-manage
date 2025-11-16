/*
  Warnings:

  - You are about to drop the column `niveau` on the `Groupe` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatutCandidature" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- AlterTable
ALTER TABLE "Groupe" DROP COLUMN "niveau",
ADD COLUMN     "niveauId" INTEGER;

-- CreateTable
CREATE TABLE "Candidat" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "date_naissance" TIMESTAMP(3),
    "filiere_id" INTEGER NOT NULL,
    "statut" "StatutCandidature" NOT NULL DEFAULT 'EN_ATTENTE',
    "date_candidature" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentaire_admin" TEXT,
    "user_id" INTEGER,

    CONSTRAINT "Candidat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Niveau" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filiereId" INTEGER,

    CONSTRAINT "Niveau_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ressource" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "fichier_url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date_upload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "module_id" INTEGER NOT NULL,
    "enseignant_id" INTEGER NOT NULL,

    CONSTRAINT "Ressource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidat_email_key" ON "Candidat"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Niveau_code_key" ON "Niveau"("code");

-- AddForeignKey
ALTER TABLE "Candidat" ADD CONSTRAINT "Candidat_filiere_id_fkey" FOREIGN KEY ("filiere_id") REFERENCES "Filiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidat" ADD CONSTRAINT "Candidat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Niveau" ADD CONSTRAINT "Niveau_filiereId_fkey" FOREIGN KEY ("filiereId") REFERENCES "Filiere"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groupe" ADD CONSTRAINT "Groupe_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "Niveau"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ressource" ADD CONSTRAINT "Ressource_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ressource" ADD CONSTRAINT "Ressource_enseignant_id_fkey" FOREIGN KEY ("enseignant_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
