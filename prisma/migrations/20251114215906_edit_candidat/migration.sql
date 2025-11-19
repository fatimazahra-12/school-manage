/*
  Warnings:

  - Added the required column `niveau_etude` to the `Candidat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NiveauEtude" AS ENUM ('BAC', 'BAC_PLUS_1', 'BAC_PLUS_2', 'BAC_PLUS_3');

-- AlterTable
ALTER TABLE "Candidat" ADD COLUMN     "niveau_etude" "NiveauEtude" NOT NULL,
ADD COLUMN     "note_bac" DOUBLE PRECISION,
ADD COLUMN     "note_diplome" DOUBLE PRECISION,
ADD COLUMN     "type_diplome" TEXT;
