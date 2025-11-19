/*
  Warnings:

  - You are about to drop the column `niveau` on the `Groupe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Groupe" DROP COLUMN "niveau",
ADD COLUMN     "niveauId" INTEGER;

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

-- CreateIndex
CREATE UNIQUE INDEX "Niveau_code_key" ON "Niveau"("code");

-- AddForeignKey
ALTER TABLE "Niveau" ADD CONSTRAINT "Niveau_filiereId_fkey" FOREIGN KEY ("filiereId") REFERENCES "Filiere"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groupe" ADD CONSTRAINT "Groupe_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "Niveau"("id") ON DELETE SET NULL ON UPDATE CASCADE;
