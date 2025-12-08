-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupeId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "groupeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupeId_fkey" FOREIGN KEY ("groupeId") REFERENCES "Groupe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
